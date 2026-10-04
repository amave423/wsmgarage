// 3D-сцена диска на three.js. Модель строится кодом, без загрузки файлов:
// обод (профиль вращения), пять Y-образных спиц с фаской, ступица со сквозными отверстиями, шина.
// Подключается динамически (см. wheel.tsx), чтобы three.js не попадал в основной бандл.

import * as THREE from "three";
import type { Gloss } from "@/lib/data";

/**
 * Студия для отражений: тёмная комната и яркие софтбоксы. На глянце лампы отражаются
 * чёткими полосами, на мате превращаются в мягкую светотень — так фактуры и различаются.
 */
function studioEnvironment() {
  const env = new THREE.Scene();
  env.background = new THREE.Color("#0b0b0c");
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(20, 12, 20),
    new THREE.MeshBasicMaterial({ color: "#232326", side: THREE.BackSide }),
  );
  env.add(room);
  const light = (w: number, h: number, power: number, x: number, y: number, z: number, tint = "#ffffff") => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(tint).multiplyScalar(power), side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  light(8, 2.2, 6, 0, 5.5, 2); // большой софтбокс сверху
  light(1.1, 7, 9, -6, 0.5, 4); // вертикальная полоса слева
  light(1.1, 7, 5, 6.5, 0, 2.5); // полоса справа, слабее
  light(5, 1, 2.5, 0, -4, 6, "#ffd9ec"); // тёплый подсвет снизу спереди
  return env;
}

/** Параметры краски для каждой фактуры. */
const FINISH: Record<Gloss, Partial<THREE.MeshPhysicalMaterialParameters>> = {
  // глянец: прозрачный лак поверх цвета — зеркальные блики
  gloss: { metalness: 0, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.03 },
  // мат: шероховатая поверхность рассеивает свет — ни одного резкого блика
  matte: { metalness: 0, roughness: 0.92, clearcoat: 0, clearcoatRoughness: 1 },
  // металлик: металлическая пудра под лаком, искра от карты нормалей
  metallic: { metalness: 0.75, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.06 },
};

/**
 * Карта нормалей «искры»: чешуйки пигмента по 3×3 пикселя с собственным наклоном.
 * Мипмапы усредняют их на расстоянии — вместо мерцающего шума получается ровный блеск.
 */
function flakeTexture() {
  const size = 512;
  const cell = 3;
  const data = new Uint8Array(size * size * 4);
  let seed = 11;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cells = Math.ceil(size / cell);
  const tilt: [number, number][] = Array.from({ length: cells * cells }, () => {
    // большинство чешуек лежит почти плашмя, редкие наклонены и «вспыхивают»
    const k = rnd() > 0.85 ? 0.55 : 0.18;
    return [(rnd() - 0.5) * k, (rnd() - 0.5) * k];
  });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [nx, ny] = tilt[Math.floor(y / cell) * cells + Math.floor(x / cell)];
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const i = (y * size + x) * 4;
      data[i] = (nx * 0.5 + 0.5) * 255;
      data[i + 1] = (ny * 0.5 + 0.5) * 255;
      data[i + 2] = (nz * 0.5 + 0.5) * 255;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 4;
  tex.repeat.set(6, 6);
  tex.needsUpdate = true;
  return tex;
}

/** Профиль обода (радиус, глубина): от задней закраины через полку к передней закраине. */
function rimGeometry() {
  const p: [number, number][] = [
    [0.95, -0.34],
    [0.97, -0.33],
    [0.975, -0.3], // задняя закраина
    [0.92, -0.27],
    [0.9, -0.22], // задняя посадочная полка
    [0.9, -0.14],
    [0.82, -0.08],
    [0.8, 0.0], // ручей
    [0.82, 0.05],
    [0.9, 0.1], // передняя посадочная полка: ровная, спицы упираются в неё изнутри
    [0.9, 0.25],
    [0.93, 0.29],
    [0.975, 0.305], // передняя закраина
    [0.995, 0.29],
    [1.0, 0.27],
    [0.99, 0.25],
  ];
  const pts = p.map(([r, z]) => new THREE.Vector2(r, z));
  const g = new THREE.LatheGeometry(pts, 160);
  g.rotateX(Math.PI / 2); // ось вращения — к зрителю
  return g;
}

