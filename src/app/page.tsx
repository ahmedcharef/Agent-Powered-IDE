import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-card px-6 py-24 shadow-sm sm:items-start sm:rounded-2xl sm:px-12 sm:py-16">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-balance text-3xl font-semibold leading-10 tracking-tight text-foreground sm:text-4xl">
            Agent‑powered IDE for fast, confident shipping.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Wire up GitHub issues, let agents take over repetitive flows, and
            keep humans in the loop for the work that really matters.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button className="w-full sm:w-auto">Get started</Button>
          <Button className="w-full sm:w-auto" asChild>
            <a
              href="https://github.com/ahmedcharef/Agent-Powered-IDE"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>
        <div className="mt-10 flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
      </main>
    </div>
  );
}
