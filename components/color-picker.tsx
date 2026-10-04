"use client";

import { glosses, ralColors } from "@/lib/data";
import { OrderButton, useOrder } from "./order-context";
import { Wheel } from "./wheel";

export function ColorPicker() {
  const o = useOrder();

  return (
    <section id="colors" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl px-4 py-14 md:grid-cols-2 md:items-center md:gap-x-14 md:px-8 md:py-24">
        <div className="md:col-start-1">
          <h2 className="font-display text-[28px] leading-tight sm:text-[36px]">Подберите цвет</h2>
          <p className="mt-2 max-w-[44ch] text-[16px] text-chalk/70">
            Нажмите на цвет — диск перекрасится. Выбор сохранится в заявке.
          </p>
        </div>

        <div className="mx-auto mt-6 w-full max-w-[420px] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:max-w-[520px]">
          <Wheel color={o.color.hex} gloss={o.gloss} />
          <p className="mt-2 text-center text-[13px] text-alu">Потяните диск влево или вправо, чтобы повернуть</p>
        </div>

        <div className="mt-6 md:col-start-1 md:self-start">
          <p className="text-[15px] text-alu" aria-live="polite">
            RAL {o.color.code}
            <span className="mt-1 block font-display text-[26px] leading-tight text-chalk">{o.color.name}</span>
          </p>

          <fieldset className="mt-5 min-w-0">
            <legend className="sr-only">Цвет RAL</legend>
            <div className="grid grid-cols-7 gap-2.5">
              {ralColors.map((c) => {
                const on = c.code === o.color.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => o.setColor(c)}
                    aria-pressed={on}
                    aria-label={`RAL ${c.code}, ${c.name}`}
                    title={`RAL ${c.code} ${c.name}`}
                    className={`aspect-square w-full rounded-full border transition-transform ${
                      on ? "scale-110 border-chalk ring-2 ring-neon ring-offset-2 ring-offset-void" : "border-white/15 hover:scale-105"
                    }`}
                    style={{ background: c.hex }}
                  />
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6 min-w-0">
            <legend className="mb-2.5 text-[15px] font-semibold">Фактура</legend>
            <div className="inline-grid grid-cols-3 rounded-full border border-seam p-1">
              {glosses.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={o.gloss === g.id}
                  onClick={() => o.setGloss(g.id)}
                  className={`rounded-full px-4 py-2 text-[15px] ${
                    o.gloss === g.id ? "bg-chalk font-semibold text-void" : "text-chalk/80 hover:text-chalk"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <OrderButton
              item="wheels"
              className="rounded-2xl bg-neon px-6 py-4 text-[17px] font-semibold text-neon-ink hover:brightness-110"
            >
              Хочу такой цвет
            </OrderButton>
          </div>
          <p className="mt-3 text-[13px] text-alu">
            Цвет на экране примерный. В мастерской покажем выкрас на металле — и любой другой из каталога RAL.
          </p>
        </div>
      </div>
    </section>
  );
}
