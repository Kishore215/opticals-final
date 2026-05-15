import type { Frame } from "@/lib/frames";

export function FrameCard({ frame, recommended }: { frame: Frame; recommended?: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
      {recommended && (
        <span className="absolute right-4 top-4 rounded-full bg-teal px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
          Your size
        </span>
      )}
      <div className="grid h-44 place-items-center rounded-xl bg-gradient-soft text-7xl">
        {frame.emoji}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{frame.brand}</p>
          <h3 className="font-display text-xl">{frame.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {frame.shape} · {frame.color}
          </p>
        </div>
        <p className="font-semibold">₹{frame.price.toLocaleString("en-IN")}</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium">
          Size {frame.size} · {frame.width}mm
        </span>
        <button className="font-semibold text-teal hover:underline">Try on →</button>
      </div>
    </article>
  );
}