/** Спица в форме «Y»: ствол от ступицы раздваивается к ободу, края скруглены широкой фаской. */
function spokeGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.08, 0.2);
  s.bezierCurveTo(-0.066, 0.31, -0.062, 0.41, -0.076, 0.5); // ствол
  // «ноги» заканчиваются на передней полке обода (r ≈ 0.87), не выходя за него
  s.bezierCurveTo(-0.105, 0.62, -0.155, 0.75, -0.215, 0.845); // внешний край левой «ноги»
  s.lineTo(-0.112, 0.87); // торец у обода
  s.bezierCurveTo(-0.094, 0.78, -0.06, 0.67, 0, 0.6); // внутренний край — до развилки
  s.bezierCurveTo(0.06, 0.67, 0.094, 0.78, 0.112, 0.87);
  s.lineTo(0.215, 0.845);
  s.bezierCurveTo(0.155, 0.75, 0.105, 0.62, 0.076, 0.5);
  s.bezierCurveTo(0.062, 0.41, 0.066, 0.31, 0.08, 0.2);
  s.quadraticCurveTo(0, 0.18, -0.08, 0.2);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSize: 0.022,
    bevelThickness: 0.04,
    bevelSegments: 10,
    curveSegments: 32,
  });
  g.translate(0, 0, -0.0225);
  return g;
}

/** Ступица: толстый фланец со сквозными отверстиями — центральным и пятью под болты, с фаской. */
function hubGeometry() {
  const s = new THREE.Shape();
  s.absarc(0, 0, 0.275, 0, Math.PI * 2, false);
  const hole = (x: number, y: number, r: number) => {
    const h = new THREE.Path();
    h.absarc(x, y, r, 0, Math.PI * 2, true);
    s.holes.push(h);
  };
  hole(0, 0, 0.082);
  for (let i = 0; i < 5; i++) {
    // между спицами: спица i смотрит вверх (+Y) и повёрнута на 72°·i
    const a = Math.PI / 2 + (i / 5) * Math.PI * 2 + Math.PI / 5;
    hole(Math.cos(a) * 0.172, Math.sin(a) * 0.172, 0.036);
  }
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.016,
    bevelSegments: 6,
    curveSegments: 48,
  });
  g.translate(0, 0, 0.335 - 0.076); // лицевая сторона — на z = 0.335
  return g;
}

/** Шина: профиль боковины, скруглённый к протектору. */
function tyreGeometry() {
  const pts: THREE.Vector2[] = [];
  const w = 0.36;
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI;
    // овал боковины: от передней кромки обода через протектор к задней
    const r = 1.0 + 0.36 * Math.sin(t);
    const z = w * Math.cos(t) - 0.02;
    pts.push(new THREE.Vector2(r, z));
  }
  const g = new THREE.LatheGeometry(pts, 160);
  g.rotateX(Math.PI / 2);
  return g;
}

export type WheelScene = {
  setPaint: (hex: string, gloss: Gloss) => void;
  dispose: () => void;
};

