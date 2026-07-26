import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import site from "@/content/site.json";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-5">
        <Logo />

        <nav className="hidden md:flex items-center gap-10">
          {site.nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="relative text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-white data-[status=active]:text-white"
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={cn(
                      "pointer-events-none absolute -bottom-2 left-0 right-0 mx-auto h-0.5 w-6 bg-primary transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </>
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-6">
            {site.nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                className="text-sm font-semibold uppercase tracking-widest text-muted-foreground data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
