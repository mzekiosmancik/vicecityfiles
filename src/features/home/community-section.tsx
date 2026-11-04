"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Lightbulb, Loader2, MessageSquare, Palette, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";

const COMMUNITY_LINKS = [
  {
    label: "Discussions",
    description: "Open threads on physics, soundtrack predictions, map arguments, all of it.",
    icon: MessageSquare,
    href: "/community/discussions",
    accent: "text-neon-purple",
  },
  {
    label: "Fan Theories",
    description: "Post your evidence. The community rates every theory.",
    icon: Lightbulb,
    href: "/community/theories",
    accent: "text-neon-yellow",
  },
  {
    label: "Fan Art",
    description: "Original neon artwork from the most talented fans.",
    icon: Palette,
    href: "/community/fan-art",
    accent: "text-neon-pink",
  },
];

export function CommunitySection({ index }: { index: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const company = new FormData(e.currentTarget).get("company");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source: "home" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't sign you up right now. Please try again.");
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <section className="container py-14 sm:py-20" aria-labelledby="community">
      <SectionHeading id="community"
        eyebrow={sectionEyebrow(index, "The Bureau")}
        title="Join the Investigation"
        description="Theories, art, arguments about car physics — this is where the case gets solved."
      />

      <StaggerContainer className="grid gap-5 lg:grid-cols-3">
        {COMMUNITY_LINKS.map((item) => (
          <StaggerItem key={item.label} className="h-full">
            <Link href={item.href} className="group block h-full">
              <div className="glass neon-border-hover h-full rounded-lg p-6">
                <item.icon className={`h-8 w-8 ${item.accent}`} aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">{item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Newsletter */}
      <div className="glass mt-8 rounded-lg p-8 text-center">
        <h3 className="font-display text-xl font-bold uppercase tracking-wide">
          The <span className="text-neon-pink">Wire</span> — Weekly Intel Drop
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One email a week. Every confirmed detail, every rated rumor, zero spam.
        </p>
        {status === "done" ? (
          <p role="status" className="mt-6 font-mono text-sm uppercase tracking-widest text-neon-green">
            ✓ You&apos;re on the wire. Watch your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="mx-auto mt-6 max-w-md">
            <div className="flex gap-2">
              <Input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@vicecityfiles.com"
                aria-label="Email address"
                aria-invalid={status === "error" || undefined}
                aria-describedby={message ? "newsletter-message" : undefined}
                disabled={status === "sending"}
              />
              <Button type="submit" variant="secondary" disabled={status === "sending"}>
                {status === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">{status === "sending" ? "Sending" : "Subscribe"}</span>
              </Button>
            </div>
            {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px opacity-0"
            />
            {message && (
              <p id="newsletter-message" role="alert" className="mt-3 text-sm text-neon-pink">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
