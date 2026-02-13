import type { Metadata } from "next";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Create product",
  description: "Create a new product with pricing, stock, and imagery.",
};

export default function NewProductPage() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-4xl rounded-2xl bg-card p-6 shadow-sm sm:p-10">
        <ProductForm mode="create" />
      </main>
    </div>
  );
}

