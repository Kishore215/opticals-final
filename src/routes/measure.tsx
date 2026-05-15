import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, RotateCcw, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { recommendSize, SIZE_RANGES } from "@/lib/frames";

export const Route = createFileRoute("/measure")({
  head: () => ({
    meta: [
      { title: "Camera Face Measurement — Gowri Optical" },
      {
        name: "description",
        content:
          "Use your webcam to measure your face width and pupillary distance with MediaPipe FaceMesh.",
      },
    ],
  }),
  component: MeasurePage,
});

type Status = "idle" | "loading" | "ready" | "measuring" | "done" | "error";

function MeasurePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<unknown>(null);
  const rafRef = useRef<number | null>(null);
  const samplesRef = useRef<{ pd: number; faceW: number }[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{ pd: number; faceW: number } | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    try {
      setStatus("loading");
      setError("");
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
      );
      const landmarker = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });
      landmarkerRef.current = landmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      setStatus("measuring");
      samplesRef.current = [];
      loop();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Camera or model failed to load.");
      setStatus("error");
    }
  }

  function loop() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current as {
      detectForVideo: (
        v: HTMLVideoElement,
        ts: number,
      ) => { faceLandmarks: Array<Array<{ x: number; y: number; z: number }>> };
    } | null;
    if (!video || !canvas || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const res = landmarker.detectForVideo(video, performance.now());
    if (res.faceLandmarks && res.faceLandmarks[0]) {
      const lm = res.faceLandmarks[0];
      // 468 pupil-left, 473 pupil-right; 234 left cheek, 454 right cheek
      const pL = lm[468],
        pR = lm[473];
      const cL = lm[234],
        cR = lm[454];

      // average iris diameter in real world ≈ 11.7 mm. Use iris landmarks 469-472 (left)
      const iL1 = lm[469],
        iL2 = lm[471];
      const irisPxX = (iL1.x - iL2.x) * canvas.width;
      const irisPxY = (iL1.y - iL2.y) * canvas.height;
      const irisPx = Math.hypot(irisPxX, irisPxY);
      const mmPerPx = 11.7 / irisPx;

      const pdPx = Math.hypot((pL.x - pR.x) * canvas.width, (pL.y - pR.y) * canvas.height);
      const fwPx = Math.hypot((cL.x - cR.x) * canvas.width, (cL.y - cR.y) * canvas.height);

      const pd = pdPx * mmPerPx;
      const faceW = fwPx * mmPerPx;

      samplesRef.current.push({ pd, faceW });
      if (samplesRef.current.length > 60) samplesRef.current.shift();

      // draw overlay
      ctx.strokeStyle = "#5cbdb9";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cL.x * canvas.width, cL.y * canvas.height);
      ctx.lineTo(cR.x * canvas.width, cR.y * canvas.height);
      ctx.stroke();
      ctx.fillStyle = "#0c2340";
      [pL, pR].forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (samplesRef.current.length >= 45) {
        const avgPd = samplesRef.current.reduce((s, x) => s + x.pd, 0) / samplesRef.current.length;
        const avgFw =
          samplesRef.current.reduce((s, x) => s + x.faceW, 0) / samplesRef.current.length;
        setResult({ pd: Math.round(avgPd * 10) / 10, faceW: Math.round(avgFw * 10) / 10 });
        setStatus("done");
        const stream = video.srcObject as MediaStream | null;
        stream?.getTracks().forEach((t) => t.stop());
        return;
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }

  function reset() {
    setResult(null);
    setStatus("idle");
    samplesRef.current = [];
  }

  const recSize = result ? recommendSize(result.faceW) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-medium text-teal">Smart Fit</p>
        <h1 className="mt-2 font-display text-5xl">Measure your face</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Sit roughly 50 cm from your screen, look straight ahead, and hold still for ~3 seconds.
          Your camera feed never leaves this device.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100" />
            {status === "idle" && (
              <div className="absolute inset-0 grid place-items-center bg-gradient-soft">
                <div className="text-center">
                  <Camera className="mx-auto h-10 w-10 text-teal" />
                  <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                    Click Start to enable your camera. We'll calibrate using your iris size (≈11.7
                    mm).
                  </p>
                  <button
                    onClick={start}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
                  >
                    <Camera className="h-4 w-4" /> Start camera
                  </button>
                </div>
              </div>
            )}
            {status === "loading" && (
              <div className="absolute inset-0 grid place-items-center bg-gradient-soft text-muted-foreground">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal" />
                  <p className="mt-3 text-sm">Loading face landmark model…</p>
                </div>
              </div>
            )}
            {status === "measuring" && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary/90 px-4 py-2 text-xs font-semibold text-primary-foreground backdrop-blur">
                Hold still… {Math.min(100, Math.round((samplesRef.current.length / 45) * 100))}%
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 grid place-items-center bg-gradient-soft p-8 text-center">
                <div>
                  <p className="font-display text-xl">Couldn't access the camera</p>
                  <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                  <button
                    onClick={start}
                    className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl">Your measurements</h2>
            <p className="mt-1 text-xs text-muted-foreground">Calibrated using iris diameter</p>

            <dl className="mt-6 space-y-4">
              <Stat label="Face width" value={result ? `${result.faceW} mm` : "—"} />
              <Stat label="Pupillary distance (PD)" value={result ? `${result.pd} mm` : "—"} />
              <Stat
                label="Recommended frame size"
                value={recSize ? `${recSize} · ${SIZE_RANGES[recSize].label}` : "—"}
                accent
              />
            </dl>

            {status === "done" && recSize && (
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => navigate({ to: "/frames", search: { size: recSize } })}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Show frames in my size <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={reset}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:border-teal"
                >
                  <RotateCcw className="h-4 w-4" /> Measure again
                </button>
              </div>
            )}

            <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
              These are approximate measurements for frame sizing. For optical prescriptions, please
              visit our store for a clinical PD measurement.
            </p>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={`font-display text-xl ${accent ? "text-teal" : ""}`}>{value}</dd>
    </div>
  );
}
