"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import type { MyProfile } from "@/types/api";

interface SettingsPanelProps {
  me: MyProfile;
}

export function SettingsPanel({ me }: SettingsPanelProps) {
  const handleLogout = useLogout();

  return (
    <div className="gap-xl flex w-full flex-col items-start">
      {/* Account Info */}
      <div className="gap-lg p-xl flex w-full flex-col items-start rounded-xl border border-neutral-900">
        <p className="text-md tracking-t-2 text-neutral-25 font-bold">Account</p>
        <div className="gap-md flex w-full flex-col items-start">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-neutral-400">Username</span>
            <span className="text-neutral-25 text-sm">{me.username}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-neutral-400">Email</span>
            <span className="text-neutral-25 text-sm">{me.email}</span>
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-neutral-400">Phone</span>
            <span className="text-neutral-25 text-sm">{me.phone ?? "-"}</span>
          </div>
        </div>
        <Button variant="secondary" render={<Link href="/me/edit" />} className="w-full">
          Edit Profile
        </Button>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="p-xl text-accent-red w-full rounded-xl border border-neutral-900 text-left text-sm font-bold"
      >
        Log Out
      </button>
    </div>
  );
}
