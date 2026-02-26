import {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BrowserRouter,
  useNavigate,
  useLocation,
  Routes,
  Route,
  useParams,
} from "react-router";
import { motion, useSpring, useTransform } from "motion/react";
import {
  TriadPanel,
  type PanelId,
} from "./components/triad-panel";
import { AccentStar } from "./components/accent-star";
import { ArticlePage } from "./components/media-content";
import {
  CoursePage,
  ProfilePage,
} from "./components/school-content";
import { HomePage } from "./components/home-page";

/* ──────────────────── CONSTANTS ──────────────────── */

const PANELS: PanelId[] = ["help", "school", "media"];
const IDX: Record<PanelId, number> = {
  help: 0,
  school: 1,
  media: 2,
};

const META: Record<
  PanelId,
  { color: string; label: string; subtitle: string }
> = {
  help: {
    color: "#069B93",
    label: "HELP",
    subtitle: "Терапия",
  },
  school: {
    color: "#1192E6",
    label: "SCHOOL",
    subtitle: "Обучение",
  },
  media: {
    color: "#FF5E0E",
    label: "MEDIA",
    subtitle: "Просвещение",
  },
};

const TILE_H = 64;
const SPR = { stiffness: 170, damping: 26, mass: 1 };

/* ──────────────── RING HELPERS ──────────────── */

/* Derived from approved palette */
const CLR = {
  bg: "#F9F9F9",
  text: "#1B1D20",
  base: "#012168",
  border: "rgba(1, 33, 104, 0.1)", // 10% base
  muted: "rgba(27, 29, 32, 0.45)", // 45% text
};

function isCW(fromIdx: number, toIdx: number): boolean {
  return (toIdx - fromIdx + 3) % 3 === 1;
}

/* ────────────── TILE COMPONENT ────────────── */

function BarTile({
  panelId,
  onClick,
  accentEdge,
  isActive = false,
  activeColor,
}: {
  panelId: PanelId;
  onClick: () => void;
  accentEdge: "top" | "bottom";
  isActive?: boolean;
  activeColor?: string;
}) {
  const m = META[panelId];
  /*
   * Top bar (accentEdge='bottom'):
   *   - Active tile: painted in its own color (m.color)
   *   - Inactive tiles: painted in activeColor during animation
   * Bottom bar (accentEdge='top'):
   *   - Never painted by default, only on hover
   */
  const painted =
    accentEdge === "bottom" ? isActive || !!activeColor : false;
  const bgColor = painted
    ? isActive
      ? m.color
      : activeColor || m.color
    : "#F9F9F9";

  // Accent bar color follows same logic
  const accentColor =
    accentEdge === "bottom"
      ? isActive
        ? m.color
        : activeColor || m.color
      : m.color;

  return (
    <button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center gap-3
                 cursor-pointer group"
      style={{ backgroundColor: bgColor }}
    >
      {/* hover overlay — full accent color (только для bottom bar) */}
      {accentEdge === "top" && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100
                     transition-opacity duration-200 pointer-events-none"
          style={{ backgroundColor: m.color }}
        />
      )}

      {/* accent bar */}
      <div
        className={`absolute left-0 right-0 z-[1]
                    ${accentEdge === "top" ? "top-0" : "bottom-0"}
                    ${accentEdge === "top" ? "h-[2px] group-hover:h-[3px]" : "h-[3px]"}`}
        style={{
          backgroundColor: accentColor,
        }}
      />

      {/* star — two layers: accent (default) + white (painted/hover) */}
      <div
        className={`relative z-[1] transition-transform duration-200
                       ${accentEdge === "top" ? "group-hover:scale-110" : ""}`}
      >
        {/* accent star — visible when NOT painted */}
        <AccentStar
          color={m.color}
          size={10}
          className={`transition-opacity duration-200 ${painted || (accentEdge === "top" && "group-hover:") ? "opacity-0" : ""} ${accentEdge === "top" ? "group-hover:opacity-0" : painted ? "opacity-0" : ""}`}
          style={{ opacity: painted ? 0 : 1 }}
        />
        {/* white star — visible when painted or hover */}
        <AccentStar
          color="#FFFFFF"
          size={10}
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: painted ? 1 : 0 }}
        />
        {accentEdge === "top" && (
          <AccentStar
            color="#FFFFFF"
            size={10}
            className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
          />
        )}
      </div>

      {/* label */}
      <span
        className="relative z-[1] text-[11px] tracking-[0.2em] select-none line-clamp-2"
        style={{ fontFamily: "var(--font-content)" }}
      >
        {/* default color */}
        <span
          className="transition-opacity duration-200"
          style={{
            color: "#1B1D20",
            opacity: painted ? 0 : 1,
          }}
        >
          {m.label}
        </span>
        {/* white — when painted */}
        <span
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            color: "#FFFFFF",
            opacity: painted ? 1 : 0,
          }}
        >
          {m.label}
        </span>
        {/* white — on hover (только для bottom bar) */}
        {accentEdge === "top" && (
          <span
            className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            style={{ color: "#FFFFFF" }}
          >
            {m.label}
          </span>
        )}
      </span>

      {/* subtitle (только для bottom bar) */}
      {accentEdge === "top" && (
        <span
          className="relative z-[1] text-[10px] tracking-wide select-none line-clamp-2"
          style={{ fontFamily: "var(--font-content)" }}
        >
          <span
            className="transition-opacity duration-200 group-hover:opacity-0"
            style={{ color: CLR.muted }}
          >
            {m.subtitle}
          </span>
          <span
            className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            style={{ color: "#FFFFFF" }}
          >
            {m.subtitle}
          </span>
        </span>
      )}
    </button>
  );
}

