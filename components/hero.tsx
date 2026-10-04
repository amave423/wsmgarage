import { asset } from "@/lib/asset";
import { business } from "@/lib/data";
import { OrderButton } from "./order-context";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-10 md:px-8 md:py-14">
        <div className="relative md:order-2">
          <img
            src={asset("/photos/hero-sign.jpg")}
            alt="Графитовый диск после покраски висит на цепях под неоновой вывеской WSM Garage"
            className="aspect-square w-full object-cover md:rounded-[28px]"
            fetchPriority="high"
          />
          {/* Плавный переход фото в чёрный фон на телефоне */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent md:hidden" />
        </div>

        <div className="relative -mt-16 px-4 md:mt-0 md:px-0">
          <h1 className="font-display text-[40px] leading-[1.02] sm:text-[52px] lg:text-[64px]">
            Порошковая покраска дисков в&nbsp;Сысерти
          </h1>
          <p className="mt-5 max-w-[34ch] text-[17px] leading-relaxed text-chalk/80 md:text-[18px]">
            Снимаем старое покрытие до металла, красим порошком в&nbsp;любой цвет RAL и&nbsp;запекаем. Комплект —{" "}
            {business.leadTime}.
          </p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-2 text-[15px] text-alu">
            Комплект R13–R14
            <span className="font-display text-[26px] text-chalk">от 7 000 ₽</span>
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href="#prices"
              className="rounded-2xl bg-neon px-6 py-4 text-center text-[17px] font-semibold text-neon-ink hover:brightness-110"
            >
              Рассчитать стоимость
            </a>
            <OrderButton className="rounded-2xl border border-seam px-6 py-4 text-[17px] font-medium hover:border-chalk">
              Отправить фото на оценку
            </OrderButton>
          </div>

          <a
            href={business.reviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[14px] text-alu hover:text-chalk"
          >
            <span className="text-neon">★</span>
            {business.rating.toLocaleString("ru-RU")} на Яндекс Картах, {business.ratingCount} оценок
          </a>
        </div>
      </div>
    </section>
  );
}
