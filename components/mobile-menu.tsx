"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { business } from "@/lib/data";
import { PhoneIcon, TelegramIcon, VkIcon } from "./icons";

/** Меню разделов на телефоне: кнопка в шапке раскрывает панель под ней. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        className="grid size-10 place-items-center rounded-full border border-seam"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Портал в body: у шапки backdrop-blur, внутри неё fixed-панель считалась бы от шапки и схлопывалась */}
      {open &&
        createPortal(
          <div id="mobile-menu" className="fixed inset-x-0 top-[60px] bottom-0 z-40 bg-void/97 backdrop-blur-md">
            <nav aria-label="Разделы" className="flex flex-col px-4 pt-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-seam/70 py-4 font-display text-[26px] leading-tight hover:text-neon"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 space-y-3 px-4">
              <a
                href={business.phoneHref}
                className="flex items-center justify-center gap-2 rounded-2xl bg-neon py-4 text-[17px] font-semibold text-neon-ink"
              >
                <PhoneIcon className="size-5" />
                {business.phone}
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={business.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-seam py-3.5 text-[15px] font-medium"
                >
                  <TelegramIcon className="size-5" />
                  Telegram
                </a>
                <a
                  href={business.vk}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-seam py-3.5 text-[15px] font-medium"
                >
                  <VkIcon className="size-5" />
                  ВКонтакте
                </a>
              </div>
              <p className="pt-2 text-center text-[14px] text-alu">
                {business.city}, {business.address}
                <br />
                {business.hours}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
