"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  extras,
  finishes,
  ralColors,
  wheelsPrice,
  type Finish,
  type Gloss,
  type ItemType,
  type RalColor,
} from "@/lib/data";

type Order = {
  item: ItemType;
  setItem: (t: ItemType) => void;
  radius: number;
  setRadius: (r: number) => void;
  qty: number;
  setQty: (q: number) => void;
  finish: Finish;
  setFinish: (f: Finish) => void;
  extraIds: string[];
  toggleExtra: (id: string) => void;
  color: RalColor;
  setColor: (c: RalColor) => void;
  gloss: Gloss;
  setGloss: (g: Gloss) => void;
  /** Сумма есть только для дисков; для остального — оценка по фото. */
  total: number | null;
  approx: boolean;
  bookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const OrderContext = createContext<Order | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ItemType>("wheels");
  const [radius, setRadius] = useState(2); // R17 — самый ходовой
  const [qty, setQty] = useState(4);
  const [finish, setFinish] = useState<Finish>("one");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [color, setColor] = useState<RalColor>(ralColors.find((c) => c.code === "4010") ?? ralColors[0]);
  const [gloss, setGloss] = useState<Gloss>("gloss");
  const [bookingOpen, setBookingOpen] = useState(false);

  const value = useMemo<Order>(() => {
    let total: number | null = null;
    let approx = false;
    if (item === "wheels") {
      const chosen = extras.filter((e) => extraIds.includes(e.id));
      const f = finishes.find((x) => x.id === finish);
      // Доплата за алюмохром указана за комплект — для неполного делим пропорционально
      const finishAdd = f?.add ? Math.round((f.add * Math.min(qty, 4)) / 4) : 0;
      total = wheelsPrice(radius, qty) + finishAdd + chosen.reduce((s, e) => s + e.perWheel * qty, 0);
      approx = finish === "two" || chosen.some((e) => e.from);
    }
    return {
      item,
      setItem,
      radius,
      setRadius,
      qty,
      setQty,
      finish,
      setFinish,
      extraIds,
      toggleExtra: (id) => setExtraIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
      color,
      setColor,
      gloss,
      setGloss,
      total,
      approx,
      bookingOpen,
      openBooking: () => setBookingOpen(true),
      closeBooking: () => setBookingOpen(false),
    };
  }, [item, radius, qty, finish, extraIds, color, gloss, bookingOpen]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}

/** Любая кнопка «Оставить заявку» — открывает окно с уже собранным заказом. */
export function OrderButton({
  className,
  children,
  item,
}: {
  className?: string;
  children: ReactNode;
  item?: ItemType;
}) {
  const { openBooking, setItem } = useOrder();
  return (
    <button
      type="button"
      onClick={() => {
        if (item) setItem(item);
        openBooking();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
