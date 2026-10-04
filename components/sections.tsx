import Link from "next/link";
import { asset } from "@/lib/asset";
import { comparison, steps, wheelsForSale } from "@/lib/data";
import { OrderButton } from "./order-context";

const h2 = "font-display text-[28px] leading-tight sm:text-[36px]";
const wrap = "mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20";

/** Честное «было / стало»: два реальных диска с их фото. Пары одного диска пока нет. */
// TODO: попросить у владельца фото одного диска до и после — тогда заменить на слайдер
export function BeforeAfter() {
  return (
    <section className={wrap}>
      <h2 className={h2}>Приезжает так, уезжает так</h2>
      <div className="mt-6 grid grid-cols-2 gap-2 md:gap-4">
        <figure>
          <img
            src={asset("/photos/steel-before.jpg")}
            alt="Стальной диск с облезшей краской и ржавчиной"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-2xl object-cover grayscale-[30%] md:aspect-[4/3]"
          />
          <figcaption className="mt-2 text-[14px] text-alu">Было: ржавчина и облезшая краска</figcaption>
        </figure>
        <figure>
          <img
            src={asset("/photos/steel-after.jpg")}
            alt="Стальной диск после покраски в чёрный глянец"
            loading="lazy"
            className="aspect-[3/4] w-full rounded-2xl object-cover md:aspect-[4/3]"
          />
          <figcaption className="mt-2 text-[14px] text-alu">Стало: чёрный глянец</figcaption>
        </figure>
      </div>
      <p className="mt-3 text-[13px] text-alu">Два похожих штампованных диска из нашей мастерской.</p>
    </section>
  );
}

export function Process() {
  return (
    <section className="border-y border-seam/60 bg-pit">
      <div className={wrap}>
        <h2 className={h2}>Как мы работаем</h2>
        <p className="mt-2 max-w-[52ch] text-[16px] text-chalk/70">
          Полный цикл в одной мастерской: от шиномонтажа до запекания. Своя пескоструйная установка — без посредников.
        </p>
        <ol className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="font-display text-[28px] leading-none text-neon tabular-nums">{i + 1}</span>
              <div>
                <h3 className="text-[17px] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-chalk/70">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <img
          src={asset("/photos/parts-oven.jpg")}
          alt="Детали подвески висят в покрасочной камере перед запеканием"
          loading="lazy"
          className="mt-10 aspect-[16/10] w-full rounded-2xl object-cover md:aspect-[21/8]"
        />
      </div>
    </section>
  );
}

export function WhyPowder() {
  return (
    <section className={wrap}>
      <h2 className={h2}>Почему порошок, а не баллончик</h2>
      <p className="mt-2 max-w-[56ch] text-[16px] text-chalk/70">
        Порошок не сохнет, а запекается: получается толстый цельный слой, которому не страшны уральская зима и
        реагенты.
      </p>
      <div className="mt-7 overflow-hidden rounded-2xl border border-seam">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-plate px-4 py-3 text-[13px] text-alu">
          <span />
          <span className="font-semibold text-neon">Порошок</span>
          <span>Аэрозоль, эмаль</span>
        </div>
        {comparison.map((r) => (
          <div key={r.label} className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 border-t border-seam/70 px-4 py-3.5 text-[14px] sm:text-[15px]">
            <span className="text-alu">{r.label}</span>
            <span className="font-medium">{r.powder}</span>
            <span className="text-chalk/60">{r.spray}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ForBusiness() {
  return (
    <section className="border-y border-seam/60 bg-pit">
      <div className={`${wrap} md:grid md:grid-cols-2 md:items-center md:gap-12`}>
        <div>
          <h2 className={h2}>Не только диски</h2>
          <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-chalk/80">
            Красим суппорты, детали подвески, кронштейны, рамы мото и квадроциклов. Берём партии для бизнеса: металлоконструкции,
            ограждения, промышленную очистку оборудования.
          </p>
          <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-chalk/80">
            Красили детали для гоночной команды Snag Racing.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <OrderButton item="parts" className="rounded-2xl bg-chalk px-6 py-4 text-[17px] font-semibold text-void hover:bg-white">
              Отправить фото детали
            </OrderButton>
            <Link
              href="/works/"
              className="rounded-2xl border border-seam px-6 py-4 text-center text-[17px] font-medium hover:border-chalk"
            >
              Смотреть работы
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 md:mt-0 md:gap-3">
          <img src={asset("/photos/atv-beadlock.jpg")} alt="Диск квадроцикла в чёрном мате с графитом" loading="lazy" className="row-span-2 h-full w-full rounded-2xl object-cover" />
          <img src={asset("/photos/brackets.jpg")} alt="Чёрные кронштейны после покраски" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
          <img src={asset("/photos/shocks.jpg")} alt="Амортизаторы с окрашенными пружинами" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
        </div>
      </div>
    </section>
  );
}

export function WheelsForSale() {
  return (
    <section className={wrap}>
      <div className="relative overflow-hidden rounded-3xl border border-seam bg-plate md:grid md:grid-cols-[1fr_1.1fr]">
        <img
          src={asset(wheelsForSale.photo)}
          alt="Пара серебристых дисков в шинах"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
        />
        <div className="p-6 md:p-10">
          <h2 className={h2}>Диски в наличии</h2>
          <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-chalk/80">{wheelsForSale.lead}</p>
          <OrderButton
            item="wheels"
            className="mt-6 w-full rounded-2xl border border-chalk px-6 py-4 text-[17px] font-medium hover:bg-chalk hover:text-void sm:w-auto"
          >
            Подобрать диски
          </OrderButton>
        </div>
      </div>
    </section>
  );
}
