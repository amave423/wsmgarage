import { business, faq, reviews } from "@/lib/data";
import { Carousel } from "./carousel";
import { Logo } from "./header";
import { RouteIcon, TelegramIcon, VkIcon } from "./icons";

const h2 = "font-display text-[28px] leading-tight sm:text-[36px]";

export function Reviews() {
  return (
    <section className="border-y border-seam/60 bg-pit">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={h2}>Отзывы</h2>
          <a
            href={business.reviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-baseline gap-2 text-[15px] text-alu hover:text-chalk"
          >
            <span className="font-display text-[26px] text-chalk">{business.rating.toLocaleString("ru-RU")}</span>
            из 5 на Яндекс Картах, {business.ratingCount} оценок
          </a>
        </div>
        <Carousel label="Отзывы" slideClass="w-[85%] sm:w-[48%] md:w-[calc((100%-2rem)/3)]" className="mt-6">
          {reviews.map((r) => (
            <figure key={r.author} className="flex h-full min-h-[200px] flex-col rounded-2xl border border-seam bg-void p-5">
              <p className="text-neon" aria-label="5 звёзд">★★★★★</p>
              <blockquote className="mt-3 flex-1 text-[16px] leading-relaxed">{r.text}</blockquote>
              <figcaption className="mt-4 text-[14px] text-alu">
                {r.author}, {r.date}
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
      <h2 className={h2}>Вопросы</h2>
      <div className="mt-6 divide-y divide-seam/70 border-y border-seam/70">
        {faq.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="text-[22px] leading-none text-neon transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="pb-5 text-[16px] leading-relaxed text-chalk/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Contacts() {
  return (
    <section id="contacts" className="border-t border-seam/60 bg-pit">
      <div className="mx-auto max-w-6xl px-4 py-14 md:grid md:grid-cols-[1fr_1.4fr] md:gap-12 md:px-8 md:py-20">
        <div>
          <h2 className={h2}>Как нас найти</h2>
          <dl className="mt-6 space-y-5 text-[16px]">
            <div>
              <dt className="text-[14px] text-alu">Адрес</dt>
              <dd className="mt-1">
                {business.city}, {business.address}
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-alu">Режим работы</dt>
              <dd className="mt-1">{business.hours}</dd>
            </div>
            <div>
              <dt className="text-[14px] text-alu">Телефон</dt>
              <dd className="mt-1">
                <a href={business.phoneHref} className="font-display text-[22px] tabular-nums hover:text-neon">
                  {business.phone}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-7 grid grid-cols-3 gap-2">
            <a
              href={business.routeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-neon py-3.5 text-[15px] font-semibold text-neon-ink"
            >
              <RouteIcon className="size-4" />
              Маршрут
            </a>
            <a href={business.telegram} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl border border-seam gap-1.5 py-3.5 text-[15px] font-medium hover:border-alu">
              <TelegramIcon className="size-4 shrink-0" />
              Telegram
            </a>
            <a href={business.vk} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl border border-seam gap-1.5 py-3.5 text-[15px] font-medium hover:border-alu">
              <VkIcon className="size-4 shrink-0" />
              ВКонтакте
            </a>
          </div>
        </div>

        <div className="mt-8 h-[340px] overflow-hidden rounded-2xl md:mt-0 md:h-auto md:min-h-[420px]">
          <iframe
            src={`https://yandex.ru/map-widget/v1/?oid=${business.yandexOrgId}&ol=biz&z=16&theme=dark`}
            title="WSM Garage на Яндекс Картах"
            className="size-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-seam/60 pb-28 md:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-8 text-[14px] text-alu md:flex-row md:items-center md:justify-between md:px-8">
        <Logo />
        <p>
          {business.city}, {business.address}.{" "}
          <a href={business.phoneHref} className="hover:text-chalk">
            {business.phone}
          </a>
        </p>
      </div>
    </footer>
  );
}
