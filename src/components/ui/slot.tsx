"use client";

import { Children, cloneElement, forwardRef, isValidElement, type HTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot implementation (Radix-compatible behavior for `asChild`).
 * Merges props and className onto the single child element.
 */
export const Slot = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    const child = Children.only(children);
    if (!isValidElement(child)) return null;
    const typedChild = child as ReactElement<Record<string, unknown> & { className?: string }>;
    return cloneElement(typedChild, {
      ...props,
      ...typedChild.props,
      className: cn(className, typedChild.props.className),
      ref,
    } as Record<string, unknown>);
  },
);
Slot.displayName = "Slot";
