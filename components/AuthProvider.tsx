"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/* Customer accounts — sign up, log in, profile and saved addresses.

   FRONT-END ONLY for now (the backend is separate and not wired up yet), so
   accounts are kept in this browser's localStorage, like the cart and the
   wishlist. Passwords are never stored as typed: each one is salted and hashed
   (SHA-256) first. When the backend is ready, replace the bodies of signUp,
   signIn, signOut, updateProfile and the address helpers with API calls — the
   pages only talk to this context, so nothing else needs to change. */

export type Address = {
  id: string;
  label: string; // "Home", "Work", …
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  addresses: Address[];
};

type StoredCustomer = Customer & { salt: string; passwordHash: string };

type Result = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: Customer | null;
  ready: boolean; // false until saved accounts have been read on the client
  signUp: (input: { name: string; email: string; phone: string; password: string }) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => void;
  updateProfile: (input: { name: string; phone: string }) => Result;
  saveAddress: (address: Omit<Address, "id" | "isDefault"> & { id?: string; isDefault?: boolean }) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

const USERS_KEY = "ds-customers";
const SESSION_KEY = "ds-session";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): StoredCustomer[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const data: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? (data as StoredCustomer[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredCustomer[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

/* Strip the password fields before handing a customer to the UI. */
function toPublic(u: StoredCustomer): Customer {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    createdAt: u.createdAt,
    addresses: u.addresses ?? [],
  };
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<StoredCustomer[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Load saved accounts + session after mount (keeps SSR and first paint in sync).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setUsers(readUsers());
      try {
        setSessionId(localStorage.getItem(SESSION_KEY));
      } catch {
        /* ignore */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const persistSession = (id: string | null) => {
    setSessionId(id);
    try {
      if (id) localStorage.setItem(SESSION_KEY, id);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  };

  const updateUsers = (fn: (list: StoredCustomer[]) => StoredCustomer[]) => {
    setUsers((prev) => {
      const next = fn(prev);
      writeUsers(next);
      return next;
    });
  };

  const current = users.find((u) => u.id === sessionId) ?? null;
  const user = current ? toPublic(current) : null;

  const value = useMemo<AuthContextValue>(() => {
    const signUp: AuthContextValue["signUp"] = async ({ name, email, phone, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const existing = readUsers();
      if (existing.some((u) => u.email === cleanEmail)) {
        return { ok: false, error: "An account with this email already exists. Log in instead." };
      }
      const salt = newId();
      const record: StoredCustomer = {
        id: newId(),
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        createdAt: new Date().toISOString(),
        addresses: [],
        salt,
        passwordHash: await hashPassword(password, salt),
      };
      const next = [...existing, record];
      writeUsers(next);
      setUsers(next);
      persistSession(record.id);
      return { ok: true };
    };

    const signIn: AuthContextValue["signIn"] = async (email, password) => {
      const cleanEmail = email.trim().toLowerCase();
      const found = readUsers().find((u) => u.email === cleanEmail);
      if (!found || (await hashPassword(password, found.salt)) !== found.passwordHash) {
        return { ok: false, error: "That email and password don't match. Check them and try again." };
      }
      setUsers(readUsers());
      persistSession(found.id);
      return { ok: true };
    };

    const signOut = () => persistSession(null);

    const updateProfile: AuthContextValue["updateProfile"] = ({ name, phone }) => {
      if (!sessionId) return { ok: false, error: "Log in to update your details." };
      updateUsers((list) =>
        list.map((u) => (u.id === sessionId ? { ...u, name: name.trim(), phone: phone.trim() } : u)),
      );
      return { ok: true };
    };

    const saveAddress: AuthContextValue["saveAddress"] = (input) => {
      if (!sessionId) return;
      updateUsers((list) =>
        list.map((u) => {
          if (u.id !== sessionId) return u;
          const addresses = u.addresses ?? [];
          const id = input.id ?? newId();
          const makeDefault = input.isDefault || addresses.length === 0;
          const entry: Address = { ...input, id, isDefault: makeDefault };
          const others = addresses
            .filter((a) => a.id !== id)
            .map((a) => (makeDefault ? { ...a, isDefault: false } : a));
          return { ...u, addresses: [entry, ...others] };
        }),
      );
    };

    const removeAddress: AuthContextValue["removeAddress"] = (id) => {
      if (!sessionId) return;
      updateUsers((list) =>
        list.map((u) => {
          if (u.id !== sessionId) return u;
          const remaining = (u.addresses ?? []).filter((a) => a.id !== id);
          if (remaining.length && !remaining.some((a) => a.isDefault)) remaining[0].isDefault = true;
          return { ...u, addresses: remaining };
        }),
      );
    };

    const setDefaultAddress: AuthContextValue["setDefaultAddress"] = (id) => {
      if (!sessionId) return;
      updateUsers((list) =>
        list.map((u) =>
          u.id === sessionId
            ? { ...u, addresses: (u.addresses ?? []).map((a) => ({ ...a, isDefault: a.id === id })) }
            : u,
        ),
      );
    };

    return { user, ready, signUp, signIn, signOut, updateProfile, saveAddress, removeAddress, setDefaultAddress };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, sessionId, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
