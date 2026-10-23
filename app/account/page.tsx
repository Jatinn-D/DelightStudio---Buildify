import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "My Account — Delight Studio",
};

export default function AccountPage() {
  return (
    <>
      <Navbar forceSolid />
      <main className="min-h-screen bg-cream">
        <AccountDashboard />
      </main>
      <Footer />
    </>
  );
}
