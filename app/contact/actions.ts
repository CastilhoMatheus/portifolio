"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import ContactEmail from "@/emails/ContactEmail";
import { limitContact } from "@/lib/rate-limit";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell me your name.")
    .max(100, "That name is a bit long."),
  email: z.email("That doesn't look like a valid email."),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail, please (10+ characters).")
    .max(5000, "Please keep it under 5000 characters."),
});

type Fields = z.infer<typeof schema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof Fields, string[]>>;
  /** Sent back on error so the form keeps what the visitor typed. */
  values?: Partial<Fields>;
  /** When rate-limited: timestamp (ms) when the visitor can send again. */
  retryAt?: number;
};

/** Humans need more than this to fill the form; bots submit instantly. */
const MIN_FILL_TIME_MS = 3000;

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Spam checks: pretend it worked so bots don't learn to adapt
  const honeypot = formData.get("company");
  // startedAt is set by JS on first focus. If it's missing (JS not loaded yet,
  // or disabled), skip the timing check and rely on the honeypot instead,
  // so a real visitor on a slow connection is never silently dropped.
  const startedAt = Number(formData.get("startedAt"));
  const tooFast = startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
    };
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error(
      "Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set",
    );
    return {
      status: "error",
      message:
        "The contact form isn't set up yet. Please reach me on LinkedIn.",
      values: raw,
    };
  }

  const { name, email, message } = parsed.data;

  // Counted only once the message is valid, so typos don't use up the limit
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";
  const limit = await limitContact([
    `ip:${ip}`,
    `email:${email.toLowerCase()}`,
  ]);
  if (!limit.ok) {
    const minutes = Math.max(
      1,
      Math.ceil((limit.retryAt - Date.now()) / 60_000),
    );
    return {
      status: "error",
      message:
        limit.reason === "daily"
          ? "I've had a lot of messages today. Please try again tomorrow, or reach me on LinkedIn."
          : `You've sent a couple of messages already. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      values: raw,
      retryAt: limit.retryAt,
    };
  }

  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    // Resend's test sender works without a domain, but only delivers to your own Resend account email
    from: CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to: CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    react: ContactEmail({ name, email, message }),
  });

  if (error) {
    console.error("Contact form: Resend error", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
      values: raw,
    };
  }

  return { status: "success" };
}
