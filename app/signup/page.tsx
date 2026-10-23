import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/account/AuthForm";

export const metadata: Metadata = {
  title: "Create an account — Delight Studio",
  description: "Create a Delight Studio account to save addresses and favourites.",
};

export default function SignupPage() {
  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-cream">
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <AuthForm mode="signup" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
