import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Log in — Delight Studio",
  description: "Log in to your Delight Studio account.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-cream">
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <AuthForm mode="login" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
