"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Heart, LogOut, MapPin, Package, Pencil, Plus, Trash2, User } from "lucide-react";
import { useAuth, type Address } from "@/components/AuthProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import { getCatalogProduct } from "@/lib/data";

type Tab = "profile" | "addresses" | "orders" | "wishlist";

const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "addresses", label: "Addresses", Icon: MapPin },
  { id: "orders", label: "Orders", Icon: Package },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
];

const label = "mb-1.5 block font-nav text-[11px] uppercase tracking-[0.2em] text-ink/60";
const field =
  "w-full rounded-xl border border-taupe/60 bg-cream-soft px-4 py-3 font-sans text-[15px] text-ink placeholder:text-ink/35 transition focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/15";
const primaryBtn =
  "rounded-full bg-burgundy px-7 py-3 font-nav text-sm uppercase tracking-[0.16em] text-cream transition hover:bg-burgundy/90";
const outlineBtn =
  "rounded-full border border-ink/20 px-5 py-2.5 font-nav text-xs uppercase tracking-[0.14em] text-ink/75 transition hover:border-burgundy hover:text-burgundy";
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

function EmptyState({
  Icon,
  title,
  body,
  href,
  cta,
}: {
  Icon: typeof User;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-taupe/40 bg-cream-soft px-8 py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-taupe-soft/70">
        <Icon className="h-7 w-7 text-burgundy" />
      </div>
      <div>
        <p className="font-display text-2xl text-ink">{title}</p>
        <p className="mt-1 font-sans text-sm text-ink/55">{body}</p>
      </div>
      <Link href={href} className={`mt-2 ${primaryBtn}`}>
        {cta}
      </Link>
    </div>
  );
}

function ProfilePanel() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10)))
      return setError("Enter a valid 10-digit mobile number.");
    const res = updateProfile({ name, phone: phone.replace(/\D/g, "").slice(-10) });
    if (!res.ok) return setError(res.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <form onSubmit={onSave} noValidate className="max-w-xl space-y-5">
      <div>
        <label htmlFor="acc-name" className={label}>
          Full name
        </label>
        <input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="acc-email" className={label}>
          Email
        </label>
        <input id="acc-email" value={user?.email ?? ""} readOnly className={`${field} cursor-not-allowed opacity-60`} />
      </div>
      <div>
        <label htmlFor="acc-phone" className={label}>
          Mobile number
        </label>
        <input
          id="acc-phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={field}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-burgundy/8 px-4 py-3 font-sans text-sm text-burgundy">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" className={primaryBtn}>
          Save changes
        </button>
        <span
          aria-live="polite"
          className={`flex items-center gap-1.5 font-sans text-sm text-burgundy transition-opacity ${
            saved ? "opacity-100" : "opacity-0"
          }`}
        >
          <Check className="h-4 w-4" /> Changes saved
        </span>
      </div>
    </form>
  );
}

const EMPTY_ADDRESS = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "",
};

