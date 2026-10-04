"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { extras, finishes, formatRub, glosses, itemTypes, radii } from "@/lib/data";
import { useOrder } from "./order-context";

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = "+7";
  if (p[0]) out += ` (${p[0]}`;
  if (p[0].length === 3) out += ")";
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

const MAX_PHOTOS = 5;

/** Окно заявки: снизу на телефоне, по центру на ПК. Всё выбранное в прайсе и палитре уже подставлено. */
export function BookingSheet() {
  const { bookingOpen, closeBooking } = useOrder();
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : desktop
      ? { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16 } }
      : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6" role="presentation">
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeBooking}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            {...panelMotion}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative flex max-h-[92dvh] w-full flex-col rounded-t-3xl border-t border-seam bg-pit md:max-w-xl md:rounded-3xl md:border"
          >
            <Panel />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Panel() {
  const o = useOrder();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const { closeBooking } = o;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeBooking]);

  // Превью фото живут, пока открыто окно: при закрытии освобождаем все ссылки
  const urls = useRef<string[]>([]);
  useEffect(() => {
    urls.current = files.map((f) => f.url);
  }, [files]);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const isWheels = o.item === "wheels";
  const gloss = glosses.find((g) => g.id === o.gloss)?.name.toLowerCase();
  const chosenExtras = extras.filter((e) => o.extraIds.includes(e.id));
  const summary = isWheels
    ? [
        `${radii[o.radius].label}, ${o.qty} ${o.qty === 1 ? "диск" : "диска"}`,
        finishes.find((f) => f.id === o.finish)?.name.toLowerCase(),
        ...chosenExtras.map((e) => e.name.toLowerCase()),
      ].join(", ")
    : `${itemTypes.find((t) => t.id === o.item)?.name}: оценим по фото`;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - files.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setFiles((p) => [...p, ...next]);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length !== 11)
      return setError("Введите номер полностью — 10 цифр после +7. По нему перезвоним.");
    setError(null);
    // ДЕМО: здесь будет отправка заявки с фото в Telegram-бот мастерской
    setSent(true);
  }

  function edit(hash: string) {
    closeBooking();
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  const input =
    "w-full rounded-xl border border-seam bg-void px-4 py-3.5 text-[16px] outline-none placeholder:text-alu/60 focus:border-neon";

  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className="flex min-h-0 flex-1 flex-col outline-none"
    >
      <div className="flex items-center justify-between px-5 pt-3 pb-2 md:pt-5">
        <span className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-seam md:hidden" aria-hidden="true" />
        <h2 id="booking-title" className="mt-3 font-display text-[24px] md:mt-0">
          {sent ? "Заявка отправлена" : "Заявка"}
        </h2>
        <button
          type="button"
          onClick={closeBooking}
          aria-label="Закрыть"
          className="mt-3 grid size-10 place-items-center rounded-full border border-seam text-[22px] leading-none md:mt-0"
        >
          ×
        </button>
      </div>

      {sent ? (
        <div className="px-5 pb-8">
          <p className="text-[16px] leading-relaxed text-chalk/85">
            Перезвоним на {phone} в рабочее время, уточним детали и скажем, когда привезти.
          </p>
          <p className="mt-4 text-[13px] text-alu">Демо: заявка никуда не ушла. В рабочей версии она придёт мастерской в Telegram вместе с фото.</p>
          <button
            type="button"
            onClick={closeBooking}
            className="mt-6 w-full rounded-2xl bg-neon py-4 text-[17px] font-semibold text-neon-ink"
          >
            Готово
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-4">
            <div className="rounded-2xl bg-plate p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] leading-snug">{summary}</p>
                {isWheels && o.total !== null && (
                  <p className="shrink-0 font-display text-[18px] whitespace-nowrap tabular-nums">
                    {o.approx ? "от " : ""}
                    {formatRub(o.total)}
                  </p>
                )}
              </div>
              {isWheels && (
                <p className="mt-3 flex items-center gap-2 text-[14px] text-chalk/85">
                  <span className="size-4 rounded-full border border-white/20" style={{ background: o.color.hex }} />
                  RAL {o.color.code} {o.color.name}, {gloss}
                </p>
              )}
              <div className="mt-3 flex gap-4 text-[14px]">
                <button type="button" onClick={() => edit("prices")} className="text-neon underline-offset-4 hover:underline">
                  Изменить расчёт
                </button>
                {isWheels && (
                  <button type="button" onClick={() => edit("colors")} className="text-neon underline-offset-4 hover:underline">
                    Другой цвет
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[15px] font-medium">
                Фото изделия <span className="font-normal text-alu">— по желанию, до {MAX_PHOTOS} шт.</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {files.map((f) => (
                  <div key={f.url} className="relative">
                    <img src={f.url} alt={f.name} className="size-20 rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(f.url);
                        setFiles((p) => p.filter((x) => x.url !== f.url));
                      }}
                      aria-label={`Убрать ${f.name}`}
                      className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-chalk text-[15px] leading-none text-void"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {files.length < MAX_PHOTOS && (
                  <label className="grid size-20 cursor-pointer place-items-center rounded-xl border border-dashed border-alu/60 text-center text-[12px] leading-tight text-alu hover:border-neon hover:text-chalk">
                    <span>
                      <span className="block text-[22px] leading-none">+</span>
                      Добавить
                    </span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
                  </label>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium">Имя</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className={input} />
              </label>
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium">Телефон</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value ? formatPhone(e.target.value) : "")}
                  onFocus={() => !phone && setPhone("+7")}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (___) ___-__-__"
                  className={`${input} tabular-nums`}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[15px] font-medium">Комментарий</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Марка авто, что не так с дисками"
                className={`${input} resize-none`}
              />
            </label>
          </div>

          <div className="border-t border-seam px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {error && (
              <p role="alert" className="mb-3 rounded-xl bg-neon/12 px-4 py-2.5 text-[14px] text-[#f6b9d6]">
                {error}
              </p>
            )}
            <button type="submit" className="w-full rounded-2xl bg-neon py-4 text-[17px] font-semibold text-neon-ink hover:brightness-110">
              Отправить заявку
            </button>
            <p className="mt-2 text-center text-[12px] text-alu">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          </div>
        </form>
      )}
    </div>
  );
}
