"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { photoTags, photos, type Photo } from "@/lib/data";

export function Gallery() {
  const [tag, setTag] = useState<Photo["tag"] | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = tag === "all" ? photos : photos.filter((p) => p.tag === tag);

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, list.length]);

  return (
    <>
      <fieldset className="mt-6 min-w-0">
        <legend className="sr-only">Что показать</legend>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {photoTags.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tag === t.id}
              onClick={() => setTag(t.id)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[15px] font-medium ${
                tag === t.id ? "border-chalk bg-chalk text-void" : "border-seam text-chalk/85 hover:border-alu"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 columns-2 gap-2 md:columns-3 md:gap-4">
        {list.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            className="mb-2 block w-full overflow-hidden rounded-2xl md:mb-4"
            aria-label={`Открыть фото: ${p.alt}`}
          >
            <img src={asset(p.src)} alt={p.alt} loading="lazy" className="w-full transition-transform duration-300 hover:scale-[1.03]" />
          </button>
        ))}
      </div>

      {open !== null && list[open] && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label="Просмотр фото">
          <div className="flex items-center justify-between px-4 py-3 text-[14px] text-alu">
            <span className="tabular-nums">
              {open + 1} из {list.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Закрыть"
              className="grid size-10 place-items-center rounded-full border border-seam text-[22px] leading-none text-chalk"
            >
              ×
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
            <img src={asset(list[open].src)} alt={list[open].alt} className="max-h-full max-w-full rounded-xl object-contain" />
            <button
              type="button"
              aria-label="Назад"
              onClick={() => setOpen((open - 1 + list.length) % list.length)}
              className="absolute inset-y-0 left-0 w-1/3"
            />
            <button
              type="button"
              aria-label="Дальше"
              onClick={() => setOpen((open + 1) % list.length)}
              className="absolute inset-y-0 right-0 w-1/3"
            />
          </div>
          <p className="px-4 py-4 text-center text-[14px] text-chalk/80">{list[open].alt}</p>
        </div>
      )}
    </>
  );
}
