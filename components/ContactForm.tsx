"use client";

import { useActionState, useRef } from "react";
import { motion } from "motion/react";
import { sendContact, type ContactState } from "@/app/contact/actions";
import {
  formatCountdown,
  recordContactSend,
  useLocalLockedUntil,
  useNow,
} from "@/components/useContactCooldown";
import { site } from "@/content/site";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "bg-surface placeholder:text-muted/60 w-full rounded-xl border-2 border-transparent px-4 py-3 text-base outline-none transition-colors focus:border-primary aria-invalid:border-danger";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData) => {
      const result = await sendContact(prev, formData);
      if (result.status === "success") recordContactSend();
      return result;
    },
    initialState,
  );
  const startedAt = useRef<HTMLInputElement>(null);

  // Cooldown: from this browser's own history, or from the server's rate limit
  const lockedUntil = Math.max(useLocalLockedUntil(), state.retryAt ?? 0);
  const now = useNow(lockedUntil > 0);
  // Before the first clock tick, only trust the server's answer (avoids a flash)
  const isLocked = now === 0 ? (state.retryAt ?? 0) > 0 : now < lockedUntil;

  // Record when the visitor first interacts, for the "too fast = bot" check
  const markStarted = () => {
    if (startedAt.current && !startedAt.current.value) {
      startedAt.current.value = String(Date.now());
    }
  };

  if (state.status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, scale: 0.9, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-surface flex flex-col items-start gap-3 rounded-2xl p-8"
      >
        <motion.span
          aria-hidden="true"
          className="text-5xl"
          initial={{ rotate: -90, x: -40 }}
          animate={{ rotate: 0, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 12,
            delay: 0.1,
          }}
        >
          ⚽
        </motion.span>
        <h2 className="text-primary text-3xl font-bold tracking-tight">
          Golaço!
        </h2>
        <p className="text-muted text-lg">
          Your message is on its way. I&apos;ll get back to you soon.
        </p>
      </motion.div>
    );
  }

  if (isLocked) {
    const linkedIn = site.socials.find((s) => s.label === "LinkedIn");
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="bg-surface flex flex-col items-start gap-3 rounded-2xl p-8"
      >
        <span aria-hidden="true" className="text-5xl">
          ⏱️
        </span>
        <h2 className="text-3xl font-bold tracking-tight">Half-time!</h2>
        <p className="text-muted text-lg">
          You&apos;ve sent a couple of messages already, thank you. The form
          reopens in{" "}
          <span className="text-text font-mono font-semibold">
            {now === 0 ? "a few minutes" : formatCountdown(lockedUntil - now)}
          </span>
          .
        </p>
        {linkedIn && (
          <p className="text-muted text-sm">
            In a hurry? Find me on{" "}
            <a
              href={linkedIn.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline underline-offset-4"
            >
              LinkedIn
            </a>
            .
          </p>
        )}
      </motion.div>
    );
  }

  const fieldError = (field: keyof NonNullable<ContactState["errors"]>) =>
    state.errors?.[field]?.[0];

  return (
    <form
      action={formAction}
      onFocus={markStarted}
      noValidate
      className="flex flex-col gap-5"
    >
      <input ref={startedAt} type="hidden" name="startedAt" />

      {/* Honeypot: hidden from people, but bots fill in every field */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Name" htmlFor="name" error={fieldError("name")}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          aria-invalid={!!fieldError("name")}
          aria-describedby={fieldError("name") ? "name-error" : undefined}
          className={inputClass}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email" htmlFor="email" error={fieldError("email")}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          aria-invalid={!!fieldError("email")}
          aria-describedby={fieldError("email") ? "email-error" : undefined}
          className={inputClass}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Message" htmlFor="message" error={fieldError("message")}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={state.values?.message}
          aria-invalid={!!fieldError("message")}
          aria-describedby={fieldError("message") ? "message-error" : undefined}
          className={`${inputClass} resize-y`}
          placeholder="What would you like to talk about?"
        />
      </Field>

      {state.status === "error" && state.message && !state.retryAt && (
        <p role="alert" className="text-danger text-sm font-medium">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-bg focus-visible:outline-primary self-start rounded-full px-6 py-3 font-semibold transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:scale-100 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
