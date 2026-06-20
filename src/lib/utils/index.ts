import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style:    "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateConfirmCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/** Deep parse JSON fields stored as strings in SQLite */
export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; }
  catch { return fallback; }
}
