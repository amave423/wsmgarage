// Все данные сайта в одном месте. Заглушки помечены TODO — их нужно сверить с владельцем.
// Источники: карточка Яндекс Карт (org 23855221163) и группа VK wheelsmonkey — см. research/data.md.

export const business = {
  name: "WSM Garage",
  city: "Сысерть",
  // TODO: в VK другой адрес (ул. Трактовая, 28, корп. 2) и телефон +7 (901) 220-50-80 — уточнить, какие актуальны
  address: "ул. Калинина, 16А",
  phone: "+7 (982) 664-15-01",
  phoneHref: "tel:+79826641501",
  hours: "Ежедневно 10:00–18:00",
  coords: [56.497804, 60.822898] as const,
  yandexOrgId: "23855221163",
  yandexUrl: "https://yandex.ru/maps/org/23855221163/",
  reviewsUrl: "https://yandex.ru/maps/org/23855221163/reviews/",
  routeUrl: "https://yandex.ru/maps/?rtext=~56.497804,60.822898&rtt=auto",
  vk: "https://vk.ru/wheelsmonkey",
  telegram: "https://t.me/wsmgarage",
  rating: 4.7,
  ratingCount: 13,
  reviewsCount: 11,
  // TODO: срок из поста VK от июня 2025 — подтвердить
  leadTime: "до двух суток",
};

export const formatRub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

/* ---------- Калькулятор ---------- */

export type ItemType = "wheels" | "calipers" | "atv" | "parts";

export const itemTypes: { id: ItemType; name: string; short: string }[] = [
  { id: "wheels", name: "Диски", short: "Диски" },
  { id: "calipers", name: "Суппорты", short: "Суппорты" },
  { id: "atv", name: "Мото и квадро", short: "Мото" },
  { id: "parts", name: "Детали и металл", short: "Детали" },
];

/** Прайс VK «реставрация дисков в 1 цвет», цена за комплект из 4 дисков. */
// TODO: прайс подписан ещё «Wheels Monkey» — проверить актуальность
export const radii: { label: string; set: number }[] = [
  { label: "R13–14", set: 7000 },
  { label: "R15–16", set: 8000 },
  { label: "R17", set: 9000 },
  { label: "R18", set: 10000 },
  { label: "R19", set: 12000 },
  { label: "R20–21", set: 14000 },
  { label: "R22", set: 16000 },
  { label: "R23–24", set: 17000 },
];

/** Цена за количество дисков. Комплект — по прайсу, поштучно — четверть комплекта с наценкой. */
// TODO: поштучной цены в прайсе нет — заглушка (¼ комплекта + 25 %, с округлением до 100 ₽)
export function wheelsPrice(radius: number, qty: number) {
  const set = radii[radius].set;
  if (qty >= 4) return Math.round((set / 4) * qty);
  return Math.ceil(((set / 4) * 1.25 * qty) / 100) * 100;
}

export type Finish = "one" | "chrome" | "two";

export const finishes: { id: Finish; name: string; note: string; add?: number }[] = [
  { id: "one", name: "В один цвет", note: "по прайсу" },
  { id: "chrome", name: "Алюмохром", note: "+3 000 ₽ за комплект", add: 3000 },
  { id: "two", name: "В два цвета", note: "считаем индивидуально" },
];

export type Extra = { id: string; name: string; note: string; perWheel: number; from?: boolean };

// TODO: цен на доп. работы нет ни в VK, ни на Яндексе — все суммы ниже заглушки
export const extras: Extra[] = [
  { id: "repair", name: "Ремонт сколов и бордюрки", note: "наплавка и шлифовка кромки", perWheel: 500, from: true },
  { id: "straighten", name: "Правка геометрии", note: "если диск бьёт", perWheel: 800, from: true },
  { id: "lacquer", name: "Прозрачный лак сверху", note: "глубже цвет, проще мыть", perWheel: 300 },
  { id: "aqua", name: "Аквабластинг вместо пескоструя", note: "мягче к алюминию", perWheel: 500, from: true },
];

