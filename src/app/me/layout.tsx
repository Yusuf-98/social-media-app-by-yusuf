import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "My Profile — Sociality",
};

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>
      {children}
    </>
  );
}
