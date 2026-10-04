"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { extras, finishes, formatRub, glosses, itemTypes, otherItems, radii, wheelsPrice } from "@/lib/data";
import { OrderButton, useOrder } from "./order-context";

const chip = (on: boolean) =>
  `rounded-xl border px-3 py-2.5 text-left transition-colors ${
    on ? "border-neon bg-neon/12 text-chalk" : "border-seam text-chalk/85 hover:border-alu"
  }`;

export function Prices() {
  const o = useOrder();

  return (
    <section id="prices" className="border-y border-seam/60 bg-pit">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <h2 className="font-display text-[28px] leading-tight sm:text-[36px]">Цены и расчёт</h2>
        <p className="mt-2 max-w-[52ch] text-[16px] text-chalk/70">
          Выберите, что красим, — сумма посчитается сразу. Точную цену назовём при приёмке.
        </p>

        <fieldset className="mt-7 min-w-0">
          <legend className="sr-only">Что красим</legend>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {itemTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={o.item === t.id}
                onClick={() => o.setItem(t.id)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-[15px] font-medium ${
                  o.item === t.id ? "border-chalk bg-chalk text-void" : "border-seam text-chalk/85 hover:border-alu"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </fieldset>

        {o.item === "wheels" ? <WheelsCalc /> : <OtherItem />}
      </div>
    </section>
  );
}

function WheelsCalc() {
  const o = useOrder();
  return (
    <div className="mt-8 md:grid md:grid-cols-[1fr_340px] md:items-start md:gap-10">
      <div className="space-y-8">
        <fieldset className="min-w-0">
          <legend className="mb-3 text-[16px] font-semibold">Радиус</legend>
          <div className="grid grid-cols-4 gap-2">
            {radii.map((r, i) => (
              <button
                key={r.label}
                type="button"
                aria-pressed={o.radius === i}
                onClick={() => o.setRadius(i)}
                className={chip(o.radius === i)}
              >
                <span className="block text-[15px] font-semibold tabular-nums">{r.label}</span>
                <span className="mt-0.5 block text-[12px] text-alu tabular-nums">{(r.set / 1000).toLocaleString("ru-RU")} тыс.</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-alu">Цена за комплект из четырёх дисков в один цвет.</p>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-3 text-[16px] font-semibold">Сколько дисков</legend>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={o.qty === n}
                onClick={() => o.setQty(n)}
                className={`${chip(o.qty === n)} text-center text-[17px] font-semibold tabular-nums`}
              >
                {n}
              </button>
            ))}
          </div>
          {o.qty < 4 && (
            <p className="mt-2 text-[13px] text-alu">
              Поштучно: {formatRub(wheelsPrice(o.radius, 1))} за диск.
            </p>
          )}
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-3 text-[16px] font-semibold">Покраска</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {finishes.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={o.finish === f.id}
                onClick={() => o.setFinish(f.id)}
                className={chip(o.finish === f.id)}
              >
                <span className="block text-[15px] font-semibold">{f.name}</span>
                <span className="mt-0.5 block text-[13px] text-alu">{f.note}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-3 text-[16px] font-semibold">Дополнительно</legend>
          <div className="divide-y divide-seam/70 rounded-2xl border border-seam">
            {extras.map((e) => {
              const on = o.extraIds.includes(e.id);
              return (
                <label key={e.id} className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => o.toggleExtra(e.id)}
                    className="size-5 shrink-0 accent-[#e0589c]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px]">{e.name}</span>
                    <span className="block text-[13px] text-alu">{e.note}</span>
                  </span>
                  <span className="shrink-0 text-[14px] text-chalk/80 tabular-nums">
                    {e.from ? "от " : ""}
                    {formatRub(e.perWheel)}
                    <span className="text-alu">/шт</span>
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-[13px] text-alu">Шиномонтаж, пескоструй, грунт и запекание уже входят в цену.</p>
        </fieldset>
      </div>

      <Summary />
    </div>
  );
}

function Summary() {
  const o = useOrder();
  const reduce = useReducedMotion();
  const gloss = glosses.find((g) => g.id === o.gloss)?.name.toLowerCase();

  return (
    <div className="mt-8 rounded-3xl border border-seam bg-void p-5 md:sticky md:top-[84px] md:mt-0">
      <p className="text-[14px] text-alu">
        {radii[o.radius].label}, {o.qty} {o.qty === 1 ? "диск" : "диска"}
      </p>
      <p className="mt-1 overflow-hidden font-display text-[38px] leading-tight tabular-nums">
        {/* Анимируем только пересчёт: при первой загрузке цена стоит на месте */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={`${o.total}-${o.approx}`}
            className="inline-block"
            initial={reduce ? false : { y: "45%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {o.approx ? "от " : ""}
            {formatRub(o.total ?? 0)}
          </motion.span>
        </AnimatePresence>
      </p>

      <a href="#colors" className="mt-4 flex items-center gap-3 rounded-xl border border-seam px-3 py-2.5 hover:border-alu">
        <span className="size-7 shrink-0 rounded-full border border-white/15" style={{ background: o.color.hex }} />
        <span className="min-w-0 flex-1 text-[14px] leading-snug">
          RAL {o.color.code}, {gloss}
          <span className="block text-alu">Выбрать другой цвет</span>
        </span>
      </a>

      <OrderButton className="mt-4 w-full rounded-2xl bg-neon py-4 text-[17px] font-semibold text-neon-ink hover:brightness-110">
        Оставить заявку
      </OrderButton>
      <p className="mt-2 text-center text-[12px] text-alu">Перезвоним и уточним детали</p>
    </div>
  );
}

function OtherItem() {
  const o = useOrder();
  if (o.item === "wheels") return null;
  const info = otherItems[o.item];
  return (
    <div className="mt-8 md:grid md:grid-cols-[1fr_340px] md:items-start md:gap-10">
      <div>
        <p className="max-w-[56ch] text-[16px] leading-relaxed text-chalk/85">{info.lead}</p>
        <dl className="mt-6 divide-y divide-seam/70 rounded-2xl border border-seam">
          {info.rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 px-4 py-3.5 text-[15px]">
              <dt>{k}</dt>
              <dd className="font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-8 rounded-3xl border border-seam bg-void p-5 md:mt-0">
        <p className="font-display text-[22px] leading-snug">Цена по фото</p>
        <p className="mt-2 text-[15px] text-chalk/75">
          Сфотографируйте изделие, приложите к заявке — назовём цену и срок в течение рабочего дня.
        </p>
        <OrderButton className="mt-5 w-full rounded-2xl bg-neon py-4 text-[17px] font-semibold text-neon-ink hover:brightness-110">
          Отправить фото
        </OrderButton>
      </div>
    </div>
  );
}
