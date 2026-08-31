import type { Metadata } from "next";
import { SearchPanel } from "@/components/user/SearchPanel";

export const metadata: Metadata = {
  title: "Search — Sociality",
};

export default function UserSearchPage() {
  return <SearchPanel />;
}
