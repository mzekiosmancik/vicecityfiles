import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "border-neon-pink/40 bg-neon-pink/10 text-neon-pink",
        blue: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
        purple: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
        orange: "border-neon-orange/40 bg-neon-orange/10 text-neon-orange",
        green: "border-neon-green/40 bg-neon-green/10 text-neon-green",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
