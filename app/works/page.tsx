import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import { OrderButton } from "@/components/order-context";

export const metadata: Metadata = {
  title: "Наши работы — WSM Garage, Сысерть",
  description: "Фото дисков, суппортов и деталей после порошковой покраски в мастерской WSM Garage.",
};

export default function WorksPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
      <h1 className="font-display text-[34px] leading-tight sm:text-[44px]">Наши работы</h1>
      <p className="mt-2 max-w-[52ch] text-[16px] text-chalk/70">
        Диски, детали и техника, которые прошли через нашу мастерскую. Нажмите на фото, чтобы открыть крупно.
      </p>
      <Gallery />
      <div className="mt-12 rounded-3xl border border-seam bg-pit p-6 md:flex md:items-center md:justify-between md:p-8">
        <p className="font-display text-[22px] leading-snug">Хотите так же?</p>
        <OrderButton className="mt-4 w-full rounded-2xl bg-neon px-6 py-4 text-[17px] font-semibold text-neon-ink hover:brightness-110 md:mt-0 md:w-auto">
          Оставить заявку
        </OrderButton>
      </div>
    </main>
  );
}
