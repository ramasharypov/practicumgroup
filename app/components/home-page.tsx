import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { PracticumGroupLogo, PracticumLogo } from './practicum-logos';
import { AccentStar } from './accent-star';
import type { PanelId } from './triad-panel';
import groupPaths from '../../imports/svg-jbkew87gw3';

/* ──────────────── CONSTANTS ──────────────── */

const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

const TILE_H = 64;
const TILE_H_EXPANDED = 220;

const SECTIONS: {
  id: PanelId;
  color: string;
  label: string;
  subtitle: string;
  description: string;
}[] = [
  {
    id: 'help',
    color: '#069B93',
    label: 'HELP',
    subtitle: 'Терапия',
    description: 'Подбор психолога, дыхательные практики, истории людей. Пространство, где начинается путь к себе.',
  },
  {
    id: 'school',
    color: '#1192E6',
    label: 'SCHOOL',
    subtitle: 'Обучение',
    description: 'Курсы и программы для специалистов и тех, кто хочет понимать психологию глубже.',
  },
  {
    id: 'media',
    color: '#FF5E0E',
    label: 'MEDIA',
    subtitle: 'Просвещение',
    description: 'Статьи, исследования, разборы. Научная обоснованность без упрощения.',
  },
];

/* ──────────────── MODULE-LEVEL PRELOADER FLAG ──────────────── */
let _preloaderShown = false;

/* ──────────────── ANIMATED GROUP LOGO (SVG "TYPING") ──────────────── */

/*
 * Paths sorted left→right to match visual typing order.
 * Each path appears sequentially with a physical clip-path reveal.
 */
const GROUP_PATHS_ORDERED: {
  d: string;
  fill: 'currentColor' | string;
  clipRule?: 'evenodd';
  fillRule?: 'evenodd';
}[] = [
  /* p  */ { d: groupPaths.p1b7efe00, fill: 'currentColor' },
  /* r  */ { d: groupPaths.p3fc7a600, fill: 'currentColor' },
  /* A  */ { d: groupPaths.p2256cd00, fill: 'currentColor', clipRule: 'evenodd', fillRule: 'evenodd' },
  /* ★  */ { d: groupPaths.p5a62180, fill: '__star__', clipRule: 'evenodd', fillRule: 'evenodd' },
  /* A2 */ { d: groupPaths.pe03e000, fill: 'currentColor', clipRule: 'evenodd', fillRule: 'evenodd' },
  /* c  */ { d: groupPaths.p26983200, fill: 'currentColor' },
  /* t  */ { d: groupPaths.p8c6f080, fill: 'currentColor' },
  /* i  */ { d: groupPaths.p12952c00, fill: 'currentColor' },
  /* c  */ { d: groupPaths.p3b2f5000, fill: 'currentColor' },
  /* u  */ { d: groupPaths.p92d1d00, fill: 'currentColor' },
  /* m  */ { d: groupPaths.p427a7f0, fill: 'currentColor' },
  /* g  */ { d: groupPaths.p293e1a80, fill: 'currentColor' },
  /* r  */ { d: groupPaths.p3553e00, fill: 'currentColor' },
  /* o  */ { d: groupPaths.p2e24e5c0, fill: 'currentColor' },
  /* u  */ { d: groupPaths.p3b485e00, fill: 'currentColor' },
  /* p  */
];

const TOTAL_PATHS = GROUP_PATHS_ORDERED.length;
const PATH_DELAY_MS = 65;

