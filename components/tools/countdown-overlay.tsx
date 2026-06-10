"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

type CountdownOverlayProps = Readonly<{
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

    const fire = (originX: number, angle: number) =>
      confetti({
        angle,
        gravity: 0.9,
        origin: { x: originX, y: 0.62 },
        particleCount: 120,
        spread: 70,
        startVelocity: 42,
      });

    void fire(0.18, 60);
    void fire(0.82, 120);

    const secondBurst = globalThis.setTimeout(() => {
      void confetti({
        gravity: 0.82,
        origin: { x: 0.5, y: 0.4 },
        particleCount: 160,
        spread: 110,
        startVelocity: 48,
      });
    }, 180);

    const thirdBurst = globalThis.setTimeout(() => {
      void fire(0.24, 72);
      void fire(0.76, 108);
    }, 360);

    const completeTimer = globalThis.setTimeout(onComplete, 2200);

    return () => {
      globalThis.clearTimeout(secondBurst);
      globalThis.clearTimeout(thirdBurst);
      globalThis.clearTimeout(completeTimer);
    };
  }, [onComplete, phase]);

  const progress =
    phase === "reveal" || secondsRemaining <= 0
      ? 100
      : ((secondsRemaining - displaySeconds) / secondsRemaining) * 100;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/95 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.22),_transparent_35%),linear-gradient(140deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grid-fade" />
      </div>

      <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/10 px-5 py-8 shadow-[0_30px_140px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:px-8 sm:py-10">
          <div className="flex flex-col items-center gap-7 text-center">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/78">
              {phase === "reveal" ? resultLabel : drawingLabel}
            </div>

            {phase === "countdown" ? (
              <>
                <div
                  className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_rgba(255,255,255,0.08)_45%,_rgba(15,23,42,0.22)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_90px_rgba(14,165,233,0.22)] transition-transform duration-150 sm:h-64 sm:w-64"
                  style={{ transform: `scale(${pulseScale})` }}
                >
                  <div className="absolute inset-[10px] rounded-full border border-white/12" />
                  <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
                  <div className="absolute inset-[18px] rounded-full border border-sky-200/12" />

                  <div className="relative text-center text-white">
                    <div className="text-[5.5rem] font-black leading-none tabular-nums sm:text-[7rem]">
                      {displaySeconds}
                    </div>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/58">
                      {countdownLabel}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-3xl rounded-[1.75rem] border border-white/10 bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/52">
                    {resultLabel}
                  </p>
                  <p className="mt-3 break-words text-3xl font-black text-white sm:text-5xl">
                    {rollingLabel || "..."}
                  </p>
                </div>
              </>
            ) : (
              <div className="relative w-full max-w-4xl py-6 sm:py-10">
                <div className="absolute inset-x-10 top-1/2 h-32 -translate-y-1/2 rounded-full bg-emerald-400/25 blur-3xl sm:h-44" />
                <div className="absolute inset-x-24 top-1/2 h-16 -translate-y-1/2 rounded-full bg-white/18 blur-2xl" />
                <h1 className="relative break-words text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {selectedName}
                </h1>
              </div>
            )}

            <div className="w-full max-w-xl space-y-3">
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_#38bdf8_0%,_#67e8f9_45%,_#34d399_100%)] transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/48">
                {countdownLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          opacity: 0.6;
        }

        .orb-a {
          top: 8%;
          left: -8%;
          height: 18rem;
          width: 18rem;
          background: rgba(56, 189, 248, 0.22);
          animation: drift 10s ease-in-out infinite;
        }

        .orb-b {
          right: -6%;
          top: 16%;
          height: 22rem;
          width: 22rem;
          background: rgba(34, 197, 94, 0.18);
          animation: drift 13s ease-in-out infinite reverse;
        }

        .orb-c {
          bottom: -10%;
          left: 30%;
          height: 20rem;
          width: 20rem;
          background: rgba(59, 130, 246, 0.16);
          animation: drift 15s ease-in-out infinite;
        }

        .grid-fade {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at center, black 32%, transparent 82%);
          opacity: 0.18;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, 24px, 0) scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
