"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { hasErrors, validators, type Errors } from "@/lib/validation";
import { sessionStore } from "@/store/ui";
import { ui } from "@/store/ui";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { DemoNotice } from "@/components/ui/bits";

/**
 * DEMO AUTH UI. Credentials are validated for format only and then discarded:
 * nothing is stored, hashed, or sent. A boolean "demo signed-in" flag is the
 * only thing persisted. Real auth arrives in Phase 2 (server sessions).
 */

function PasswordField({ label, value, onChange, error, autoComplete, onBlur }: { label: string; value: string; onChange: (v: string) => void; error?: string; autoComplete: string; onBlur?: () => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextField label={label} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} autoComplete={autoComplete} maxLength={128} required error={error} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-[30px] right-2 flex h-9 w-9 items-center justify-center rounded-full text-faint hover:text-fg">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass-strong edge rounded-[28px] p-6 sm:p-9">
        <p className="eyebrow">RAKRAM account</p>
        <h1 className="mt-3 font-display text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <DemoNotice className="mt-6">Authentication is a demonstration. No account is created and passwords are never stored or transmitted.</DemoNotice>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors<"email" | "password">>({});
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to view orders, addresses and your wishlist." footer={<>New to RAKRAM? <Link href="/account/register" className="text-fg underline underline-offset-4">Create an account</Link></>}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const errs = { email: validators.email(email), password: password ? undefined : "Password is required" };
          setErrors(errs);
          if (hasErrors(errs)) return;
          setPassword("");
          sessionStore.set({ signedIn: true });
          ui.toast("Signed in to the demo account", "success");
          router.push("/account");
        }}
      >
        <TextField label="Email" type="email" inputMode="email" autoComplete="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField label="Password" value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />
        <div className="flex justify-end">
          <Link href="/account/forgot-password" className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full">
          <Lock className="h-4 w-4" /> Sign in (demo)
        </Button>
      </form>
    </AuthCard>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [v, setV] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors<"name" | "email" | "phone" | "password" | "confirm" | "agree">>({});
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  return (
    <AuthCard title="Create account" subtitle="Faster checkout, order tracking and saved addresses." footer={<>Already have an account? <Link href="/account/login" className="text-fg underline underline-offset-4">Sign in</Link></>}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const errs = {
            name: validators.name(v.name),
            email: validators.email(v.email),
            phone: validators.phone(v.phone),
            password: validators.password(v.password),
            confirm: v.confirm !== v.password ? "Passwords do not match" : undefined,
            agree: agree ? undefined : "Please accept the terms to continue",
          };
          setErrors(errs);
          if (hasErrors(errs)) return;
          setV({ name: "", email: "", phone: "", password: "", confirm: "" });
          sessionStore.set({ signedIn: true });
          ui.toast("Demo account ready", "success");
          router.push("/account");
        }}
      >
        <TextField label="Full name" autoComplete="name" required maxLength={80} value={v.name} onChange={set("name")} error={errors.name} />
        <TextField label="Email" type="email" inputMode="email" autoComplete="email" required maxLength={320} value={v.email} onChange={set("email")} error={errors.email} />
        <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" required maxLength={16} value={v.phone} onChange={set("phone")} error={errors.phone} />
        <PasswordField label="Password" value={v.password} onChange={(x) => setV((s) => ({ ...s, password: x }))} error={errors.password} autoComplete="new-password" />
        <PasswordField label="Confirm password" value={v.confirm} onChange={(x) => setV((s) => ({ ...s, confirm: x }))} error={errors.confirm} autoComplete="new-password" />
        <label className="flex items-start gap-3 text-xs text-muted">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-white" aria-invalid={errors.agree ? true : undefined} />
          <span>I agree to the terms of service and privacy policy (to be published at launch).</span>
        </label>
        {errors.agree && (
          <p role="alert" className="text-xs text-danger">
            {errors.agree}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full">
          Create account (demo)
        </Button>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  return (
    <AuthCard title="Reset password" subtitle="Enter your email and we’ll send a secure reset link." footer={<Link href="/account/login" className="text-fg underline underline-offset-4">Back to sign in</Link>}>
      {sent ? (
        <div role="status" className="rounded-2xl border border-line p-5 text-sm text-muted">
          If an account exists for <span className="text-fg">{email}</span>, a reset link would be sent. <strong className="text-fg">In this demo no email is sent.</strong>
        </div>
      ) : (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const err = validators.email(email);
            setError(err);
            if (!err) setSent(true);
          }}
        >
          <TextField label="Email" type="email" inputMode="email" autoComplete="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" size="lg" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
