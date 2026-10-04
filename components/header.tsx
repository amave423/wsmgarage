import Link from "next/link";
import { business } from "@/lib/data";
import { PhoneIcon } from "./icons";
import { MobileMenu } from "./mobile-menu";

/** Текстовый логотип в духе их вывески: рваное «WSM» и наклонное «garage». */
export function Logo({ glow = false, className = "" }: { glow?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-end gap-1 leading-none ${className}`} aria-label="WSM Garage">
      <span className={`font-wet text-[30px] ${glow ? "neon neon-on" : "text-chalk"}`} aria-hidden="true">
        WSM
      </span>
      <span
        className={`mb-[5px] -skew-x-12 font-display text-[11px] tracking-wide ${glow ? "text-neon" : "text-alu"}`}
        aria-hidden="true"
      >
        garage
      </span>
    </span>
  );
}

const nav = [
  { href: "/#prices", label: "Цены" },
  { href: "/#colors", label: "Цвета" },
  { href: "/works/", label: "Работы" },
  { href: "/#contacts", label: "Контакты" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-seam/60 bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="rounded-md">
          <Logo glow />
        </Link>
        <nav className="hidden gap-7 text-[15px] text-alu md:flex" aria-label="Разделы">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-chalk">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={business.phoneHref}
            className="flex items-center gap-2 rounded-full border border-seam px-3 py-2 text-[15px] font-medium tabular-nums hover:border-neon md:px-4"
          >
            <PhoneIcon className="size-4 text-neon" />
            <span className="hidden sm:inline">{business.phone}</span>
            <span className="sm:hidden">Позвонить</span>
          </a>
          <MobileMenu links={nav} />
        </div>
      </div>
    </header>
  );
}
