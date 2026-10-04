const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к файлу из /public с учётом basePath (GitHub Pages). */
export const asset = (path: string) => `${base}${path}`;