/* hex → r,g,b string */
function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/* Update meta theme-color for browser UI */
function useThemeColor(color: string) {
  useLayoutEffect(() => {
    // Standard theme-color
    let meta = document.querySelector(
      'meta[name="theme-color"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);

    // Apple-specific status bar style (для Safari iOS/macOS)
    let appleMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    );
    if (!appleMeta) {
      appleMeta = document.createElement("meta");
      appleMeta.setAttribute(
        "name",
        "apple-mobile-web-app-status-bar-style",
      );
      document.head.appendChild(appleMeta);
    }
    appleMeta.setAttribute("content", "black-translucent");

    // Viewport meta (если отсутствует)
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement("meta");
      viewport.setAttribute("name", "viewport");
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, viewport-fit=cover",
      );
      document.head.appendChild(viewport);
    }

    // Windows tile color
    let msTile = document.querySelector(
      'meta[name="msapplication-TileColor"]',
    );
    if (!msTile) {
      msTile = document.createElement("meta");
      msTile.setAttribute("name", "msapplication-TileColor");
      document.head.appendChild(msTile);
    }
    msTile.setAttribute("content", color);

    // CRITICAL: Set actual page background color to match theme-color
    // Safari requires this for proper theme-color rendering
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;

    // Also update scrollbar color via CSS variable
    document.documentElement.style.setProperty(
      "--scrollbar-color",
      color,
    );
  }, [color]);
}

/* ──────────────────── CORE COMPONENT ──────────────────── */