/** Для остальных изделий — ориентиры «от» и оценка по фото. */
// TODO: ориентиры по суппортам, мото и деталям — заглушки, кроме «порошковая покраска от 300 ₽» (Яндекс/VK)
export const otherItems: Record<Exclude<ItemType, "wheels">, { lead: string; rows: [string, string][] }> = {
  calipers: {
    lead: "Красим суппорты в любой цвет RAL, можно с надписью. Снимать с машины — по договорённости.",
    rows: [
      ["Пара суппортов", "от 4 000 ₽"],
      ["Комплект из 4", "от 7 000 ₽"],
      ["Надпись на суппорт", "от 500 ₽"],
    ],
  },
  atv: {
    lead: "Диски, рамы, рычаги и защита для мотоциклов и квадроциклов. Красили технику для гоночной команды Snag Racing.",
    rows: [
      ["Диск квадроцикла", "от 1 500 ₽"],
      ["Бэдлок-кольцо", "от 800 ₽"],
      ["Рычаги, защита", "по фото"],
    ],
  },
  parts: {
    lead: "Кронштейны, решётки, ограждения, мебельный и строительный металл. Очистим и покрасим порошком.",
    rows: [
      ["Порошковая покраска", "от 300 ₽"],
      ["Аквабластинг", "от 500 ₽"],
      ["Промышленная очистка", "по фото"],
    ],
  },
};

/* ---------- Цвета RAL ---------- */

export type RalColor = { code: string; name: string; hex: string };

// Экранные цвета приблизительные: точный оттенок — по выкрасу в мастерской
export const ralColors: RalColor[] = [
  { code: "9005", name: "Чёрный", hex: "#0e0e10" },
  { code: "7021", name: "Чёрно-серый", hex: "#2f3234" },
  { code: "7016", name: "Антрацит", hex: "#383e42" },
  { code: "9007", name: "Серый алюминий", hex: "#8f8f8c" },
  { code: "9006", name: "Белый алюминий", hex: "#a5a8a6" },
  { code: "9003", name: "Белый", hex: "#eceeec" },
  { code: "1036", name: "Перламутровое золото", hex: "#8a6c3b" },
  { code: "1023", name: "Жёлтый", hex: "#f0c400" },
  { code: "2004", name: "Оранжевый", hex: "#e25303" },
  { code: "3020", name: "Красный", hex: "#c1121c" },
  { code: "4010", name: "Телемагента", hex: "#cf3476" },
  { code: "5015", name: "Небесно-синий", hex: "#2271b3" },
  { code: "6018", name: "Жёлто-зелёный", hex: "#57a639" },
  { code: "6005", name: "Зелёный мох", hex: "#114232" },
];

export type Gloss = "gloss" | "matte" | "metallic";
export const glosses: { id: Gloss; name: string }[] = [
  { id: "gloss", name: "Глянцевый" },
  { id: "matte", name: "Матовый" },
  { id: "metallic", name: "Металлик" },
];

/* ---------- Фото ---------- */

export type Photo = { src: string; alt: string; tag: "wheels" | "parts" | "atv" };

export const photos: Photo[] = [
  { src: "/photos/black-matte-pair.jpg", alt: "Два диска в чёрном супер-матовом лаке", tag: "wheels" },
  { src: "/photos/yellow.jpg", alt: "Литой диск в ярко-жёлтом цвете на траве", tag: "wheels" },
  { src: "/photos/graphite-wall.jpg", alt: "Графитовый диск с искрой у кирпичной стены", tag: "wheels" },
  { src: "/photos/prado-steel.jpg", alt: "Штатные стальные диски Toyota Prado после покраски в серый", tag: "wheels" },
  { src: "/photos/black-matte-sign.jpg", alt: "Чёрный матовый диск под вывеской WSM Garage", tag: "wheels" },
  { src: "/photos/white-6spoke.jpg", alt: "Светлый шестиспицевый диск после покраски", tag: "wheels" },
  { src: "/photos/silver-5spoke.jpg", alt: "Серебристый пятиспицевый диск", tag: "wheels" },
  { src: "/photos/black-snow.jpg", alt: "Чёрный матовый диск на снегу", tag: "wheels" },
  { src: "/photos/graphite-pallet.jpg", alt: "Графитовые диски на палете в мастерской", tag: "wheels" },
  { src: "/photos/silver-grass.jpg", alt: "Серебристый диск на траве", tag: "wheels" },
  { src: "/photos/silver-shop.jpg", alt: "Серебристый диск висит в цеху после покраски", tag: "wheels" },
  { src: "/photos/black-set-tyres.jpg", alt: "Комплект чёрных дисков в шинах", tag: "wheels" },
  { src: "/photos/silver-tyres.jpg", alt: "Серебристые диски в шинах после работы", tag: "wheels" },
  { src: "/photos/silver-pair.jpg", alt: "Пара серебристых дисков в шинах", tag: "wheels" },
  { src: "/photos/parts-oven.jpg", alt: "Детали подвески висят в покрасочной камере", tag: "parts" },
  { src: "/photos/brackets.jpg", alt: "Чёрные кронштейны после порошковой покраски", tag: "parts" },
  { src: "/photos/shocks.jpg", alt: "Амортизаторы с окрашенными пружинами на стойке", tag: "parts" },
  { src: "/photos/atv-beadlock.jpg", alt: "Диск квадроцикла: чёрный мат и матовый графит", tag: "atv" },
  { src: "/photos/atv-tyre.jpg", alt: "Окрашенный диск квадроцикла в грязевой шине", tag: "atv" },
  { src: "/photos/atv-parts.jpg", alt: "Квадроцикл и окрашенные детали для команды Snag Racing", tag: "atv" },
];