function AddressForm({
  initial,
  onDone,
}: {
  initial?: Address;
  onDone: () => void;
}) {
  const { user, saveAddress } = useAuth();
  const [form, setForm] = useState(
    initial
      ? { ...initial, line2: initial.line2 ?? "" }
      : { ...EMPTY_ADDRESS, name: user?.name ?? "", phone: user?.phone ?? "" },
  );
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof EMPTY_ADDRESS) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.state.trim())
      return setError("Fill in the name, address, city and state.");
    if (!/^\d{6}$/.test(form.pincode.trim())) return setError("Enter a valid 6-digit pincode.");
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10)))
      return setError("Enter a valid 10-digit mobile number.");
    saveAddress({
      id: initial?.id,
      isDefault: initial?.isDefault,
      label: form.label,
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, "").slice(-10),
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    });
    onDone();
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-taupe/40 bg-cream-soft p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {["Home", "Work", "Other"].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => set("label")(l)}
            className={`rounded-full px-4 py-1.5 font-nav text-[11px] uppercase tracking-[0.14em] transition ${
              form.label === l ? "bg-burgundy text-cream" : "bg-taupe-soft/70 text-ink/70 hover:text-burgundy"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ad-name" className={label}>Full name</label>
          <input id="ad-name" value={form.name} onChange={(e) => set("name")(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="ad-phone" className={label}>Mobile number</label>
          <input id="ad-phone" type="tel" inputMode="numeric" value={form.phone} onChange={(e) => set("phone")(e.target.value)} className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="ad-line1" className={label}>Address</label>
        <input id="ad-line1" value={form.line1} onChange={(e) => set("line1")(e.target.value)} placeholder="House no., street" className={field} />
      </div>
      <div>
        <label htmlFor="ad-line2" className={label}>Area / landmark (optional)</label>
        <input id="ad-line2" value={form.line2} onChange={(e) => set("line2")(e.target.value)} className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="ad-city" className={label}>City</label>
          <input id="ad-city" value={form.city} onChange={(e) => set("city")(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="ad-state" className={label}>State</label>
          <input id="ad-state" value={form.state} onChange={(e) => set("state")(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="ad-pin" className={label}>Pincode</label>
          <input id="ad-pin" inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode")(e.target.value)} className={field} />
        </div>
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-burgundy/8 px-4 py-3 font-sans text-sm text-burgundy">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={primaryBtn}>
          {initial ? "Save address" : "Add address"}
        </button>
        <button type="button" onClick={onDone} className={outlineBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressesPanel() {
  const { user, removeAddress, setDefaultAddress } = useAuth();
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const addresses = user?.addresses ?? [];

  return (
    <div className="space-y-5">
      {editing === "new" ? (
        <AddressForm onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("new")} className={`${outlineBtn} inline-flex items-center gap-2`}>
          <Plus className="h-4 w-4" /> Add a new address
        </button>
      )}

      {addresses.length === 0 && editing !== "new" && (
        <p className="font-sans text-sm text-ink/55">You haven&rsquo;t saved an address yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((a) =>
          editing && editing !== "new" && editing.id === a.id ? (
            <div key={a.id} className="md:col-span-2">
              <AddressForm initial={a} onDone={() => setEditing(null)} />
            </div>
          ) : (
            <div key={a.id} className="rounded-2xl border border-taupe/40 bg-cream-soft p-5">
              <div className="flex items-center gap-2">
                <span className="font-nav text-[11px] uppercase tracking-[0.18em] text-ink/70">{a.label}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-burgundy px-2.5 py-0.5 font-nav text-[10px] uppercase tracking-[0.12em] text-cream">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 font-sans text-[15px] font-medium text-ink">{a.name}</p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-ink/65">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
                <br />
                {a.city}, {a.state} {a.pincode}
                <br />
                +91 {a.phone}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(a)} className={`${outlineBtn} inline-flex items-center gap-1.5`}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                {!a.isDefault && (
                  <button type="button" onClick={() => setDefaultAddress(a.id)} className={outlineBtn}>
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAddress(a.id)}
                  className={`${outlineBtn} inline-flex items-center gap-1.5`}
                  aria-label={`Remove ${a.label} address`}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function WishlistPanel() {
  const { favorites, setOpen } = useFavorites();
  const items = favorites
    .map((f) => getCatalogProduct(f.slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0)
    return (
      <EmptyState
        Icon={Heart}
        title="No favourites yet"
        body="Tap the heart on anything you love and it will wait for you here."
        href="/shop/new"
        cta="Explore new arrivals"
      />
    );

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <Link key={p.slug} href={p.href} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-taupe-soft">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(min-width:1024px) 20vw, 45vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 font-sans text-sm text-ink">{p.name}</p>
            <p className="font-nav text-sm text-ink/70">{inr(p.price)}</p>
          </Link>
        ))}
      </div>
      <button type="button" onClick={() => setOpen(true)} className={`mt-6 ${outlineBtn}`}>
        Open wishlist
      </button>
    </div>
  );
}

export default function AccountDashboard() {
  const { user, ready, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const signingOut = useRef(false);

  // Logged-out visitors go to the login page, then come back here.
  // (Skipped when the customer has just pressed "Log out" themselves.)
  useEffect(() => {
    if (ready && !user && !signingOut.current) router.replace("/login?next=/account");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="min-h-[60vh]" aria-busy="true" />;
  }

  const firstName = user.name.split(" ")[0] || user.name;
  const since = new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const onSignOut = () => {
    signingOut.current = true;
    signOut();
    router.replace("/login");
  };

  return (
    <div className="mx-auto max-w-360 px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pt-32">
      <div className="flex flex-col gap-4 border-b border-taupe/40 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-nav text-[11px] uppercase tracking-[0.28em] text-burgundy">My Account</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
            Hello, {firstName}
          </h1>
          <p className="mt-2 font-sans text-sm text-ink/55">Member since {since}</p>
        </div>
        <button type="button" onClick={onSignOut} className={`${outlineBtn} inline-flex items-center gap-2 self-start sm:self-auto`}>
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav aria-label="Account sections" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
          {TABS.map(({ id, label: text, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 font-nav text-[12px] uppercase tracking-[0.12em] transition lg:rounded-xl ${
                tab === id ? "bg-burgundy text-cream" : "text-ink/70 hover:bg-taupe-soft/60 hover:text-burgundy"
              }`}
            >
              <Icon className="h-4 w-4" />
              {text}
            </button>
          ))}
        </nav>

        <section>
          <h2 className="mb-6 font-display text-3xl text-ink">{TABS.find((t) => t.id === tab)?.label}</h2>
          {tab === "profile" && <ProfilePanel />}
          {tab === "addresses" && <AddressesPanel />}
          {tab === "orders" && (
            <EmptyState
              Icon={Package}
              title="No orders yet"
              body="When you place an order, you'll find it here."
              href="/shop/new"
              cta="Start shopping"
            />
          )}
          {tab === "wishlist" && <WishlistPanel />}
        </section>
      </div>
    </div>
  );
}
