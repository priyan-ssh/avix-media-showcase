import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "red" | "outline" | "ghost-red";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "text-xs px-5 py-3 rounded-md",
  lg: "text-sm px-6 py-3.5 rounded-md",
};

const variants: Record<Variant, string> = {
  red: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-white/80 text-white hover:bg-white hover:text-background",
  "ghost-red": "border border-primary text-white hover:bg-primary hover:text-primary-foreground",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function CtaLink({
  to,
  href,
  variant = "red",
  size = "md",
  className,
  children,
}: CommonProps & { to?: string; href?: string }) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href ?? "#"} className={cls}>
      {children}
    </a>
  );
}

export function CtaButton({
  type = "button",
  variant = "red",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
