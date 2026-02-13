\"use client\";

import { useState, FormEvent } from \"react\";
import { Button } from \"@/components/ui/button\";

type ProductFormProps = {
  mode: \"create\" | \"edit\";
};

export function ProductForm({ mode }: ProductFormProps) {
  const [name, setName] = useState(\"\");
  const [slug, setSlug] = useState(\"\");
  const [price, setPrice] = useState(\"\");
  const [stock, setStock] = useState(\"\");
  const [category, setCategory] = useState(\"\");
  const [description, setDescription] = useState(\"\");
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const title = mode === \"create\" ? \"Create product\" : \"Edit product\";
  const submitLabel = mode === \"create\" ? \"Create product\" : \"Save changes\";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Wire up to real tRPC mutation once backend is ready.
    setSubmitted(true);
  }

  return (
    <div className=\"space-y-6\">
      <header className=\"space-y-2\">
        <h1 className=\"text-2xl font-semibold tracking-tight text-foreground sm:text-3xl\">
          {title}
        </h1>
        <p className=\"text-sm text-muted-foreground sm:text-base\">
          Manage core product details including pricing, stock, and imagery. This form is designed
          for admin use only.
        </p>
      </header>

      <form onSubmit={handleSubmit} className=\"space-y-6\">
        <div className=\"grid gap-4 sm:grid-cols-2\">
          <div className=\"space-y-2 sm:col-span-1\">
            <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"name\">
              Name
            </label>
            <input
              id=\"name\"
              name=\"name\"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder=\"Premium cotton t‑shirt\"
              className=\"block w-full rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
            />
          </div>

          <div className=\"space-y-2 sm:col-span-1\">
            <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"slug\">
              Slug
            </label>
            <input
              id=\"slug\"
              name=\"slug\"
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder=\"premium-cotton-tshirt\"
              className=\"block w-full rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
            />
            <p className=\"text-xs text-muted-foreground\">
              Used in product URLs. Keep it unique and URL-friendly.
            </p>
          </div>

          <div className=\"space-y-2\">
            <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"price\">
              Price
            </label>
            <div className=\"flex items-center gap-2\">
              <span className=\"rounded-md border border-zinc-200 bg-muted px-2 py-1 text-xs text-muted-foreground dark:border-zinc-800\">
                USD
              </span>
              <input
                id=\"price\"
                name=\"price\"
                type=\"number\"
                min=\"0\"
                step=\"0.01\"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder=\"39.00\"
                className=\"block w-full rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
              />
            </div>
          </div>

          <div className=\"space-y-2\">
            <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"stock\">
              Stock
            </label>
            <input
              id=\"stock\"
              name=\"stock\"
              type=\"number\"
              min=\"0\"
              required
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              placeholder=\"100\"
              className=\"block w-full rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
            />
          </div>

          <div className=\"space-y-2 sm:col-span-2\">
            <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"category\">
              Category
            </label>
            <input
              id=\"category\"
              name=\"category\"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder=\"Apparel, Accessories, Home...\"
              className=\"block w-full rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
            />
          </div>
        </div>

        <div className=\"space-y-2\">
          <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"description\">
            Description
          </label>
          <textarea
            id=\"description\"
            name=\"description\"
            rows={4}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder=\"Describe materials, fit, and key selling points.\"
            className=\"block w-full resize-y rounded-md border border-zinc-200 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-800\"
          />
        </div>

        <div className=\"space-y-2\">
          <label className=\"block text-sm font-medium text-foreground\" htmlFor=\"image\">
            Featured image
          </label>
          <input
            id=\"image\"
            name=\"image\"
            type=\"file\"
            accept=\"image/*\"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setImageFileName(file ? file.name : null);
            }}
            className=\"block w-full cursor-pointer rounded-md border border-dashed border-zinc-300 bg-muted/40 px-3 py-2 text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-background hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950/40 dark:hover:border-zinc-500\"
          />
          <p className=\"text-xs text-muted-foreground\">
            Upload a clear primary image. Additional gallery images can be added later.
          </p>
          {imageFileName ? (
            <p className=\"text-xs text-foreground\">Selected: {imageFileName}</p>
          ) : null}
        </div>

        <div className=\"flex items-center justify-between gap-4 pt-2\">
          <p className=\"text-xs text-muted-foreground\">
            All required fields must be filled before saving changes.
          </p>
          <Button type=\"submit\" className=\"min-w-[160px]\">
            {submitLabel}
          </Button>
        </div>

        {submitted ? (
          <div className=\"mt-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300\">
            This is a demo submission. Once the backend is wired, this will create or update a
            product record.
          </div>
        ) : null}
      </form>
    </div>
  );
}

