import type { Metadata } from "next";
import { ProductForm } from "../../product-form";

export const metadata: Metadata = {
  title: "Edit product",
  description: "Edit an existing product’s details.",
};

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export default function EditProductPage(_props: EditProductPageProps) {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-4xl rounded-2xl bg-card p-6 shadow-sm sm:p-10">
        <ProductForm mode="edit" />
      </main>
    </div>
  );
}

