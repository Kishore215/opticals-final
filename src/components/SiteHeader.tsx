import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-hero text-primary-foreground">
            <Eye className="h-4 w-4" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Gowri <span className="text-teal">Optical</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-teal" }}
            className="text-muted-foreground transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/frames"
            activeProps={{ className: "text-teal" }}
            className="text-muted-foreground transition hover:text-foreground"
          >
            Frames
          </Link>
          <Link
            to="/measure"
            activeProps={{ className: "text-teal" }}
            className="text-muted-foreground transition hover:text-foreground"
          >
            Measure
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "text-teal" }}
            className="text-muted-foreground transition hover:text-foreground"
          >
            About
          </Link>
        </nav>
        <Link
          to="/measure"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
        >
          Try On with Camera
        </Link>
      </div>
    </header>
  );
}