export const photoTags: { id: Photo["tag"] | "all"; name: string }[] = [
  { id: "all", name: "Все" },
  { id: "wheels", name: "Диски" },
  { id: "parts", name: "Детали" },
  { id: "atv", name: "Мото и квадро" },
];

/* ---------- Процесс ---------- */

export const steps: { title: string; text: string }[] = [
  { title: "Принимаем и смотрим", text: "Снимаем шины, проверяем сколы, бордюрку и геометрию. Сразу называем цену." },
  { title: "Снимаем старое покрытие", text: "Пескоструй или аквабластинг до чистого металла — без этого новый слой не держится." },
  { title: "Готовим поверхность", text: "Обезжириваем, правим дефекты, наносим грунт." },
  { title: "Красим порошком", text: "Электростатический пистолет ровно кладёт краску в выбранном цвете RAL." },
  { title: "Запекаем", text: "В печи порошок плавится и становится цельным твёрдым слоем." },
  { title: "Собираем и отдаём", text: "По желанию — лак. Ставим шины, балансируем, отдаём готовые колёса." },
];

/* ---------- Почему порошок ---------- */

export const comparison: { label: string; powder: string; spray: string }[] = [
  { label: "Толщина слоя", powder: "60–120 мкм", spray: "20–40 мкм" },
  { label: "Соль и реагенты", powder: "Держит", spray: "Пузырится за зиму" },
  { label: "Камни и бордюры", powder: "Слой упругий, сколы редки", spray: "Сколы с первого сезона" },
  { label: "Срок службы", powder: "Годы", spray: "Сезон-два" },
];

/* ---------- Отзывы ---------- */

// TODO: короткие цитаты из отзывов на Яндекс Картах — согласовать с владельцем перед запуском
export const reviews: { author: string; date: string; text: string }[] = [
  { author: "Владислав С.", date: "сентябрь 2026", text: "Обычные стальные диски с Renault Arkana мастер Алексей сделал будто литые. Краска держится." },
  { author: "Алина С.", date: "октябрь 2024", text: "Даже при близком рассмотрении не видно ни одного изъяна. Цвет получился именно такой, какой я хотела." },
  { author: "Сергей К.", date: "октябрь 2024", text: "Большой плюс — в кратчайшие сроки. Успел на шиномонтаж уже с новыми дисками." },
  { author: "Катя Д.", date: "октябрь 2024", text: "Доступные цены, большой выбор цветов. Всё быстро и качественно." },
  { author: "Артём Г.", date: "октябрь 2024", text: "Покрасили диски быстро и качественно. Прошло больше двух недель — всё хорошо." },
  { author: "Иван О.", date: "октябрь 2024", text: "Качество просто пушка." },
];

/* ---------- Продажа дисков ---------- */

// TODO: в отзывах пишут про большой выбор дисков — узнать, что в наличии, и как часто обновлять витрину
export const wheelsForSale = {
  lead: "Новые и б/у диски в наличии. Подберём по разболтовке и вылету, перекрасим в нужный цвет и поставим на ваши шины.",
  photo: "/photos/silver-pair.jpg",
};

/* ---------- FAQ ---------- */

export const faq: { q: string; a: string }[] = [
  {
    q: "Сколько времени занимает покраска?",
    a: `Комплект дисков — ${business.leadTime}. Детали и большие партии — по договорённости.`,
  },
  { q: "Нужно снимать шины?", a: "Нет. Привозите колёса в сборе — шиномонтаж и балансировку сделаем сами." },
  {
    q: "Какие цвета можно выбрать?",
    a: "Любой цвет по каталогу RAL: глянец, мат, металлик. Алюмохром — +3 000 ₽ за комплект. Два цвета на одном диске считаем отдельно.",
  },
  {
    q: "Можно привезти не диски?",
    a: "Да: суппорты, детали подвески, кронштейны, рамы, решётки. Пришлите фото — назовём цену.",
  },
  // TODO: гарантия и способы оплаты — уточнить у владельца
  { q: "Есть гарантия?", a: "Да, на покрытие. Срок назовём при приёмке." },
  { q: "Как оплатить?", a: "Наличными, картой или переводом после приёмки работы." },
];
