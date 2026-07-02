"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Lightbulb, MessageSquare, Palette, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";

const COMMUNITY_LINKS = [
  {
    label: "Discord HQ",
    description: "Join 40,000+ investigators in the live situation room.",
    icon: MessageSquare,
    href: "/community",
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

export function CommunitySection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <section className="container py-20" aria-labelledby="community">
      <SectionHeading
        eyebrow="Section 08 // The Bureau"
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
        {subscribed ? (
          <p className="mt-6 font-mono text-sm uppercase tracking-widest text-neon-green">
            ✓ You&apos;re on the wire. Watch your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="mx-auto mt-6 flex max-w-md gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@vicecityfiles.com"
              aria-label="Email address"
            />
            <Button type="submit" variant="secondary">
              <Send className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Subscribe</span>
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
