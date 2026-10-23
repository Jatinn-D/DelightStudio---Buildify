"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Heart, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type Mode = "login" | "signup";

const label = "mb-1.5 block font-nav text-[11px] uppercase tracking-[0.2em] text-ink/60";
const field =
  "w-full rounded-xl border border-taupe/60 bg-cream-soft px-4 py-3 font-sans text-[15px] text-ink placeholder:text-ink/35 transition focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/15";

/* Only allow redirects back into this site (never to another domain). */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const { user, ready, signIn, signUp } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already logged in → straight to the account page.
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (name.trim().length < 2) return setError("Enter your full name.");
      if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10)))
        return setError("Enter a valid 10-digit mobile number.");
      if (password.length < 8) return setError("Use at least 8 characters for your password.");
    }

    setBusy(true);
    const result =
      mode === "login"
        ? await signIn(email, password)
        : await signUp({ name, email, phone: phone.replace(/\D/g, "").slice(-10), password });
    setBusy(false);

    if (!result.ok) setError(result.error);
    else router.replace(next);
  };

  const isLogin = mode === "login";
  const switchHref = `${isLogin ? "/signup" : "/login"}${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="mx-auto grid max-w-360 gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-14 lg:px-10 lg:pt-32">
      {/* Editorial image panel (desktop) */}
      <div className="relative hidden min-h-[560px] overflow-hidden rounded-2xl bg-ink lg:block">
        <Image
          src="/images/hero.jpg"
          alt="Delight Studio saree"
          fill
          priority
          sizes="50vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="font-nav text-[11px] uppercase tracking-[0.28em] text-cream/80">Delight Studio</p>
          <p className="mt-3 max-w-md font-display text-4xl leading-[1.1] text-cream">
            Moderate price, high quality, complete customer satisfaction.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center">
        <div className="mx-auto w-full max-w-md">
          <p className="font-nav text-[11px] uppercase tracking-[0.28em] text-burgundy">My Account</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink/65">
            {isLogin
              ? "Log in to see your profile, saved addresses and wishlist."
              : "Save your details and addresses so checkout takes seconds."}
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className={label}>
                  Full name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Raman"
                  className={field}
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={field}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className={label}>
                  Mobile number
                </label>
                <div className="flex items-stretch overflow-hidden rounded-xl border border-taupe/60 bg-cream-soft transition focus-within:border-burgundy focus-within:ring-2 focus-within:ring-burgundy/15">
                  <span className="grid place-items-center border-r border-taupe/50 px-3.5 font-sans text-[15px] text-ink/60">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-transparent px-4 py-3 font-sans text-[15px] text-ink placeholder:text-ink/35 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className={label}>
                  Password
                </label>
                {!isLogin && <span className="font-sans text-xs text-ink/45">At least 8 characters</span>}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your password" : "Create a password"}
                  className={`${field} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink/50 transition hover:text-burgundy"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-burgundy/8 px-4 py-3 font-sans text-sm text-burgundy">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy py-3.5 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90 disabled:opacity-70"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-ink/65">
            {isLogin ? "New to Delight Studio?" : "Already have an account?"}{" "}
            <Link href={switchHref} className="font-medium text-burgundy underline-offset-4 hover:underline">
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>

          {!isLogin && (
            <ul className="mt-8 space-y-3 border-t border-taupe/40 pt-6">
              <li className="flex items-center gap-3 font-sans text-sm text-ink/70">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-taupe-soft/70">
                  <MapPin className="h-4 w-4 text-burgundy" />
                </span>
                Save delivery addresses for a faster checkout
              </li>
              <li className="flex items-center gap-3 font-sans text-sm text-ink/70">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-taupe-soft/70">
                  <Heart className="h-4 w-4 text-burgundy" />
                </span>
                Keep your favourite pieces in one place
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