export function createWheelScene(canvas: HTMLCanvasElement, opts: { reduceMotion: boolean }): WheelScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // нейтральная тональная кривая не выбеливает и не пересыщает цвета RAL
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(studioEnvironment(), 0.02).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.15, 6.1);
  camera.lookAt(0, 0, 0);

  // ключевой свет сверху слева — даёт рисунок бликов на лаке
  const key = new THREE.DirectionalLight(0xffffff, 0.8);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe6f2, 0.25);
  rim.position.set(4, -1, -3);
  scene.add(rim);

  const flakes = flakeTexture();
  const paint = new THREE.MeshPhysicalMaterial({ color: "#888888", side: THREE.DoubleSide });
  const rubber = new THREE.MeshStandardMaterial({ color: "#1c1c1f", roughness: 0.78, metalness: 0 });
  const backingMat = new THREE.MeshBasicMaterial({ color: "#040405" });

  const wheel = new THREE.Group();

  wheel.add(new THREE.Mesh(rimGeometry(), paint));

  const spokeGeo = spokeGeometry();
  for (let i = 0; i < 5; i++) {
    const m = new THREE.Mesh(spokeGeo, paint);
    // вылет: спица наклонена назад — у ступицы впереди, у обода глубже
    m.rotation.x = -0.06;
    m.position.z = 0.27;
    const pivot = new THREE.Group();
    pivot.rotation.z = (i / 5) * Math.PI * 2;
    pivot.add(m);
    wheel.add(pivot);
  }

  wheel.add(new THREE.Mesh(hubGeometry(), paint));

  // за отверстиями — тёмная привалочная плоскость, чтобы в них была видна глубина
  const backing = new THREE.Mesh(new THREE.CircleGeometry(0.27, 64), backingMat);
  backing.position.z = 0.18;
  wheel.add(backing);

  wheel.add(new THREE.Mesh(tyreGeometry(), rubber));
  scene.add(wheel);

  // «Стенд»: диск слегка развёрнут, чтобы была видна глубина обода
  const stand = new THREE.Group();
  stand.add(wheel);
  scene.add(stand);
  stand.rotation.set(0.08, -0.5, 0);

  /* ---------- краска ---------- */

  const target = new THREE.Color("#888888");
  let painted = false;
  function setPaint(hex: string, gloss: Gloss) {
    target.set(hex);
    // первый цвет ставим сразу, дальше — плавный переход в цикле отрисовки
    if (!painted) paint.color.copy(target);
    painted = true;
    paint.setValues(FINISH[gloss]);
    paint.normalMap = gloss === "metallic" ? flakes : null;
    paint.normalScale = new THREE.Vector2(0.35, 0.35);
    paint.needsUpdate = true;
    if (opts.reduceMotion) paint.color.copy(target);
    wake();
  }

  /* ---------- управление: тянуть по горизонтали — вращать ---------- */

  let yaw = -0.5;
  let targetYaw = -0.5;
  let dragging = false;
  let lastX = 0;
  let lastInteract = 0;
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    lastInteract = performance.now();
    canvas.setPointerCapture(e.pointerId);
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    targetYaw = Math.max(-1.25, Math.min(1.25, targetYaw + (e.clientX - lastX) * 0.008));
    lastX = e.clientX;
    lastInteract = performance.now();
    wake();
  };
  const onUp = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  /* ---------- размер и цикл отрисовки ---------- */

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wake();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let visible = true;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) wake();
  });
  io.observe(canvas);

  let raf = 0;
  let spin = 0;
  const clock = new THREE.Clock();
  function frame() {
    raf = 0;
    const dt = Math.min(clock.getDelta(), 0.05);
    const idle = performance.now() - lastInteract > 2500;
    // без касаний — медленное покачивание, чтобы читались блики
    if (idle && !opts.reduceMotion) targetYaw = -0.5 + Math.sin(performance.now() / 2600) * 0.35;
    yaw += (targetYaw - yaw) * Math.min(1, dt * 6);
    stand.rotation.y = yaw;
    if (!opts.reduceMotion) {
      spin += dt * 0.15;
      wheel.rotation.z = -spin;
    }
    paint.color.lerp(target, Math.min(1, dt * 7));
    renderer.render(scene, camera);
    const settling = Math.abs(targetYaw - yaw) > 1e-4 || !paint.color.equals(target);
    if (visible && !document.hidden && (settling || !opts.reduceMotion)) raf = requestAnimationFrame(frame);
  }
  function wake() {
    if (!raf) {
      clock.getDelta();
      raf = requestAnimationFrame(frame);
    }
  }
  const onVis = () => !document.hidden && wake();
  document.addEventListener("visibilitychange", onVis);

  resize();
  // первый кадр рисуем сразу, не дожидаясь requestAnimationFrame
  renderer.render(scene, camera);

  return {
    setPaint,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      [paint, rubber, backingMat].forEach((m) => m.dispose());
      flakes.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
