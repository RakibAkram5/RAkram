import { AdminHeading } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductsAdmin";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <>
      <AdminHeading title="Add product" description="All fields are validated here and must be re-validated by the server in Phase 2." />
      <ProductForm />
    </>
  );
}
