import type { NextConfig } from "next";

// На GitHub Pages сайт живёт по адресу /<repo>/, поэтому basePath берём из окружения
// (его выставляет workflow). Локально — пусто.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Кнопка-индикатор Next.js в углу (видна только в dev-режиме) — убираем, чтобы не мешала
  devIndicators: false,
};

export default nextConfig;
