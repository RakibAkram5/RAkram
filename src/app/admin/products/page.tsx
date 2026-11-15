import { AdminHeading } from "@/components/admin/AdminShell";
import { NewProductButton, ProductsTable } from "@/components/admin/ProductsAdmin";

export const metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <>
      <AdminHeading title="Products" description="Manage the catalogue. Edits are demo-only until the API is connected." action={<NewProductButton />} />
      <ProductsTable />
    </>
  );
}
