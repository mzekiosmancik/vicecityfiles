import { Slot } from "@/components/ui/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neon-pink text-white hover:shadow-neon-pink hover:brightness-110",
        secondary: "bg-neon-blue text-vice-black hover:shadow-neon-blue hover:brightness-110",
        outline:
          "border border-neon-pink/50 bg-transparent text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-pink",
        "outline-blue":
          "border border-neon-blue/50 bg-transparent text-neon-blue hover:bg-neon-blue/10 hover:shadow-neon-blue",
        ghost: "text-foreground hover:bg-white/5 hover:text-neon-pink",
        gradient:
          "bg-vice-sunset bg-[length:200%_200%] text-white animate-gradient-x hover:shadow-neon-purple",
        destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
