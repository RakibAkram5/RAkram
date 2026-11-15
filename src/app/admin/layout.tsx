import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · RAKRAM Admin" },
  robots: { index: false, follow: false },
};

/**
 * SECURITY (Phase 2): this route must be protected server-side — e.g. a
 * `proxy.ts` session check plus role verification in every admin API handler.
 * Do not rely on anything rendered here for access control.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
