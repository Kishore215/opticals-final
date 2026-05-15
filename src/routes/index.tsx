import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Glasses, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FrameCard } from "@/components/FrameCard";
import { FRAMES } from "@/lib/frames";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gowri Optical — Eyewear with smart fit" },
      { name: "description", content: "Family-owned eyewear since 1986. Try frames on with your camera and find your exact fit in seconds." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-teal" />
              AI face measurement, in-browser
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Eyewear that<br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">truly fits</span> you.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Skip the guesswork. Let our camera measure your face and recommend the perfect frame size — in under 10 seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/measure" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-90">
                <Camera className="h-4 w-4" /> Measure my face
              </Link>
              <Link to="/frames" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:border-teal hover:text-teal">
                Browse frames <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><p className="font-display text-2xl text-teal">38+</p><p className="text-muted-foreground">years in Chennai</p></div>
              <div><p className="font-display text-2xl text-teal">200+</p><p className="text-muted-foreground">frame styles</p></div>
              <div><p className="font-display text-2xl text-teal">100%</p><p className="text-muted-foreground">in-house lab</p></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-hero opacity-20 blur-3xl" />
            <img
              src={heroImg}
              alt="Woman wearing Gowri Optical frames"
              width={1536}
              height={1280}
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elegant"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-elegant md:block">
              <p className="text-xs text-muted-foreground">Detected face width</p>
              <p className="font-display text-2xl">138 mm</p>
              <p className="text-xs text-teal">Medium · Aurora fits perfectly</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-4xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">Three steps from your screen to your face.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Camera, title: "Measure", desc: "Allow camera access. We use FaceMesh to detect 478 facial landmarks and calculate your face width and pupillary distance." },
              { icon: Glasses, title: "Match", desc: "We recommend frames that match your size — Small, Medium, or Large — so they sit perfectly on your nose and ears." },
              { icon: ShieldCheck, title: "Order", desc: "Pick your power: zero-power blue cut, single vision, bifocal, or progressive. Lab-fitted in 48 hours." },
            ].map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-hero text-primary-foreground"><s.icon className="h-5 w-5" /></span>
                  <span className="font-display text-sm text-muted-foreground">Step 0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured frames */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl">New this season</h2>
            <p className="mt-2 text-muted-foreground">Frames hand-picked by our opticians.</p>
          </div>
          <Link to="/frames" className="hidden text-sm font-semibold text-teal hover:underline md:inline">View all frames →</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMES.slice(0, 6).map((f) => <FrameCard key={f.id} frame={f} />)}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
