/**
 * Client-side validation for UX only.
 *
 * SECURITY: Never rely on these checks for security. Every value must be
 * re-validated and sanitised server-side in Phase 2 (e.g. with a shared
 * schema library on the API).
 */

export type Errors<T extends string> = Partial<Record<T, string>>;

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-z]{2,24}$/i;
/** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX / 923XXXXXXXXX */
const PK_MOBILE_RE = /^(?:\+?92|0)3\d{9}$/;
const POSTAL_RE = /^\d{5}$/;
const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]{1,79}$/u;

export function cleanText(v: string, max = 200): string {
  // Strip control characters and collapse whitespace; React escapes output.
  return v.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function normalisePhone(v: string): string {
  return v.replace(/[\s-]/g, "");
}

export const validators = {
  required: (v: string, label: string) => (cleanText(v).length ? undefined : `${label} is required`),
  name: (v: string) => {
    const s = cleanText(v);
    if (!s) return "Full name is required";
    if (!NAME_RE.test(s)) return "Please enter a valid name (letters only)";
    return undefined;
  },
  email: (v: string) => {
    const s = cleanText(v, 320);
    if (!s) return "Email is required";
    if (!EMAIL_RE.test(s)) return "Please enter a valid email address";
    return undefined;
  },
  phone: (v: string) => {
    const s = normalisePhone(v);
    if (!s) return "Mobile number is required";
    if (!PK_MOBILE_RE.test(s)) return "Use a Pakistani mobile number, e.g. 0300 1234567";
    return undefined;
  },
  postal: (v: string) => {
    const s = cleanText(v);
    if (!s) return "Postal code is required";
    if (!POSTAL_RE.test(s)) return "Postal code must be 5 digits";
    return undefined;
  },
  password: (v: string) => {
    if (!v) return "Password is required";
    if (v.length < 8) return "Use at least 8 characters";
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Include at least one letter and one number";
    return undefined;
  },
  maxLen: (v: string, max: number, label: string) =>
    v.length > max ? `${label} must be ${max} characters or fewer` : undefined,
  positiveInt: (v: string, label: string) =>
    /^\d+$/.test(v.trim()) && Number(v) > 0 ? undefined : `${label} must be a positive whole number`,
  nonNegativeInt: (v: string, label: string) =>
    /^\d+$/.test(v.trim()) ? undefined : `${label} must be a whole number (0 or more)`,
};

export function hasErrors<T extends string>(errors: Errors<T>): boolean {
  return Object.values(errors).some(Boolean);
}
