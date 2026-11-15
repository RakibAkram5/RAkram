import { notFound } from "next/navigation";
import { allProducts, getProductById } from "@/lib/catalog";
import { AdminHeading } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductsAdmin";

export const metadata = { title: "Edit product" };

export function generateStaticParams() {
  return allProducts.map((p) => ({ id: p.id }));
}

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  return (
    <>
      <AdminHeading title="Edit product" description={`${product.name} · ${product.sku}`} />
      <ProductForm product={product} />
    </>
  );
}
