"use client";

import { SettingsPanel } from "@/components/profile/SettingsPanel";
import { useMe } from "@/hooks/user/useMe";

export function MySettingsSection() {
  const { data: me } = useMe();
  if (!me) return null;
  return <SettingsPanel me={me} />;
}