function TriadCore() {
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем active из URL
  const active: PanelId | null =
    location.pathname === "/help"
      ? "help"
      : location.pathname === "/school"
        ? "school"
        : location.pathname === "/media"
          ? "media"
          : null;

  // Сохранение позиции скролла для каждой панели
  const scrollPositions = useRef<
    Record<PanelId | "neutral", number>
  >({
    neutral: 0,
    help: 0,
    school: 0,
    media: 0,
  });

  const close = useCallback(() => {
    // Сохраняем текущую позицию скролла перед закрытием
    if (active) {
      scrollPositions.current[active] = window.scrollY;
    }
    navigate("/");
  }, [active, navigate]);

  // Update browser UI color based on active section
  const themeColor = active ? META[active].color : CLR.bg;
  useThemeColor(themeColor);

  const dirRef = useRef<"cw" | "ccw">("cw");

  const open = useCallback(
    (id: PanelId) => {
      // Сохраняем текущую позицию скролла перед переключением
      const currentKey = active || "neutral";
      scrollPositions.current[currentKey] = window.scrollY;

      if (active && active !== id) {
        dirRef.current = isCW(IDX[active], IDX[id])
          ? "cw"
          : "ccw";
      }

      navigate(`/${id}`);
    },
    [active, navigate],
  );

  // Восстанавливаем позицию скролла при смене активной панели
  const isFirstMount = useRef(true);
  useEffect(() => {
    // Skip scroll restoration on first mount — let child components
    // (e.g. MediaContent) handle their own scroll restoration from sessionStorage
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const targetKey = active || "neutral";
    const targetPosition = scrollPositions.current[targetKey];

    // Небольшая задержка для завершения анимации spring
    const timer = setTimeout(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: "instant",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [active]);

  /* ── viewport width ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setVw(e.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prevActiveRef = useRef<PanelId | null>(null);

  /* ═══════════════════════════════════════════════════════
   * MAIN PANELS — x + width springs.
   * ═══════════════════════════════════════════════════════ */
  const third = vw / 3;

  const x0 = useSpring(0, SPR);
  const x1 = useSpring(third, SPR);
  const x2 = useSpring(2 * third, SPR);
  const xs = [x0, x1, x2];

  const w0 = useSpring(third, SPR);
  const w1 = useSpring(third, SPR);
  const w2 = useSpring(third, SPR);
  const ws = [w0, w1, w2];

  // Opacity transforms для визуального слоя анимации
  const op0 = useTransform(w0, [0, vw / 3], [0, 1]);
  const op1 = useTransform(w1, [0, vw / 3], [0, 1]);
  const op2 = useTransform(w2, [0, vw / 3], [0, 1]);
  const ops = [op0, op1, op2];

  /* ═══════════════════════════════════════════════════════
   * TOP BAR — ring conveyor (3 full-width tiles).
   * Active tile at x=0, others offscreen ±vw.
   * Breadcrumbs fade via opacity crossfade.
   * ═══════════════════════════════════════════════════════ */
  const tt0 = useSpring(0, SPR);
  const tt1 = useSpring(0, SPR);
  const tt2 = useSpring(0, SPR);
  const tts = [tt0, tt1, tt2];

  const topTileOp = useSpring(0, SPR); // 0=breadcrumbs, 1=tile
  const bcOp = useTransform(topTileOp, [0, 1], [1, 0]);

  /* ═══════════════════════════════════════════════════════
   * BOTTOM BAR — ring conveyor (3 half-width tiles).
   * Two visible slots, one offscreen.
   * ═══════════════════════════════════════════════════════ */
  const bt0 = useSpring(0, SPR);
  const bt1 = useSpring(0, SPR);
  const bt2 = useSpring(0, SPR);
  const bts = [bt0, bt1, bt2];

  const bottomH = useSpring(0, SPR);

  /* ═══════════════════════════════════════════════════════
   * GEOMETRY ENGINE — single useLayoutEffect drives all springs.
   * ═══════════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    const t = vw / 3;
    const half = vw / 2;
    const prev = prevActiveRef.current;
    const prevIdx = prev !== null ? IDX[prev] : -1;
    const actIdx = active !== null ? IDX[active] : -1;
    const isSwitch =
      prev !== null && active !== null && prev !== active;

    if (isSwitch) {
      dirRef.current = isCW(prevIdx, actIdx) ? "cw" : "ccw";
    }
    const clockwise = dirRef.current === "cw";

    /* ──── MAIN PANELS ──── */

    if (active === null) {
      if (prev !== null) {
        for (let i = 0; i < 3; i++) {
          if (i !== prevIdx) xs[i].jump(i * t);
          xs[i].set(i * t);
          ws[i].set(t);
        }
      } else {
        for (let i = 0; i < 3; i++) {
          xs[i].set(i * t);
          ws[i].set(t);
        }
      }
    } else if (!isSwitch) {
      for (let i = 0; i < 3; i++) {
        if (i === actIdx) {
          xs[i].set(0);
          ws[i].set(vw);
        } else {
          ws[i].set(0);
          xs[i].set(i < actIdx ? -vw : vw);
        }
      }
    } else {
      /*
       * ACTIVE → ACTIVE ring switch.
       * Top/main INVERTED vs bottom to close the ring:
       *   CW:  bottom exits LEFT  → top/main enters from LEFT (wraps left edge)
       *   CCW: bottom exits RIGHT → top/main enters from RIGHT (wraps right edge)
       */
      for (let i = 0; i < 3; i++) {
        if (i === actIdx) {
          xs[i].jump(clockwise ? -vw : vw);
          ws[i].jump(0);
          xs[i].set(0);
          ws[i].set(vw);
        } else if (i === prevIdx) {
          xs[i].set(clockwise ? vw : -vw);
          ws[i].set(0);
        } else {
          xs[i].jump(clockwise ? vw : -vw);
          ws[i].jump(0);
        }
      }
    }

    /* ──── TOP TILE POSITIONS ──── */

    if (active !== null) {
      topTileOp.set(1);

      for (let i = 0; i < 3; i++) {
        const target =
          i === actIdx
            ? 0
            : (i - actIdx + 3) % 3 === 1
              ? vw
              : -vw;

        if (isSwitch) {
          if (i === actIdx) {
            tts[i].jump(clockwise ? -vw : vw);
            tts[i].set(0);
          } else if (i === prevIdx) {
            tts[i].set(clockwise ? vw : -vw);
          } else {
            tts[i].jump(target);
          }
        } else {
          tts[i].jump(target);
        }
      }
    } else {
      topTileOp.set(0);
    }

    /* ──── BOTTOM TILE POSITIONS ──── */
    /*
     * Bottom bar keeps its own direction — ring closes:
     * CW:  exits LEFT,  enters from RIGHT  (→ top enters from LEFT)
     * CCW: exits RIGHT, enters from LEFT   (→ top enters from RIGHT)
     */

    if (active !== null) {
      for (let i = 0; i < 3; i++) {
        const offset = (i - actIdx + 3) % 3;
        const target =
          offset === 0
            ? clockwise
              ? -half
              : vw // CW: park left, CCW: park right
            : offset === 1
              ? 0
              : half;

        if (isSwitch) {
          if (i === prevIdx) {
            bts[i].jump(clockwise ? vw : -half); // CW: enter from right, CCW: enter from left
            bts[i].set(target);
          } else {
            bts[i].set(target);
          }
        } else {
          bts[i].jump(target);
        }
      }
    }

    prevActiveRef.current = active;
    bottomH.set(active ? TILE_H : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, vw]);

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: themeColor,
        fontFamily: "var(--font-content)",
      }}
    >
      {/* ═══════ TOP BAR — фиксированная навигация ═══════ */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-16 overflow-hidden"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingRight:
            "calc(env(safe-area-inset-right, 0px) + 0px)",
          backgroundColor: themeColor,
        }}
      >
        {/* Breadcrumbs layer */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-3"
          style={{
            opacity: bcOp,
            pointerEvents: active === null ? "auto" : "none",
            top: "env(safe-area-inset-top)",
          }}
        >
          {PANELS.map((p) => (
            <AccentStar
              key={p}
              color={META[p].color}
              size={7}
              style={{ opacity: 0.7 }}
            />
          ))}
        </motion.div>

        {/* Tile conveyor layer */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: topTileOp,
            top: "env(safe-area-inset-top)",
          }}
        >
          {PANELS.map((p, i) => (
            <motion.div
              key={p}
              className="absolute top-0 h-full"
              style={{
                x: tts[i],
                width: vw,
                pointerEvents: active === p ? "auto" : "none",
              }}
            >
              <BarTile
                panelId={p}
                onClick={close}
                accentEdge="bottom"
                isActive={active === p}
                activeColor={themeColor}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══════ BOTTOM BAR — фиксированная навигация ═══════ */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
        style={{
          height: bottomH,
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingRight:
            "calc(env(safe-area-inset-right, 0px) + 0px)",
          backgroundColor: themeColor,
        }}
      >
        {/* top seam */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{ backgroundColor: CLR.border }}
        />

        <div className="h-full relative overflow-hidden">
          {PANELS.map((p, i) => (
            <motion.div
              key={p}
              className="absolute top-0 h-full"
              style={{
                x: bts[i],
                width: vw / 2,
                pointerEvents: active === p ? "none" : "auto",
              }}
            >
              <BarTile
                panelId={p}
                onClick={() => open(p)}
                accentEdge="top"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════ MAIN CONTENT — глобальный скролл документа ═══════ */}
      <div
        ref={containerRef}
        style={{
          paddingTop: "max(64px, env(safe-area-inset-top))",
          paddingBottom: active
            ? "max(64px, env(safe-area-inset-bottom))"
            : "env(safe-area-inset-bottom)",
        }}
      >
        {PANELS.map((p, i) => (
          <div
            key={p}
            style={{
              display:
                active === p || active === null
                  ? "block"
                  : "none",
            }}
          >
            <TriadPanel
              id={p}
              isActive={active === p}
              isNeutral={active === null}
              onClick={() => (active === p ? close() : open(p))}
              index={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────── APP WITH ROUTING ──────────────────── */

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/help" element={<TriadCore />} />
      <Route path="/school" element={<TriadCore />} />
      <Route path="/media" element={<TriadCore />} />

      {/* Nested routes */}
      <Route
        path="/media/:articleId"
        element={
          <div
            style={{
              backgroundColor: "#F9F9F9",
              minHeight: "100vh",
            }}
          >
            {/* Top bar with back button */}
            <div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 lg:px-24"
              style={{
                height: "64px",
                backgroundColor: "#FF5E0E",
                borderBottom: "2px solid rgba(1, 33, 104, 0.1)",
              }}
            >
              <button
                onClick={() => navigate("/media")}
                className="flex items-center gap-2 text-white text-[15px] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-content)" }}
              >
                <span>←</span> Назад к статьям
              </button>
            </div>
            <div style={{ paddingTop: "64px" }}>
              <ArticlePage
                articleId={params.articleId!}
                onBack={() => navigate("/media")}
                onNavigateToSchool={() => navigate("/school")}
              />
            </div>
          </div>
        }
      />
      <Route
        path="/school/:courseId"
        element={
          <div
            style={{
              backgroundColor: "#F9F9F9",
              minHeight: "100vh",
            }}
          >
            {/* Top bar with back button */}
            <div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 lg:px-24"
              style={{
                height: "64px",
                backgroundColor: "#1192E6",
                borderBottom: "2px solid rgba(1, 33, 104, 0.1)",
              }}
            >
              <button
                onClick={() => navigate("/school")}
                className="flex items-center gap-2 text-white text-[15px] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-content)" }}
              >
                <span>←</span> Назад к курсам
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => navigate("/school/profile")}
                  className="px-5 py-2 rounded-full text-[14px] bg-white text-[#1192E6] hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "var(--font-content)" }}
                >
                  Профиль
                </button>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="px-5 py-2 rounded-full text-[14px] bg-white text-[#1192E6] hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "var(--font-content)" }}
                >
                  Войти
                </button>
              )}
            </div>
            <div style={{ paddingTop: "64px" }}>
              <CoursePage
                courseId={params.courseId!}
                onBack={() => navigate("/school")}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        }
      />
      <Route
        path="/school/profile"
        element={
          <div
            style={{
              backgroundColor: "#F9F9F9",
              minHeight: "100vh",
            }}
          >
            {/* Top bar with back button */}
            <div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 lg:px-24"
              style={{
                height: "64px",
                backgroundColor: "#1192E6",
                borderBottom: "2px solid rgba(1, 33, 104, 0.1)",
              }}
            >
              <button
                onClick={() => navigate("/school")}
                className="flex items-center gap-2 text-white text-[15px] hover:opacity-70 transition-opacity"
                style={{ fontFamily: "var(--font-content)" }}
              >
                <span>←</span> Назад к курсам
              </button>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  navigate("/school");
                }}
                className="px-5 py-2 rounded-full text-[14px] bg-white text-[#1192E6] hover:opacity-90 transition-opacity"
                style={{ fontFamily: "var(--font-content)" }}
              >
                Выйти
              </button>
            </div>
            <div style={{ paddingTop: "64px" }}>
              <ProfilePage
                onBack={() => navigate("/school")}
                onLogout={() => {
                  setIsLoggedIn(false);
                  navigate("/school");
                }}
              />
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}