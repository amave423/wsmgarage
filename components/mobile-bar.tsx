"use client";

import { business, formatRub } from "@/lib/data";
import { PhoneIcon, RouteIcon } from "./icons";
import { OrderButton, useOrder } from "./order-context";

export function MobileBar() {
  const { total, approx } = useOrder();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-seam bg-void/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <a href={business.phoneHref} aria-label="Позвонить" className="grid size-12 shrink-0 place-items-center rounded-xl border border-seam">
          <PhoneIcon className="size-5 text-neon" />
        </a>
        <a
          href={business.routeUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Маршрут"
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-seam"
        >
          <RouteIcon className="size-5 text-neon" />
        </a>
        <OrderButton className="flex flex-1 items-center justify-between rounded-xl bg-neon px-4 text-neon-ink">
          <span className="text-[16px] font-semibold">Заявка</span>
          {total !== null && (
            <span className="font-display text-[15px] tabular-nums">
              {approx ? "от " : ""}
              {formatRub(total)}
            </span>
          )}
        </OrderButton>
      </div>
    </div>
  );
}
