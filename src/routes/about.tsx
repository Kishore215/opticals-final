import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Gowri Optical" },
      {
        name: "description",
        content: "Family-owned optical store in Chennai since 1986. Honest opinions, modern tech.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-medium text-teal">Since 1986</p>
        <h1 className="mt-2 font-display text-5xl">A small shop with a long memory.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Gowri Optical was opened by R. Sundaram on a quiet street in T. Nagar with a single
          eye-test chair and a glass cabinet of frames. Three generations later, we still believe an
          eye exam should take time and a frame should fit your face — not the other way around.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          What's new is the technology in the room. Our in-browser face-measurement uses Google's
          MediaPipe FaceMesh to estimate your face width and pupillary distance from a webcam — the
          same approach used by Lenskart and Warby Parker — so you can find a frame that fits before
          you walk in.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { t: "In-house lab", d: "Lenses cut, edged, and fitted on-site within 48 hours." },
            { t: "Honest opinions", d: "If a frame doesn't suit you, we will tell you. Always." },
            { t: "Lifetime adjustments", d: "Bring your frames in any time for a free re-fit." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="font-display text-xl">{x.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
