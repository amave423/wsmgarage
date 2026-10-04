"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

const COPIES = 3; // слайды рендерятся трижды: листаем по среднему набору, по краям — бесшовный перескок
const AUTOPLAY_MS = 4500;
const RESUME_MS = 6000; // после ручного взаимодействия автопрокрутка ждёт

/** Приостановить автопрокрутку после действия пользователя. */
function pause(until: { current: number }) {
  until.current = Date.now() + RESUME_MS;
}

/** scrollLeft, при котором слайд i прилегает к началу ленты (отступ ленты = scroll-padding). */
function offsetOf(el: HTMLElement, i: number) {
  const first = el.children[0] as HTMLElement | undefined;
  const it = el.children[i] as HTMLElement | undefined;
  return first && it ? it.offsetLeft - first.offsetLeft : 0;
}

/** Индекс слайда, ближайшего к левому краю ленты. */
function nearest(el: HTMLElement, n: number) {
  let best = 0;
  for (let i = 0; i < n * COPIES; i++) {
    if (Math.abs(offsetOf(el, i) - el.scrollLeft) < Math.abs(offsetOf(el, best) - el.scrollLeft)) best = i;
  }
  return best;
}

/**
 * Бесконечная лента со свайпом (нативный scroll-snap), автопрокруткой, стрелками и точками.
 * Ширину слайда задаёт slideClass — например "w-[85%] md:w-[calc((100%-2rem)/3)]".
 */
export function Carousel({
  children,
  label,
  slideClass,
  className = "",
}: {
  children: ReactNode;
  label: string;
  slideClass: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const n = slides.length;
  const [active, setActive] = useState(0);
  const pausedUntil = useRef(0);
  const hovered = useRef(false);

  useEffect(() => {
    const el = track.current;
    if (!el || n === 0) return;
    el.scrollTo({ left: offsetOf(el, n), behavior: "instant" });

    // Держим прокрутку в среднем наборе: из крайних копий тихо переносимся на такой же слайд в середине
    const normalize = () => {
      const idx = nearest(el, n);
      const set = offsetOf(el, n) - offsetOf(el, 0);
      if (idx < n) el.scrollTo({ left: el.scrollLeft + set, behavior: "instant" });
      else if (idx >= 2 * n) el.scrollTo({ left: el.scrollLeft - set, behavior: "instant" });
    };

    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setActive(nearest(el, n) % n);
      clearTimeout(settle);
      settle = setTimeout(normalize, 140);
    };
    const onResize = () => el.scrollTo({ left: offsetOf(el, n + (nearest(el, n) % n)), behavior: "instant" });
    const onTouch = () => pause(pausedUntil);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onTouch);
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("focusin", onTouch);
    window.addEventListener("resize", onResize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = reduced
      ? undefined
      : setInterval(() => {
          if (hovered.current || document.hidden || Date.now() < pausedUntil.current) return;
          // крутим только когда карусель на экране
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          el.scrollTo({ left: offsetOf(el, nearest(el, n) + 1), behavior: "smooth" });
        }, AUTOPLAY_MS);

    return () => {
      clearTimeout(settle);
      clearInterval(timer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onTouch);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("focusin", onTouch);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  const scrollToIndex = (pick: (el: HTMLDivElement) => number) => {
    const el = track.current;
    if (!el) return;
    pause(pausedUntil);
    el.scrollTo({ left: offsetOf(el, pick(el)), behavior: "smooth" });
  };
  const step = (d: number) => scrollToIndex((el) => nearest(el, n) + d);
  const goTo = (i: number) => scrollToIndex(() => n + i);

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="карусель"
      aria-label={label}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <div
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 md:mx-0 md:scroll-px-0 md:gap-4 md:px-0"
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          slides.map((s, i) => (
            <div
              key={`${copy}-${i}`}
              className={`shrink-0 snap-start ${slideClass}`}
              aria-hidden={copy !== 1 || undefined}
              aria-label={copy === 1 ? `${i + 1} из ${n}` : undefined}
            >
              {s}
            </div>
          )),
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Слайд ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-neon" : "w-1.5 bg-seam hover:bg-alu"}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <Arrow dir={-1} onClick={() => step(-1)} />
          <Arrow dir={1} onClick={() => step(1)} />
        </div>
      </div>
    </div>
  );
}

function Arrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Дальше" : "Назад"}
      className="grid size-11 place-items-center rounded-full border border-seam hover:border-neon"
    >
      <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d={dir === 1 ? "m8 5 5 5-5 5" : "m12 5-5 5 5 5"} />
      </svg>
    </button>
  );
}
