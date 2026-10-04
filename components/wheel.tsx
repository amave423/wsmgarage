"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { Gloss } from "@/lib/data";
import type { WheelScene } from "./wheel-scene";

/**
 * 3D-диск в выбранном цвете и фактуре. three.js грузится только когда блок
 * подъезжает к экрану. Без WebGL показываем фото их серебристого диска.
 */
export function Wheel({ color, gloss }: { color: string; gloss: Gloss }) {
  const reduce = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<WheelScene | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "fallback">("idle");
  const paint = useRef({ color, gloss });

  useEffect(() => {
    paint.current = { color, gloss };
    scene.current?.setPaint(color, gloss);
  }, [color, gloss]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const { createWheelScene } = await import("./wheel-scene");
          if (cancelled) return;
          const s = createWheelScene(el, { reduceMotion: !!reduce });
          s.setPaint(paint.current.color, paint.current.gloss);
          scene.current = s;
          setState("ready");
        } catch (err) {
          // нет WebGL (старый телефон, отключённое ускорение) — оставляем фото
          console.warn("3D-диск недоступен, показываем фото", err);
          if (!cancelled) setState("fallback");
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [reduce]);

  return (
    <div className="relative aspect-square w-full">
      {state !== "ready" && (
        <img
          src={asset("/photos/paint-wheel.jpg")}
          alt="Серебристый диск после покраски"
          className={`absolute inset-0 size-full rounded-[28px] object-cover ${state === "idle" ? "opacity-30" : ""}`}
        />
      )}
      <canvas
        ref={canvas}
        className={`absolute inset-0 size-full touch-pan-y select-none ${state === "ready" ? "cursor-grab active:cursor-grabbing" : "invisible"}`}
        role="img"
        aria-label="3D-модель диска в выбранном цвете. Потяните влево или вправо, чтобы повернуть"
      />
    </div>
  );
}
