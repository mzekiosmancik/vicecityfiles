"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, FileSearch, Newspaper, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="vhs-overlay relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Animated gradient sky */}
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-0 animate-gradient-x bg-gradient-to-br from-neon-purple/25 via-neon-pink/15 to-neon-blue/20 bg-[length:200%_200%]"
        aria-hidden="true"
      />
      {/* Sun */}
      <div
        className="absolute left-1/2 top-[18%] h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-b from-neon-orange via-neon-pink to-transparent opacity-40 blur-2xl"
        aria-hidden="true"
      />
      {/* Parallax skyline silhouette */}
      <motion.svg
        style={{ y: skylineY }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[45%] w-full text-vice-black"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 300V190h40v-60h25v60h50V95h35v95h45v-45h30v45h55V60h20l10-25 10 25h20v140h60v-70h40v70h50V120h45v120h55v-60h35v60h60V85h40v155h55v-45h40v45h60V140h45v100h50v-70h35v70h60V110h40v130h45Z"
        />
        {/* window lights */}
        <g fill="#00e5ff" opacity="0.5">
          <rect x="150" y="120" width="4" height="4" />
          <rect x="162" y="140" width="4" height="4" />
          <rect x="330" y="90" width="4" height="4" />
          <rect x="342" y="110" width="4" height="4" />
          <rect x="520" y="150" width="4" height="4" />
          <rect x="710" y="115" width="4" height="4" />
          <rect x="722" y="135" width="4" height="4" />
          <rect x="905" y="170" width="4" height="4" />
          <rect x="1060" y="140" width="4" height="4" />
        </g>
        <g fill="#ff2d95" opacity="0.55">
          <rect x="156" y="130" width="4" height="4" />
          <rect x="336" y="100" width="4" height="4" />
          <rect x="526" y="160" width="4" height="4" />
          <rect x="716" y="125" width="4" height="4" />
          <rect x="1066" y="150" width="4" height="4" />
        </g>
        {/* palms */}
        <g fill="currentColor">
          <path d="M80 300v-55c0-4 2-8 2-8s-14-9-26-6c0 0 10-8 24-4-8-8-22-9-22-9s16-6 28 4c0-10 8-18 8-18s6 10 4 19c10-8 24-6 24-6s-12 4-18 12c12-2 20 4 20 4s-14 0-22 5c0 0 2 4 2 7v55Z" />
          <path d="M1130 300v-45c0-3 1-6 1-6s-11-7-20-5c0 0 8-6 18-3-6-6-17-7-17-7s12-5 21 3c0-8 6-14 6-14s5 8 3 15c8-6 18-5 18-5s-9 3-14 9c9-1 15 3 15 3s-11 0-17 4c0 0 2 3 2 6v45Z" />
        </g>
      </motion.svg>
      {/* bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      <div className="container relative z-10 pt-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="evidence-tag mb-6"
        >
          Case File 001 — {SITE.altTagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">Vice City</span>
          <br />
          <span className="text-neon-blue-glow">Files</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          The ultimate fan archive for news, guides, characters, vehicles, maps, theories, and merchandise.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-3 font-mono text-sm uppercase tracking-[0.3em] text-neon-pink"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button asChild size="lg" variant="gradient">
            <Link href="/wiki">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Explore Wiki
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline-blue">
            <Link href="/news">
              <Newspaper className="h-5 w-5" aria-hidden="true" />
              Latest News
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/store">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              Shop Merch
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16 hidden items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:flex"
        >
          <ArrowRight className="h-3 w-3 rotate-90 animate-float" aria-hidden="true" />
          Scroll to open the case files
        </motion.div>
      </div>
    </section>
  );
}
