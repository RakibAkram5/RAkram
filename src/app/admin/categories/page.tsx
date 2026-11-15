import { AdminHeading } from "@/components/admin/AdminShell";
import { CategoryManager } from "@/components/admin/Managers";

export const metadata = { title: "Categories" };

export default function Page() {
  return (
    <>
      <AdminHeading title="Categories" description="Data-driven category tree — new categories appear in navigation automatically." />
      <CategoryManager />
    </>
  );
}
