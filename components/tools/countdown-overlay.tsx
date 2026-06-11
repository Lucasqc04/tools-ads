"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

type CountdownOverlayProps = Readonly<{
  closeLabel: string;
  countdownLabel: string;
  drawingLabel: string;
  onComplete: () => void;
  resultLabel: string;
  rollingLabel: string;
  secondsRemaining: number;
  selectedName: string;
}>;

type OverlayPhase = "countdown" | "reveal";

export function CountdownOverlay({
  closeLabel,
  countdownLabel,
  drawingLabel,
  onComplete,
  resultLabel,
  rollingLabel,
  secondsRemaining,
  selectedName,
}: CountdownOverlayProps) {
  const [displaySeconds, setDisplaySeconds] = useState(secondsRemaining);
  const [phase, setPhase] = useState<OverlayPhase>("countdown");
  const [pulseScale, setPulseScale] = useState(1);
  const [allowConfetti, setAllowConfetti] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const compactQuery = globalThis.matchMedia("(max-width: 640px)");
    const reducedMotionQuery = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const syncDisplayMode = () => {
      setIsCompact(compactQuery.matches);
      setAllowConfetti(!reducedMotionQuery.matches);
    };

    syncDisplayMode();
    compactQuery.addEventListener("change", syncDisplayMode);
    reducedMotionQuery.addEventListener("change", syncDisplayMode);

    return () => {
      compactQuery.removeEventListener("change", syncDisplayMode);
      reducedMotionQuery.removeEventListener("change", syncDisplayMode);
    };
  }, []);

  useEffect(() => {
    setDisplaySeconds(secondsRemaining);
    setPhase("countdown");
    setPulseScale(1);
  }, [secondsRemaining, selectedName]);

  useEffect(() => {
    if (phase !== "countdown") return;

    setPulseScale(1);
    const pulseTimeout = globalThis.setTimeout(() => {
      setPulseScale(displaySeconds <= 2 ? 1.08 : 1.04);
    }, 90);

    const timer = globalThis.setTimeout(() => {
      if (displaySeconds <= 1) {
        setDisplaySeconds(0);
        setPhase("reveal");
        return;
      }

      setDisplaySeconds((current) => current - 1);
    }, 1000);

    return () => {
      globalThis.clearTimeout(timer);
      globalThis.clearTimeout(pulseTimeout);
    };
  }, [displaySeconds, phase]);

  useEffect(() => {
    if (phase !== "reveal") return;

    confetti.reset();
    if (allowConfetti) {
      void confetti({
        angle: isCompact ? 62 : 58,
        colors: ["#1d67d6", "#53a4ff", "#10b981", "#ffffff"],
        disableForReducedMotion: true,
        gravity: 1.12,
        origin: { x: 0.04, y: 0.74 },
        particleCount: isCompact ? 28 : 60,
        scalar: isCompact ? 0.74 : 0.94,
        spread: isCompact ? 32 : 42,
        startVelocity: isCompact ? 24 : 34,
        ticks: isCompact ? 120 : 160,
        zIndex: 60,
      });

      void confetti({
        angle: isCompact ? 118 : 122,
        colors: ["#1d67d6", "#53a4ff", "#10b981", "#ffffff"],
        disableForReducedMotion: true,
        gravity: 1.12,
        origin: { x: 0.96, y: 0.74 },
        particleCount: isCompact ? 28 : 60,
        scalar: isCompact ? 0.74 : 0.94,
        spread: isCompact ? 32 : 42,
        startVelocity: isCompact ? 24 : 34,
        ticks: isCompact ? 120 : 160,
        zIndex: 60,
      });
    }

    return () => {
      confetti.reset();
    };
  }, [allowConfetti, isCompact, phase]);

  const progress =
    phase === "reveal" || secondsRemaining <= 0
      ? 100
      : ((secondsRemaining - displaySeconds) / secondsRemaining) * 100;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/55 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(237,246,255,0.96),_rgba(248,250,252,0.28)_38%,_rgba(15,23,42,0)_72%)]" />

      <div className="relative z-10 flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white/95 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:px-8 sm:py-8">
          <div className="flex flex-col items-center gap-5 text-center sm:gap-6">
            <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-700">
              {phase === "reveal" ? resultLabel : drawingLabel}
            </div>

            {phase === "countdown" ? (
              <>
                <div
                  className="relative flex h-40 w-40 items-center justify-center rounded-full border border-brand-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.12)] transition-transform duration-150 sm:h-52 sm:w-52"
                  style={{ transform: `scale(${pulseScale})` }}
                >
                  <div className="absolute inset-[10px] rounded-full border border-brand-100/80" />
                  <div className="absolute inset-0 rounded-full ring-4 ring-brand-50/70" />
                  <div className="absolute inset-[18px] rounded-full border border-slate-200" />

                  <div className="relative text-center text-slate-900">
                    <div className="text-[4.25rem] font-black leading-none tabular-nums text-brand-700 sm:text-[6rem]">
                      {displaySeconds}
                    </div>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {countdownLabel}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    {resultLabel}
                  </p>
                  <p className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-4xl">
                    {rollingLabel || "..."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-full max-w-2xl rounded-[1.75rem] border border-brand-200 bg-gradient-to-r from-brand-50 to-emerald-50 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-700">
                    {resultLabel}
                  </p>
                  <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    {selectedName}
                  </h1>
                </div>

                <Button className="min-w-32" onClick={onComplete}>
                  {closeLabel}
                </Button>
              </>
            )}

            <div className="w-full max-w-xl space-y-3">
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                {countdownLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
