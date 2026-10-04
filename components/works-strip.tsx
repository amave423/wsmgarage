import Link from "next/link";
import { asset } from "@/lib/asset";
import { photos } from "@/lib/data";
import { Carousel } from "./carousel";

/** Лента работ на главной; вся галерея — на /works. */
export function WorksStrip() {
  const pick = photos.filter((p) => p.tag === "wheels").slice(0, 8);
  return (
    <section id="works" className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[28px] leading-tight sm:text-[36px]">Наши работы</h2>
        <Link href="/works/" className="shrink-0 pb-1 text-[15px] text-neon underline-offset-4 hover:underline">
          Все работы
        </Link>
      </div>
      <Carousel label="Наши работы" slideClass="w-[78%] sm:w-[46%] md:w-[calc((100%-3rem)/4)]" className="mt-6">
        {pick.map((p) => (
          <img
            key={p.src}
            src={asset(p.src)}
            alt={p.alt}
            loading="lazy"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
        ))}
      </Carousel>
    </section>
  );
}
