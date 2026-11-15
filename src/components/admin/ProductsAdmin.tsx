"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash, TriangleExclamationPoint } from "lucide-react";
import type { Product, ProductTag } from "@/lib/types";
import { categories } from "@/data/categories";
import { allProducts } from "@/lib/catalog";
import { cleanText, hasErrors, validators, type Errors } from "@/lib/validation";
import { formatPKR, stockStatus } from "@/lib/format";
import { ui } from "@/store/ui";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Overlay";
import { StockIndicator } from "@/components/ui/bits";
import { DataTable, Panel } from "./AdminShell";

/* ---------------- Product list ---------------- */
export function ProductsTable() {
  const [rows, setRows] = useState<Product[]>(allProducts);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [stock, setStock] = useState("");
  const [confirm, setConfirm] = useState<Product | null>(null);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter(
      (p) =>
        (!t || p.name.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t)) &&
        (!cat || p.category === cat) &&
        (!stock || stockStatus(p.stock) === stock),
    );
  }, [rows, q, cat, stock]);

  return (
    <Panel>
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint" aria-hidden />
          <label htmlFor="pq" className="sr-only">Search products</label>
          <input id="pq" value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} placeholder="Search name, SKU or brand" className="field h-11 pl-11" />
        </div>
        <label htmlFor="pcat" className="sr-only">Filter by category</label>
        <select id="pcat" value={cat} onChange={(e) => setCat(e.target.value)} className="field h-11 py-0">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <label htmlFor="pstock" className="sr-only">Filter by stock</label>
        <select id="pstock" value={stock} onChange={(e) => setStock(e.target.value)} className="field h-11 py-0">
          <option value="">Any stock</option>
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </select>
      </div>
      <p className="mb-3 text-xs text-faint">{shown.length} of {rows.length} products</p>
      <DataTable label="Products">
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-right">Price</th>
            <th scope="col">Stock</th>
            <th scope="col" className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="flex items-center gap-3">
                  <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-3">
                    <ProductImage image={p.images[0]} sizes="40px" />
                  </span>
                  <span className="min-w-0">
                    <span className="block max-w-[260px] truncate font-medium">{p.name}</span>
                    <span className="block text-xs text-faint">{p.sku}</span>
                  </span>
                </div>
              </td>
              <td className="text-muted">{categories.find((c) => c.slug === p.category)?.name}</td>
              <td className="text-right tabular-nums">{formatPKR(p.price)}</td>
              <td>
                <StockIndicator stock={p.stock} /> <span className="text-xs text-faint tabular-nums">({p.stock})</span>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <Link href={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/8 hover:text-fg">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={() => setConfirm(p)} aria-label={`Delete ${p.name}`} className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-red-500/10 hover:text-danger">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete product?">
        {confirm && (
          <div className="p-6">
            <div className="flex gap-4 rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4 text-sm">
              <TriangleExclamationPoint className="h-5 w-5 shrink-0 text-danger" aria-hidden />
              <p className="text-muted">
                <span className="font-semibold text-fg">{confirm.name}</span> ({confirm.sku}) will be permanently removed from the catalogue. This cannot be undone.
              </p>
            </div>
            <p className="mt-4 text-xs text-faint">Demo: removal only affects this table until you reload.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirm(null)} data-autofocus>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setRows((r) => r.filter((x) => x.id !== confirm.id));
                  ui.toast(`${confirm.name} deleted (demo)`, "success");
                  setConfirm(null);
                }}
              >
                <Trash className="h-4 w-4" /> Delete product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Panel>
  );
}

/* ---------------- Product form ---------------- */
type F = "name" | "brand" | "category" | "subcategory" | "price" | "compareAtPrice" | "stock" | "sku" | "shortDescription" | "description" | "image";
const ALLOWED_IMAGE_HOSTS = ["images.unsplash.com"];

