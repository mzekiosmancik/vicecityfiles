import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <FileQuestion className="h-16 w-16 text-neon-pink/60" aria-hidden="true" />
      <p className="evidence-tag mt-6">Case File 404</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
        <span className="gradient-text">File Not Found</span>
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        This evidence has been sealed, moved, or never existed. Check the archive index or head back to HQ.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="gradient">
          <Link href="/">Return to HQ</Link>
        </Button>
        <Button asChild variant="outline-blue">
          <Link href="/wiki">Browse Archive</Link>
        </Button>
      </div>
    </div>
  );
}