function AnimatedGroupLogo({
  active,
  skip,
  onComplete,
}: {
  active: boolean;
  skip: boolean;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState(skip ? TOTAL_PATHS : 0);
  const completedRef = useRef(skip);

  useEffect(() => {
    if (!active || completedRef.current) return;
    if (revealed >= TOTAL_PATHS) {
      completedRef.current = true;
      onComplete();
      return;
    }
    const t = setTimeout(() => setRevealed((c) => c + 1), PATH_DELAY_MS);
    return () => clearTimeout(t);
  }, [active, revealed, onComplete]);

  return (
    <svg
      viewBox="0 0 282.876 58.2"
      fill="none"
      className="h-[48px] lg:h-[80px] w-auto block"
      style={{ color: CLR.text }}
    >
      {GROUP_PATHS_ORDERED.map((p, i) => {
        const visible = i < revealed;
        const fillColor = p.fill === '__star__' ? '#57B745' : p.fill;
        return (
          <g
            key={i}
            style={{
              clipPath: visible ? 'inset(0)' : 'inset(100% 0 0 0)',
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              transition: 'clip-path 0.18s ease-out, transform 0.18s ease-out',
            }}
          >
            <path
              d={p.d}
              fill={fillColor}
              clipRule={p.clipRule}
              fillRule={p.fillRule}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ──────────────── TEXT TYPING EFFECT ──────────────── */

const TYPING_LINES = [
  { text: 'Психологическая институция.', style: 'body' as const },
  { text: 'Три направления. Одна миссия.', style: 'body' as const },
  { text: '', style: 'gap' as const },
  { text: 'Мы помогаем. Учим. Просвещаем.', style: 'accent' as const },
  { text: '', style: 'gap' as const },
  { text: 'Москва, Пятницкая 25с1', style: 'muted' as const },
  { text: 'hello@practicum.group', style: 'muted' as const },
];

function useTypingEffect(lines: typeof TYPING_LINES, active: boolean, skip: boolean) {
  const [lineIdx, setLineIdx] = useState(skip ? lines.length : 0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (!active || done) return;
    if (lineIdx >= lines.length) {
      setDone(true);
      return;
    }
    const line = lines[lineIdx];
    if (line.style === 'gap' || charIdx >= line.text.length) {
      const delay = line.style === 'gap' ? 300 : 400;
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, delay);
      return () => clearTimeout(t);
    }
    const speed = 30;
    const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [active, lineIdx, charIdx, done, lines]);

  return { lineIdx, charIdx, done };
}

/* ──────────────── PROGRESS BAR ──────────────── */

function ProgressLine({ progress }: { progress: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-full"
      style={{ width: 200, height: 2, backgroundColor: CLR.border }}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          backgroundColor: CLR.base,
          width: `${progress}%`,
          transition: 'width 0.3s ease-out',
        }}
      />
    </div>
  );
}

/* ──────────────── EXPANDABLE SECTION TILE ──────────────── */

function ExpandableTile({
  section,
  isBottom,
  expanded,
  bridging,
  onHover,
  onLeave,
  onClick,
}: {
  section: typeof SECTIONS[0];
  isBottom: boolean;
  expanded: boolean;
  bridging: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const h = bridging ? '100vh' : expanded ? TILE_H_EXPANDED : TILE_H;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="relative overflow-hidden cursor-pointer w-full"
      style={{
        height: h,
        backgroundColor: expanded || bridging ? section.color : CLR.bg,
        transition: bridging
          ? 'height 0.45s cubic-bezier(0.25,0.1,0.25,1), background-color 0.15s ease'
          : 'height 0.35s cubic-bezier(0.25,0.1,0.25,1), background-color 0.2s ease',
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 right-0 z-10"
        style={{
          [isBottom ? 'top' : 'bottom']: 0,
          height: expanded || bridging ? 3 : 2,
          backgroundColor: expanded || bridging ? 'rgba(255,255,255,0.2)' : section.color,
          transition: 'height 0.2s ease, background-color 0.2s ease',
        }}
      />

      {/* Collapsed: label row */}
      <div
        className="flex items-center justify-center gap-3"
        style={{ height: TILE_H }}
      >
        <AccentStar
          color={expanded || bridging ? '#fff' : section.color}
          size={10}
        />
        <span
          className="text-[11px] tracking-[0.2em] select-none"
          style={{
            fontFamily: 'var(--font-content)',
            color: expanded || bridging ? '#fff' : CLR.text,
            transition: 'color 0.2s ease',
          }}
        >
          {section.label}
        </span>
        <span
          className="text-[10px] tracking-wide select-none"
          style={{
            fontFamily: 'var(--font-content)',
            color: expanded || bridging ? 'rgba(255,255,255,0.6)' : CLR.muted,
            transition: 'color 0.2s ease',
          }}
        >
          {section.subtitle}
        </span>
      </div>

      {/* Expanded: preview content */}
      <div
        className="px-10 lg:px-24 flex flex-col gap-6"
        style={{ paddingTop: 4, paddingBottom: 24 }}
      >
        <PracticumLogo
          id={section.id}
          height={24}
          starColor="#fff"
          style={{ color: '#fff' }}
        />
        <p
          className="text-[15px] max-w-xl"
          style={{
            fontFamily: 'var(--font-content)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
          }}
        >
          {section.description}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] tracking-wide"
            style={{
              fontFamily: 'var(--font-content)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Войти в раздел →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── HOME PAGE ──────────────────── */

export function HomePage() {
  const navigate = useNavigate();

  /* ── Preloader state ── */
  const skipPreloader = useRef(_preloaderShown);
  const [progress, setProgress] = useState(skipPreloader.current ? 100 : 0);
  const [phase, setPhase] = useState<'loading' | 'splitting' | 'ready'>(
    skipPreloader.current ? 'ready' : 'loading',
  );

  const [hoveredSection, setHoveredSection] = useState<PanelId | null>(null);
  const [bridgingSection, setBridgingSection] = useState<PanelId | null>(null);

  /* ── SVG logo animation → then text typing ── */
  const [svgDone, setSvgDone] = useState(skipPreloader.current);
  const handleSvgComplete = useCallback(() => {
    /* Small pause after SVG completes before text starts */
    setTimeout(() => setSvgDone(true), 350);
  }, []);

  const textTypingActive = phase === 'ready' && svgDone;
  const { lineIdx, charIdx, done: textDone } = useTypingEffect(
    TYPING_LINES,
    textTypingActive,
    skipPreloader.current,
  );

  /* ── Loading progress ── */
  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        const inc = p < 20 ? 3 : p < 60 ? 2 : p < 85 ? 1.5 : 3;
        return Math.min(p + inc, 100);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  /* ── Loading → splitting ── */
  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      const t = setTimeout(() => setPhase('splitting'), 500);
      return () => clearTimeout(t);
    }
  }, [progress, phase]);

  /* ── Splitting → ready ── */
  useEffect(() => {
    if (phase === 'splitting') {
      const t = setTimeout(() => {
        setPhase('ready');
        _preloaderShown = true;
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* ── Bridge animation: expand tile → navigate ── */
  const navigateToSection = useCallback(
    (id: PanelId) => {
      setBridgingSection(id);
      setHoveredSection(null);
      setTimeout(() => navigate(`/${id}`), 500);
    },
    [navigate],
  );

  const topSection = SECTIONS[0];
  const bottomSections = [SECTIONS[1], SECTIONS[2]];

  /* ══════════════════════ RENDER ══════════════════════ */

  /* Phase: LOADING */
  if (phase === 'loading') {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-10"
        style={{ backgroundColor: CLR.bg }}
      >
        <PracticumGroupLogo height={56} style={{ color: CLR.text }} />
        <ProgressLine progress={progress} />
      </div>
    );
  }

  /* Phase: SPLITTING */
  if (phase === 'splitting') {
    return (
      <div className="fixed inset-0" style={{ backgroundColor: CLR.bg }}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 0, scale: 1 }}
          animate={{ y: -80, scale: 0.6 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <PracticumGroupLogo height={56} style={{ color: CLR.text }} />
        </motion.div>

        <motion.div
          className="absolute left-0 right-0 flex items-center justify-center"
          style={{ height: TILE_H, borderBottom: `1px solid ${CLR.border}` }}
          initial={{ top: 'calc(50vh - 32px)' }}
          animate={{ top: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <AccentStar color={topSection.color} size={10} />
            <span className="text-[11px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>{topSection.label}</span>
            <span className="text-[10px] tracking-wide" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>{topSection.subtitle}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-0 right-0 flex"
          style={{ height: TILE_H, borderTop: `1px solid ${CLR.border}` }}
          initial={{ bottom: 'calc(50vh - 32px)' }}
          animate={{ bottom: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          {bottomSections.map((s, i) => (
            <div
              key={s.id}
              className="flex-1 flex items-center justify-center gap-3"
              style={{ borderLeft: i > 0 ? `1px solid ${CLR.border}` : undefined }}
            >
              <AccentStar color={s.color} size={10} />
              <span className="text-[11px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>{s.label}</span>
              <span className="text-[10px] tracking-wide" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>{s.subtitle}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  /* Phase: READY */
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: CLR.bg }}
    >
      {/* ═══ TOP BAR ═══ */}
      <div className="relative z-20 flex-shrink-0">
        <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ backgroundColor: CLR.border }} />
        <ExpandableTile
          section={topSection}
          isBottom={false}
          expanded={hoveredSection === topSection.id}
          bridging={bridgingSection === topSection.id}
          onHover={() => !bridgingSection && setHoveredSection(topSection.id)}
          onLeave={() => !bridgingSection && setHoveredSection(null)}
          onClick={() => navigateToSection(topSection.id)}
        />
      </div>

      {/* ═══ CONTENT AREA ═══ */}
      <div
        className="flex-1 min-h-0 flex flex-col justify-between px-10 py-16 lg:px-24 lg:py-20 relative z-10"
        style={{
          ...(bridgingSection ? { pointerEvents: 'none' as const } : {}),
        }}
      >
        {/* Top block: SVG logo + typed text */}
        <div>
          {/* Animated SVG heading */}
          <AnimatedGroupLogo
            active={phase === 'ready'}
            skip={skipPreloader.current}
            onComplete={handleSvgComplete}
          />

          {/* Gap after logo */}
          <div className="h-6 lg:h-8" />

          {/* Typed text lines */}
          {TYPING_LINES.map((line, i) => {
            if (i > lineIdx) return null;

            const displayText =
              i < lineIdx ? line.text : line.text.slice(0, charIdx);

            if (line.style === 'gap') {
              return <div key={i} className="h-6 lg:h-8" />;
            }

            const isCurrentLine = i === lineIdx && !textDone;
            const cursor = isCurrentLine ? (
              <span
                className="inline-block w-[2px] ml-[1px] animate-pulse"
                style={{
                  height: '0.9em',
                  backgroundColor: line.style === 'muted' ? CLR.muted : CLR.base,
                  verticalAlign: 'text-bottom',
                }}
              />
            ) : null;

            if (line.style === 'accent') {
              return (
                <p
                  key={i}
                  className="text-xl lg:text-2xl"
                  style={{
                    fontFamily: 'var(--font-content)',
                    color: CLR.base,
                    lineHeight: 1.5,
                  }}
                >
                  {displayText}
                  {cursor}
                </p>
              );
            }

            if (line.style === 'muted') {
              return (
                <p
                  key={i}
                  className="text-[15px] lg:text-[17px]"
                  style={{
                    fontFamily: 'var(--font-content)',
                    color: CLR.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {displayText}
                  {cursor}
                </p>
              );
            }

            /* body */
            return (
              <p
                key={i}
                className="text-xl lg:text-2xl"
                style={{
                  fontFamily: 'var(--font-content)',
                  color: CLR.text,
                  lineHeight: 1.5,
                }}
              >
                {displayText}
                {cursor}
              </p>
            );
          })}
        </div>

        {/* Bottom block: section stars */}
        <div className="flex items-center gap-4 pt-8">
          {SECTIONS.map((s) => (
            <AccentStar key={s.id} color={s.color} size={8} />
          ))}
        </div>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <div className="relative z-20 flex-shrink-0">
        <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ backgroundColor: CLR.border }} />
        <div className="flex">
          {bottomSections.map((s, i) => (
            <div key={s.id} className="flex-1 relative">
              {i > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-px z-10" style={{ backgroundColor: CLR.border }} />
              )}
              <ExpandableTile
                section={s}
                isBottom={true}
                expanded={hoveredSection === s.id}
                bridging={bridgingSection === s.id}
                onHover={() => !bridgingSection && setHoveredSection(s.id)}
                onLeave={() => !bridgingSection && setHoveredSection(null)}
                onClick={() => navigateToSection(s.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
