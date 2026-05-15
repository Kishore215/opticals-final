import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FrameCard } from "@/components/FrameCard";
import { FRAMES, POWER_OPTIONS, SIZE_RANGES, type Frame } from "@/lib/frames";

const searchSchema = z.object({
  size: z.enum(["S", "M", "L"]).optional(),
});

export const Route = createFileRoute("/frames")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Frames — Gowri Optical" },
      { name: "description", content: "Browse premium eyewear frames by size, shape, and prescription power." },
    ],
  }),
  component: FramesPage,
});

const SHAPES: Frame["shape"][] = ["Round", "Square", "Rectangle", "Cat-Eye", "Aviator"];

function FramesPage() {
  const sizeFromUrl = useSearch({ from: "/frames" }).size as Frame["size"] | undefined;
  const [size, setSize] = useState<Frame["size"] | "All">(sizeFromUrl ?? "All");
  const [shape, setShape] = useState<Frame["shape"] | "All">("All");
  const [power, setPower] = useState<string>(POWER_OPTIONS[0]);

  const filtered = useMemo(
    () => FRAMES.filter(f => (size === "All" || f.size === size) && (shape === "All" || f.shape === shape)),
    [size, shape]
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <p className="text-sm font-medium text-teal">Catalog</p>
        <h1 className="mt-2 font-display text-5xl">Find your frame</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Filter by size and shape. Add your prescription power at checkout — every frame is lens-ready.
        </p>
        {sizeFromUrl && (
          <p className="mt-4 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
            Showing your recommended size · {SIZE_RANGES[sizeFromUrl].label} ({SIZE_RANGES[sizeFromUrl].range})
          </p>
        )}
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <FilterGroup label="Size">
            {(["All", "S", "M", "L"] as const).map(s => (
              <Chip key={s} active={size === s} onClick={() => setSize(s)}>{s}</Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Shape">
            {(["All", ...SHAPES] as const).map(s => (
              <Chip key={s} active={shape === s} onClick={() => setShape(s)}>{s}</Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Power">
            <select
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium focus:border-teal focus:outline-none"
            >
              {POWER_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </FilterGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No frames match those filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(f => (
              <FrameCard key={f.id} frame={f} recommended={sizeFromUrl === f.size} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-foreground hover:bg-secondary/70"
      }`}
    >
      {children}
    </button>
  );
}
