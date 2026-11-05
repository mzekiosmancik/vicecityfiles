"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileSearch, Newspaper, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { LaunchPanel, type LaunchHeadline } from "@/features/home/launch-panel";
import heroImage from "../../../public/images/hero-gta6.jpg";

/** Keeps light text legible on the bright parts of the key art. */
const READABLE = "[text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_14px_rgba(0,0,0,0.7)]";
/** Solid dark fill for the outline buttons so they don't disappear into the image. */
const BUTTON_FILL = "bg-vice-black/70 backdrop-blur-md hover:bg-vice-black/85";

export function Hero({ headline }: { headline?: LaunchHeadline | null }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Key art (Rockstar Games) — darkened so the copy and countdown stay readable */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[70%_center] xl:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vice-black/80 via-vice-black/45 to-vice-black/10" />
        {/* Phones: copy sits over the whole image, so shade it evenly */}
        <div className="absolute inset-0 bg-vice-black/45 xl:hidden" />
      </div>
      {/* bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      {/*
        Phones: intro → launch panel → details, so the countdown lands in the first screen.
        xl: intro + details stacked on the left, panel spanning both rows on the right.
      */}
      <div className="container relative z-10 grid items-center gap-8 pb-12 pt-24 sm:gap-12 sm:pb-24 xl:grid-cols-[minmax(0,1fr)_400px] xl:grid-rows-[auto_auto] xl:gap-y-0 xl:pb-0">
        <div className="xl:col-start-1 xl:row-start-1 xl:self-end">
          <p
            className={`animate-rise-in motion-reduce:animate-none [animation-delay:0ms] evidence-tag mb-4 text-neon-blue sm:mb-6 ${READABLE}`}
          >
            Case File 001 — {SITE.altTagline}
          </p>

          <h1
            className="animate-rise-in motion-reduce:animate-none [animation-delay:100ms] max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          >
            <span className="gradient-text">Vice City</span>
            <br />
            <span className="text-neon-blue-glow">Files</span>
          </h1>
        </div>

        <div className="animate-rise-in motion-reduce:animate-none [animation-delay:300ms] xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:justify-self-end">
          <LaunchPanel headline={headline} />
        </div>

        <div className="xl:col-start-1 xl:row-start-2 xl:self-start">
          <p
            className={`animate-rise-in motion-reduce:animate-none [animation-delay:200ms] max-w-xl text-base sm:text-lg xl:mt-6 font-medium text-white ${READABLE}`}
          >
            The ultimate fan archive for news, guides, characters, vehicles, maps, theories, and merchandise.
          </p>

          <p
            className={`animate-rise-in motion-reduce:animate-none [animation-delay:300ms] mt-3 font-mono text-sm uppercase tracking-[0.3em] font-semibold text-[#ff8fc8] ${READABLE}`}
          >
            {SITE.tagline}
          </p>

          <div
            className="animate-rise-in motion-reduce:animate-none [animation-delay:400ms] mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4"
          >
            <Button asChild size="lg" variant="gradient">
              <Link href="/wiki">
                <FileSearch className="h-5 w-5" aria-hidden="true" />
                Explore Wiki
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-blue" className={BUTTON_FILL}>
              <Link href="/news">
                <Newspaper className="h-5 w-5" aria-hidden="true" />
                Latest News
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={`${BUTTON_FILL} text-white`}>
              <Link href="/store">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                Shop Merch
              </Link>
            </Button>
          </div>

          <div
            className={`animate-rise-in motion-reduce:animate-none [animation-delay:900ms] mt-16 hidden items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/85 xl:flex ${READABLE}`}
          >
            <ArrowRight className="h-3 w-3 rotate-90 animate-float" aria-hidden="true" />
            Scroll to open the case files
          </div>
        </div>
      </div>
    </section>
  );
}