function validImage(v: string) {
  const s = v.trim();
  if (!s) return "Image is required";
  if (/^\d{10,13}-[0-9a-f]{12}$/.test(s)) return undefined; // Unsplash photo id
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" || !ALLOWED_IMAGE_HOSTS.includes(u.hostname)) return `Use an https image from: ${ALLOWED_IMAGE_HOSTS.join(", ")}`;
    return undefined;
  } catch {
    return "Enter an Unsplash photo id or an https image URL";
  }
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [v, setV] = useState<Record<F, string>>({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? "",
    subcategory: product?.subcategory ?? "",
    price: product?.price.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    stock: product?.stock.toString() ?? "",
    sku: product?.sku ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    image: product?.images[0].src ?? "",
  });
  const [tags, setTags] = useState<ProductTag[]>(product?.tags ?? []);
  const [errors, setErrors] = useState<Errors<F>>({});
  const subs = categories.find((c) => c.slug === v.category)?.subcategories ?? [];
  const bind = (f: F) => ({
    value: v[f],
    error: errors[f],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [f]: e.target.value, ...(f === "category" ? { subcategory: "" } : {}) })),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors<F> = {
      name: validators.required(v.name, "Name") ?? validators.maxLen(cleanText(v.name), 100, "Name"),
      brand: validators.required(v.brand, "Brand"),
      category: v.category ? undefined : "Select a category",
      subcategory: v.subcategory ? undefined : "Select a subcategory",
      price: validators.positiveInt(v.price, "Price"),
      compareAtPrice: v.compareAtPrice ? validators.positiveInt(v.compareAtPrice, "Compare-at price") ?? (Number(v.compareAtPrice) <= Number(v.price) ? "Must be higher than price" : undefined) : undefined,
      stock: validators.nonNegativeInt(v.stock, "Stock"),
      sku: /^[A-Z0-9-]{4,24}$/.test(v.sku.trim()) ? undefined : "SKU: 4–24 uppercase letters, digits or dashes",
      shortDescription: validators.required(v.shortDescription, "Short description") ?? validators.maxLen(v.shortDescription, 160, "Short description"),
      description: validators.maxLen(v.description, 2000, "Description"),
      image: validImage(v.image),
    };
    setErrors(errs);
    if (hasErrors(errs)) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    ui.toast(product ? "Changes validated — not saved (demo)" : "Product validated — not saved (demo)", "success");
    router.push("/admin/products");
  };

  return (
    <form noValidate onSubmit={submit} className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <Panel title="Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Product name" required maxLength={100} className="sm:col-span-2" {...bind("name")} />
            <TextField label="Brand" required maxLength={60} {...bind("brand")} />
            <TextField label="SKU" required maxLength={24} placeholder="RK-WAT-1001" {...bind("sku")} onChange={(e) => setV((s) => ({ ...s, sku: e.target.value.toUpperCase() }))} />
            <TextArea label="Short description" required maxLength={160} rows={2} className="sm:col-span-2" hint={`${v.shortDescription.length}/160`} {...bind("shortDescription")} />
            <TextArea label="Full description" maxLength={2000} rows={5} className="sm:col-span-2" hint="Plain text only — HTML is not rendered" {...bind("description")} />
          </div>
        </Panel>
        <Panel title="Pricing & inventory">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Price (PKR)" required inputMode="numeric" maxLength={9} {...bind("price")} />
            <TextField label="Compare-at price (PKR)" inputMode="numeric" maxLength={9} hint="Optional, for discounts" {...bind("compareAtPrice")} />
            <TextField label="Stock units" required inputMode="numeric" maxLength={6} {...bind("stock")} />
          </div>
        </Panel>
      </div>
      <div className="space-y-6">
        <Panel title="Organisation">
          <div className="space-y-4">
            <SelectField label="Category" required placeholder="Select category" options={categories.map((c) => ({ value: c.slug, label: c.name }))} {...bind("category")} />
            <SelectField label="Subcategory" required disabled={!v.category} placeholder="Select subcategory" options={subs.map((s) => ({ value: s.slug, label: s.name }))} {...bind("subcategory")} />
            <fieldset>
              <legend className="mb-2 text-xs font-semibold text-silver">Collections</legend>
              <div className="flex flex-wrap gap-2">
                {(["new", "bestseller", "trending", "featured"] as ProductTag[]).map((t) => (
                  <label key={t} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs capitalize has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-ink">
                    <input type="checkbox" className="sr-only" checked={tags.includes(t)} onChange={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))} />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </Panel>
        <Panel title="Media">
          <TextField label="Main image" required placeholder="Unsplash id or https URL" hint="Uploads will use signed server uploads in Phase 2" {...bind("image")} />
          {!validImage(v.image) && (
            <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-2xl bg-ink-3">
              <ProductImage image={{ src: v.image.trim(), alt: "Preview" }} sizes="300px" />
            </div>
          )}
        </Panel>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {product ? "Save changes" : "Create product"}
          </Button>
          <ButtonLink href="/admin/products" variant="ghost">
            Cancel
          </ButtonLink>
        </div>
      </div>
    </form>
  );
}

export function NewProductButton() {
  return (
    <ButtonLink href="/admin/products/new" size="sm">
      <Plus className="h-4 w-4" /> Add product
    </ButtonLink>
  );
}
