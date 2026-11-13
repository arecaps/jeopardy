import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-opacity duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-40 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:opacity-90",
        quiet: "border border-line bg-surface text-fg hover:opacity-90",
        ghost: "bg-transparent text-muted hover:text-fg",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ asChild, className, variant, type, ...props }: ButtonProps) {
  if (asChild) {
    return <Slot className={cn(buttonVariants({ variant }), className)} {...props} />;
  }
  return (
    <button
      type={type ?? "button"}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-line bg-bg px-3 text-base text-fg placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full min-w-0 rounded-md border border-line bg-bg px-3 py-3 text-base text-fg placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-fg", className)} {...props} />;
}
