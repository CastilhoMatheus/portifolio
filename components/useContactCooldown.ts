"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Mirrors the server limit (lib/rate-limit.ts) so honest visitors see a countdown
// instead of hitting an error. The server limit is the real protection.
const MAX_SENDS = 2;
const WINDOW_MS = 30 * 60_000;

const STORAGE_KEY = "contact-sends";
const CHANGE_EVENT = "contact-sends-change";

function parseSends(raw: string): number[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return ""; // storage blocked (private mode, etc.)
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Remember a successful send in this browser. */
export function recordContactSend() {
  try {
    const now = Date.now();
    const recent = parseSends(readRaw()).filter((t) => t > now - WINDOW_MS);
    recent.push(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(-MAX_SENDS)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // storage blocked: the server limit still applies
  }
}

/** Timestamp (ms) until which this browser is in cooldown; 0 if it never filled the quota. */
export function useLocalLockedUntil() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const sends = parseSends(raw);
  return sends.length >= MAX_SENDS
    ? sends[sends.length - MAX_SENDS] + WINDOW_MS
    : 0;
}

/** Current time, ticking every second while `active`. 0 until the first tick. */
export function useNow(active: boolean) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!active) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [active]);

  return now;
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
