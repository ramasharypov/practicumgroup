import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { AccentStar } from './accent-star';
import { PracticumLogo } from './practicum-logos';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ff48df62`;

const COLOR = '#069B93';

/* ── Derived from approved palette ── */
const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

/* ═══════════════════════════════════════════════════════
 * HELP SECTION — viewport-portioned sections
 *
 *   0  Hero           — logo + heading tight, lead text, CTA
 *   1  Истории        — cards fill the width
 *   2  Специалисты    — tinder stack centered
 *   3  Принципы       — numbered list full-width
 *   4  Импакт         — stats grid spread
 *   5  Анти-стресс    — breathing circle centered
 * ═══════════════════════════════════════════════════════ */

export const HELP_PAGES = [
  'Миссия',
  'Истории',
  'Специалисты',
  'Принципы',
  'Импакт',
  'Анти-стресс',
] as const;

export type HelpPage = (typeof HELP_PAGES)[number];

interface HelpContentProps {
  color: string;
  colorRgb: string;
  onPageChange?: (index: number) => void;
}

export function HelpContent({ color, colorRgb, onPageChange }: HelpContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    sectionRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.35) {
            const idx = sectionRefs.current.indexOf(e.target as HTMLDivElement);
            if (idx !== -1) onPageChange?.(idx);
          }
        }
      },
      { root, threshold: 0.35 },
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [onPageChange]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scroll-smooth">
      <div ref={(el) => setRef(el, 0)}><HeroSection /></div>
      <div ref={(el) => setRef(el, 1)}><StoriesSection /></div>
      <div ref={(el) => setRef(el, 2)}><SpecialistSection /></div>
      <div ref={(el) => setRef(el, 3)}><PrinciplesSection /></div>
      <div ref={(el) => setRef(el, 4)}><ImpactSection /></div>
      <div ref={(el) => setRef(el, 5)}><AntiStressSection /></div>
    </div>
  );
}

/* ─────────────── SHARED ─────────────── */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
 * 0. HERO
 *
 * First viewport: logo + heading as tight unit,
 * lead text below, CTA at the bottom.
 * ═══════════════════════════════════════ */
function HeroSection() {
  return (
    <div className="h-[calc(100vh-129px)] flex flex-col justify-between px-10 py-16 lg:px-24 lg:py-20">
      <PracticumLogo
        id="help"
        height={160}
        style={{ color: '#1B1D20' }}
      />
      <div>
        <h2
          className="text-4xl lg:text-6xl tracking-tight max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          Возвращение<br />
          <span style={{ color: COLOR }}>качества</span> жизни
        </h2>
        <p className="mt-8 text-lg lg:text-2xl leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}>
          Не просто снижение симптомов — восстановление функциональности,
          устойчивости и способности жить полноценно.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
 * 1. STORIES
 *
 * Heading left-flagged. Stories fill the full
 * width as horizontal cards that breathe.
 * ═══════════════════════════════════════ */

const STORIES = [
  {
    name: 'Данила',
    age: 31,
    tag: 'Тревожное расстройство',
    quote: 'Перестал просыпаться с ощущением катастрофы. Просто однажды заметил — тишина внутри.',
    duration: '1:42',
    audioKey: 'anna.ogg',
  },
  {
    name: 'рама',
    age: 30,
    tag: 'Синдром главного героя',
    quote: 'Понял, что можно жить без сценария. Не играть роль — а просто быть.',
    duration: '2:18',
    audioKey: 'mikhail.ogg',
  },
];

function parseDuration(d: string): number {
  const [m, s] = d.split(':').map(Number);
  return m * 60 + s;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const MEDIA_COLOR = '#FF5E0E';

/* ── Oscillograph — canvas, variable thickness, overflow visible ── */
function Oscillograph({ color, active }: { color: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  const rafRef = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;
  const tRef = useRef(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = cvs.getBoundingClientRect();
      cvs.width = rect.width * dpr;
      cvs.height = rect.height * dpr;
    };
    resize();

    /* Fixed visual amplitude zone — independent of canvas height */
    const VIS = 36;

    const draw = () => {
      const w = cvs.width / dpr;
      const h = cvs.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = tRef.current;
      const mid = h / 2;
      const col = colorRef.current;

      let prevX = 0;
      let prevY = mid;
      for (let x = 0; x <= w; x++) {
        const nx = x / w;
        const y =
          mid +
          Math.sin(nx * 16 + t * 2.4) * (VIS * 0.55) +
          Math.sin(nx * 33 + t * 4.1) * (VIS * 0.3) +
          Math.sin(nx * 61 + t * 6.7) * (VIS * 0.15) +
          (Math.sin(nx * 113 + t * 9.5) * Math.cos(t * 1.4 + nx * 7)) * (VIS * 0.12);

        const displacement = Math.abs(y - mid) / (VIS * 0.6);
        const lw = 0.8 + displacement * 2.8;

        ctx.beginPath();
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();

        prevX = x;
        prevY = y;
      }

      if (activeRef.current) tRef.current += 0.03;
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 80, margin: '-22px 0' }}
    />
  );
}

/* ── Player state per track ── */
interface TrackState {
  index: number;
  progress: number;   // 0..1
  active: boolean;     // currently ticking
  realDuration: number; // from audio metadata or fallback
  loading: boolean;
}

/* ── Signed URL cache (module-level) ── */
const _urlCache = new Map<string, string>();

async function fetchAudioUrl(audioKey: string): Promise<string | null> {
  if (_urlCache.has(audioKey)) return _urlCache.get(audioKey)!;
  try {
    const res = await fetch(`${API_BASE}/audio/${encodeURIComponent(audioKey)}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    });
    if (!res.ok) { console.log(`[audio] URL fetch failed for "${audioKey}": ${res.status}`); return null; }
    const { url } = await res.json();
    if (url) _urlCache.set(audioKey, url);
    return url ?? null;
  } catch (e) { console.log(`[audio] Fetch error for "${audioKey}": ${e}`); return null; }
}

function StoriesSection() {
  const [track, setTrack] = useState<TrackState | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const simStartRef = useRef(0);

  /* Sync progress from real audio or simulated timer */
  useEffect(() => {
    const tick = () => {
      setTrack(prev => {
        if (!prev || !prev.active) return prev;
        const audio = audioRef.current;
        if (audio && audio.duration && isFinite(audio.duration)) {
          const p = audio.currentTime / audio.duration;
          if (audio.ended) return { ...prev, progress: 1, active: false, realDuration: audio.duration };
          return { ...prev, progress: p, realDuration: audio.duration };
        }
        /* Simulated fallback */
        if (simStartRef.current > 0) {
          const elapsed = (performance.now() - simStartRef.current) / 1000;
          const p = Math.min(elapsed / prev.realDuration, 1);
          if (p >= 1) { simStartRef.current = 0; return { ...prev, progress: 1, active: false }; }
          return { ...prev, progress: p };
        }
        return prev;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Cleanup */
  useEffect(() => () => { audioRef.current?.pause(); audioRef.current = null; }, []);

  const handleClick = async (i: number) => {
    const story = STORIES[i];
    const fallbackDur = parseDuration(story.duration);

    if (track && track.index === i) {
      const audio = audioRef.current;
      if (track.progress >= 1) {
        /* Restart */
        if (audio) { audio.currentTime = 0; audio.play(); }
        else { simStartRef.current = performance.now(); }
        setTrack(prev => prev ? { ...prev, progress: 0, active: true } : prev);
        return;
      }
      /* Toggle */
      if (track.active) {
        audio?.pause();
        simStartRef.current = 0;
        setTrack(prev => prev ? { ...prev, active: false } : prev);
      } else {
        audio?.play();
        if (!audio) simStartRef.current = performance.now() - track.progress * track.realDuration * 1000;
        setTrack(prev => prev ? { ...prev, active: true } : prev);
      }
      return;
    }

    /* Different track — start immediately with simulated playback */
    audioRef.current?.pause();
    audioRef.current = null;

    simStartRef.current = performance.now();
    setTrack({ index: i, progress: 0, active: true, realDuration: fallbackDur, loading: true });

    /* Fetch real audio in background and switch seamlessly */
    fetchAudioUrl(story.audioKey).then(url => {
      if (!url) {
        console.log(`[audio] No URL for "${story.audioKey}", continuing simulated`);
        setTrack(prev => prev && prev.index === i ? { ...prev, loading: false } : prev);
        return;
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.addEventListener('loadedmetadata', () => {
        setTrack(prev => prev && prev.index === i ? { ...prev, realDuration: audio.duration } : prev);
      });
      audio.addEventListener('ended', () => {
        setTrack(prev => prev ? { ...prev, progress: 1, active: false } : prev);
      });
      audio.play().then(() => {
        simStartRef.current = 0;
        setTrack(prev => prev && prev.index === i ? { ...prev, loading: false } : prev);
      }).catch(e => {
        console.log(`[audio] Play error: ${e}`);
        setTrack(prev => prev ? { ...prev, loading: false } : prev);
      });
    });
  };

  const handleSeek = (i: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (track && track.index === i) {
      const audio = audioRef.current;
      if (audio && audio.duration && isFinite(audio.duration)) {
        audio.currentTime = pct * audio.duration;
        if (!track.active) { audio.play(); setTrack(prev => prev ? { ...prev, active: true, progress: pct } : prev); }
        else { setTrack(prev => prev ? { ...prev, progress: pct } : prev); }
      } else {
        simStartRef.current = performance.now() - pct * track.realDuration * 1000;
        setTrack(prev => prev ? { ...prev, progress: pct, active: true } : prev);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-10 py-16 lg:px-24 lg:py-20">
      <Reveal>
        <h1
          className="text-5xl lg:text-8xl tracking-tight max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          Голоса тех,
          <br />
          кому <span style={{ color: COLOR }}>стало лучше</span>
        </h1>
      </Reveal>

      <div className="flex-1 flex flex-col justify-center mt-12">
        <div className="w-full flex flex-col">
          {STORIES.map((s, i) => {
            const isTrack = track !== null && track.index === i;
            const isActive = isTrack && track!.active;
            const isPaused = isTrack && !track!.active && track!.progress < 1;
            const isDone = isTrack && track!.progress >= 1;
            const showPlayer = isTrack;
            const progress = isTrack ? track!.progress : 0;
            const inv = hovered === i;
            const durationSec = isTrack ? track!.realDuration : parseDuration(s.duration);
            const elapsed = progress * durationSec;

            const bgRow     = inv ? COLOR : 'transparent';
            const colName   = inv ? '#fff' : '#1B1D20';
            const colQuote  = inv ? 'rgba(255,255,255,0.8)' : '#1B1D20';
            const colDur    = inv ? 'rgba(255,255,255,0.6)' : CLR.muted;
            const colTagBg  = inv ? '#fff' : COLOR;
            const colTagTxt = inv ? COLOR : '#fff';
            const colAvBg   = inv ? '#fff' : COLOR;
            const colAvIcon = inv ? COLOR : '#fff';
            const colTrack  = inv ? 'rgba(255,255,255,0.25)' : CLR.border;
            const colFill   = inv ? '#fff' : COLOR;
            const colWave   = inv ? 'rgba(255,255,255,0.85)' : MEDIA_COLOR;
            const colPulse  = inv ? 'rgba(255,255,255,0.5)' : COLOR;
            const colBarEq  = inv ? COLOR : '#fff';

            return (
              <Reveal key={s.name} delay={i * 0.08}>
                <button
                  onClick={() => handleClick(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full text-left"
                >
                  <div
                    className="grid items-center px-6 py-6 rounded-xl border-b transition-colors duration-200"
                    style={{
                      gridTemplateColumns: '48px 1fr auto',
                      gap: '20px',
                      borderColor: inv ? 'transparent' : CLR.border,
                      backgroundColor: bgRow,
                    }}
                  >
                    {/* Col 1: Avatar / Play-Pause */}
                    <div className="justify-self-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center relative transition-colors duration-200"
                        style={{ backgroundColor: colAvBg }}
                      >
                        {isActive && (
                          <>
                            <span
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                borderWidth: 2,
                                borderStyle: 'solid',
                                borderColor: colPulse,
                                animation: 'help-pulse 2s ease-out infinite',
                              }}
                            />
                            <span
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                borderWidth: 2,
                                borderStyle: 'solid',
                                borderColor: colPulse,
                                animation: 'help-pulse 2s ease-out infinite 0.6s',
                              }}
                            />
                          </>
                        )}

                        {isActive ? (
                          /* Pause icon */
                          <div className="flex items-center gap-[4px]">
                            <div className="w-[3px] h-[14px] rounded-full transition-colors duration-200" style={{ backgroundColor: colBarEq }} />
                            <div className="w-[3px] h-[14px] rounded-full transition-colors duration-200" style={{ backgroundColor: colBarEq }} />
                          </div>
                        ) : (
                          /* Play icon */
                          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                            <path d="M1 1.5L13 8L1 14.5V1.5Z" fill={colAvIcon} />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Col 2: Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-base transition-colors duration-200"
                          style={{ fontFamily: 'var(--font-content)', color: colName }}
                        >
                          {s.name}, {s.age}
                        </span>
                        <span
                          className="text-[12px] tracking-wide px-3 py-0.5 rounded-full transition-colors duration-200"
                          style={{
                            fontFamily: 'var(--font-content)',
                            color: colTagTxt,
                            backgroundColor: colTagBg,
                          }}
                        >
                          {s.tag}
                        </span>
                      </div>

                      {showPlayer ? (
                        <div className="mt-2 space-y-2" style={{ overflow: 'visible' }}>
                          <Oscillograph color={colWave} active={isActive} />
                          {/* Seekable progress bar */}
                          <div className="flex items-center gap-3">
                            <div
                              className="h-[4px] flex-1 rounded-full overflow-hidden cursor-pointer transition-colors duration-200"
                              style={{ backgroundColor: colTrack }}
                              onClick={(e) => handleSeek(i, e)}
                            >
                              <div
                                className="h-full rounded-full transition-colors duration-200"
                                style={{
                                  backgroundColor: colFill,
                                  width: `${progress * 100}%`,
                                }}
                              />
                            </div>
                            <span
                              className="text-[11px] tabular-nums flex-shrink-0 transition-colors duration-200"
                              style={{ fontFamily: 'var(--font-content)', color: colDur }}
                            >
                              {formatTime(elapsed)} / {s.duration}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="text-base leading-relaxed transition-colors duration-200"
                          style={{ fontFamily: 'var(--font-content)', color: colQuote }}
                        >
                          «{s.quote}»
                        </p>
                      )}
                    </div>

                    {/* Col 3: Duration */}
                    <span
                      className="text-[13px] tabular-nums transition-colors duration-200 self-center"
                      style={{ fontFamily: 'var(--font-content)', color: colDur }}
                    >
                      {s.duration}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
 * 2. SPECIALIST MATCHING — ANAMNESIS SWIPE
 *
 * Swipe through diagnostic questions.
 * Right = "Да" (SCHOOL blue), Left = "Нет" (MEDIA orange).
 * After all questions → matched therapists.
 * ═══════════════════════════════════════ */

const SCHOOL_BLUE = '#1192E6';
const MEDIA_ORANGE = '#FF5E0E';

interface AnamnesisQ {
  id: string;
  question: string;
  detail: string;
  tags: string[];
}

const ANAMNESIS: AnamnesisQ[] = [
  {
    id: 'anxiety',
    question: 'Вас беспокоит тревога или беспокойство?',
    detail: 'Навязчивые мысли, трудности с расслаблением, ощущение надвигающейся угрозы.',
    tags: ['Тревога', 'Фобии', 'ОКР', 'Паника'],
  },
  {
    id: 'mood',
    question: 'Замечаете снижение настроения или потерю интереса?',
    detail: 'Подавленность, апатия, нежелание заниматься тем, что раньше радовало.',
    tags: ['Смысл', 'Кризис', 'Выгорание'],
  },
  {
    id: 'trauma',
    question: 'Есть ли травматический опыт, который до сих пор влияет?',
    detail: 'Навязчивые воспоминания, ночные кошмары, избегание определённых ситуаций.',
    tags: ['ПТСР', 'Горе', 'Насилие', 'Травма'],
  },
  {
    id: 'relations',
    question: 'Есть трудности в отношениях с близкими?',
    detail: 'Конфликты, непонимание, ощущение одиночества рядом с партнёром или семьёй.',
    tags: ['Пары', 'Семья', 'Отношения', 'Развод'],
  },
  {
    id: 'identity',
    question: 'Чувствуете потерю смысла или непонимание себя?',
    detail: 'Вопросы идентичности, ощущение «не своей жизни», экзистенциальный тупик.',
    tags: ['Смысл', 'Идентичность', 'Самооценка', 'Личность'],
  },
  {
    id: 'burnout',
    question: 'Ощущаете профессиональное выгорание?',
    detail: 'Хроническая усталость от работы, цинизм, снижение продуктивности.',
    tags: ['Выгорание', 'Кризис'],
  },
];

const SPECIALISTS = [
  {
    name: 'Ольга Сергеева',
    approach: 'Когнитивно-поведенческая терапия',
    experience: '12 лет',
    tags: ['Тревога', 'Фобии', 'ОКР', 'Паника'],
    bio: 'Работаю с тревожными расстройствами и навязчивостями. Структура, конкретные техники, измеримый результат.',
    photo: 'https://images.unsplash.com/flagged/photo-1573582677725-863b570e3c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTMyODExN3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    name: 'Андрей Волков',
    approach: 'Схема-терапия',
    experience: '8 лет',
    tags: ['Травма', 'Самооценка', 'Отношения', 'Личность'],
    bio: 'Специализируюсь на сложных случаях — когда проблема не в ситуации, а в глубинных паттернах.',
    photo: 'https://images.unsplash.com/photo-1634136933697-b1adb1545135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHdoaXRlJTIwYmFja2dyb3VuZCUyMGNhc3VhbHxlbnwxfHx8fDE3NzEzMjgxMTh8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    name: 'Мария Ким',
    approach: 'EMDR, травма-фокусированная терапия',
    experience: '10 лет',
    tags: ['ПТСР', 'Горе', 'Насилие', 'Катастрофы'],
    bio: 'Работаю с тем, о чём трудно говорить. Бережно, но эффективно. Без затягивания процесса.',
    photo: 'https://images.unsplash.com/photo-1761635491462-04d0b72fb0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBsaWdodCUyMGJhY2tncm91bmQlMjBzbWlsZXxlbnwxfHx8fDE3NzEzMjgxMTh8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    name: 'Дмитрий Лось',
    approach: 'Экзистенциальный анализ',
    experience: '15 лет',
    tags: ['Смысл', 'Кризис', 'Выгорание', 'Идентичность'],
    bio: 'Помогаю вернуть контакт с собственной жизнью. Когда всё вроде нормально — но не живётся.',
    photo: 'https://images.unsplash.com/photo-1757620765404-a1ee66df5e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBhZ2VkJTIwbWFuJTIwcG9ydHJhaXQlMjBsaWdodCUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcxMzI4MTE5fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    name: 'Елена Рощина',
    approach: 'Системная семейная терапия',
    experience: '11 лет',
    tags: ['Пары', 'Семья', 'Развод', 'Дети'],
    bio: 'Работаю с парами и семьями. Нейтральная позиция, без обвинений, фокус на систему.',
    photo: 'https://images.unsplash.com/photo-1658722449397-0f2e9db9d3a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBjbGVhbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzEzMjgxMTl8MA&ixlib=rb-4.1.0&q=80&w=400',
  },
];

/* Exit variant — uses AnimatePresence custom to read direction at exit time */
const swipeExitVariants = {
  exit: (dir: 'left' | 'right') => ({
    x: dir === 'right' ? 600 : -600,
    opacity: 0,
    transition: { duration: 0.35 },
  }),
};

function SwipeCard({
  question,
  onSwipe,
  isTop,
}: {
  question: AnamnesisQ;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const skipOpacity = useTransform(x, [-150, 0], [1, 0]);
  const yesOpacity = useTransform(x, [0, 150], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      variants={swipeExitVariants}
      exit="exit"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: isTop ? 10 : 5,
        cursor: isTop ? 'grab' : 'default',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe(info.offset.x > 0 ? 'right' : 'left');
        }
      }}
      initial={isTop ? { scale: 1 } : { scale: 0.95, y: 14 }}
      animate={isTop ? { scale: 1, y: 0 } : { scale: 0.95, y: 14 }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div
        className="h-full w-full rounded-2xl border-2 px-10 py-8 lg:px-14 lg:py-10 flex flex-col justify-between relative overflow-hidden"
        style={{
          borderColor: COLOR,
          backgroundColor: '#fff',
        }}
      >
        {/* Swipe indicators */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-6 right-8 text-[14px] tracking-[0.15em] uppercase px-5 py-2 rounded-full"
              style={{
                opacity: yesOpacity,
                color: '#fff',
                backgroundColor: SCHOOL_BLUE,
                fontFamily: 'var(--font-content)',
              }}
            >
              Да
            </motion.div>
            <motion.div
              className="absolute top-6 left-8 text-[14px] tracking-[0.15em] uppercase px-5 py-2 rounded-full"
              style={{
                opacity: skipOpacity,
                color: '#fff',
                backgroundColor: MEDIA_ORANGE,
                fontFamily: 'var(--font-content)',
              }}
            >
              Нет
            </motion.div>
          </>
        )}

        <div className="mt-6">
          <p
            className="text-[13px] tracking-[0.15em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-content)', color: COLOR }}
          >
            Вопрос {'\u00B7'} анамнез
          </p>
          <h3
            className="text-2xl lg:text-3xl mb-4"
            style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}
          >
            {question.question}
          </h3>
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
          >
            {question.detail}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] tracking-wide px-4 py-1.5 rounded-full"
              style={{
                fontFamily: 'var(--font-content)',
                color: '#fff',
                backgroundColor: COLOR,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* Hover-inversion button — React state, no post-click color shift */
function SwipeButton({
  onClick,
  color,
  children,
}: {
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl transition-colors duration-200"
      style={{
        borderColor: color,
        backgroundColor: hov ? color : 'transparent',
        color: hov ? '#fff' : color,
      }}
    >
      {children}
    </button>
  );
}

/* Silhouette avatar — simple head+shoulders vector */
function Silhouette({ gender }: { gender: 'f' | 'm' }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" className="w-full h-full">
      {gender === 'f' ? (
        <>
          <ellipse cx="50" cy="46" rx="22" ry="26" fill={COLOR} />
          <path d="M14 140 C14 100, 30 85, 50 82 C70 85, 86 100, 86 140" fill={COLOR} />
          <path d="M28 30 Q26 10, 50 8 Q74 10, 72 30 Q68 22, 50 20 Q32 22, 28 30Z" fill={COLOR} />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="48" rx="20" ry="24" fill={COLOR} />
          <path d="M10 140 C10 98, 28 84, 50 80 C72 84, 90 98, 90 140" fill={COLOR} />
          <rect x="30" y="28" width="40" height="8" rx="4" fill={COLOR} />
        </>
      )}
    </svg>
  );
}

/* Result row — divider borders, silhouette, button full card width */
function ResultRow({ sp, index }: { sp: typeof SPECIALISTS[0] & { score: number }; index: number }) {
  const [btnHov, setBtnHov] = useState(false);
  const gender = ['Ольга', 'Мария', 'Елена'].some(n => sp.name.startsWith(n)) ? 'f' as const : 'm' as const;

  return (
    <Reveal delay={index * 0.08}>
      <div
        className="relative border-t pt-14 pb-10"
        style={{ borderColor: COLOR, overflow: 'visible' }}
      >
        {/* Grid: silhouette + text info */}
        <div
          className="grid items-start gap-10"
          style={{ gridTemplateColumns: '90px 1fr' }}
        >
          {/* Silhouette — overflow above top border */}
          <div className="relative" style={{ height: 200, overflow: 'visible' }}>
            <div className="absolute bottom-0 left-0 w-[110px] h-[165px]">
              <Silhouette gender={gender} />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h4
                  className="text-3xl mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: '#1B1D20' }}
                >
                  {sp.name}
                </h4>
                <span
                  className="text-xl tracking-wide flex-shrink-0"
                  style={{ fontFamily: 'var(--font-content)', color: MEDIA_ORANGE }}
                >
                  {sp.experience}
                </span>
              </div>
              <p
                className="text-lg mb-1"
                style={{ fontFamily: 'var(--font-content)', color: COLOR }}
              >
                {sp.approach}
              </p>
            </div>

            <p
              className="text-base lg:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
            >
              {sp.bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {sp.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[13px] tracking-wide px-4 py-1.5 rounded-full"
                  style={{
                    fontFamily: 'var(--font-content)',
                    color: '#fff',
                    backgroundColor: COLOR,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA — full card width, outside grid */}
        <button
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          className="w-full py-3 rounded-full text-base border-2 transition-colors duration-200 mt-8"
          style={{
            fontFamily: 'var(--font-content)',
            borderColor: btnHov ? MEDIA_ORANGE : COLOR,
            backgroundColor: btnHov ? MEDIA_ORANGE : 'transparent',
            color: btnHov ? '#fff' : COLOR,
          }}
        >
          Записаться
        </button>
      </div>
    </Reveal>
  );
}

function SpecialistSection() {
  const [current, setCurrent] = useState(0);
  const [yesIds, setYesIds] = useState<string[]>([]);
  const [exitDir, setExitDir] = useState<'left' | 'right'>('right');
  const done = current >= ANAMNESIS.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    setExitDir(direction);
    if (direction === 'right') {
      setYesIds((prev) => [...prev, ANAMNESIS[current].id]);
    }
    setCurrent((prev) => prev + 1);
  };

  const reset = () => {
    setCurrent(0);
    setYesIds([]);
  };

  /* Match specialists: collect tags from "yes" questions, rank by overlap */
  const matchedSpecs = (() => {
    if (!done) return [];
    const activeTags = new Set(
      ANAMNESIS.filter((q) => yesIds.includes(q.id)).flatMap((q) => q.tags),
    );
    if (activeTags.size === 0) return [];
    return SPECIALISTS
      .map((sp) => ({
        ...sp,
        score: sp.tags.filter((t) => activeTags.has(t)).length,
      }))
      .filter((sp) => sp.score > 0)
      .sort((a, b) => b.score - a.score);
  })();

  return (
    <div className="min-h-screen flex flex-col px-10 py-10 lg:px-24 lg:py-14">
      {/* Header */}
      <Reveal>
        <h1
          className="text-5xl lg:text-8xl tracking-tight max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          Найдём <span style={{ color: COLOR }}>вашего</span>
          <br />
          терапевта
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          className="mt-4 text-lg leading-relaxed max-w-xl"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          {!done
            ? 'Ответьте на несколько вопросов — мы подберём специалиста под ваш запрос.'
            : 'На основе ваших ответов мы подобрали специалистов.'}
        </p>
      </Reveal>

      {/* Content area */}
      <div className="flex-1 flex items-center justify-center mt-6">
        {!done ? (
          <div className="w-full max-w-lg flex flex-col items-center">
            {/* Counter */}
            <div className="w-full flex items-center justify-between mb-4">
              <span
                className="text-[14px] tabular-nums"
                style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
              >
                {current + 1} / {ANAMNESIS.length}
              </span>
              {yesIds.length > 0 && (
                <span
                  className="text-[14px]"
                  style={{ fontFamily: 'var(--font-content)', color: SCHOOL_BLUE }}
                >
                  Отмечено: {yesIds.length}
                </span>
              )}
            </div>

            {/* Card stack */}
            <div className="relative w-full" style={{ height: 380 }}>
              <AnimatePresence custom={exitDir}>
                {ANAMNESIS.slice(current, current + 2)
                  .reverse()
                  .map((q, revI, arr) => (
                    <SwipeCard
                      key={q.id}
                      question={q}
                      onSwipe={handleSwipe}
                      isTop={revI === arr.length - 1}
                    />
                  ))}
              </AnimatePresence>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-center gap-12">
              <SwipeButton onClick={() => handleSwipe('left')} color={MEDIA_ORANGE}>
                ✕
              </SwipeButton>
              <SwipeButton onClick={() => handleSwipe('right')} color={SCHOOL_BLUE}>
                ✓
              </SwipeButton>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {matchedSpecs.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <AccentStar color={COLOR} size={14} />
                  <span
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-content)', color: COLOR }}
                  >
                    {matchedSpecs.length === 1
                      ? 'Подобран 1 специалист'
                      : `Подобрано ${matchedSpecs.length} специалистов`}
                  </span>
                </div>

                <div className="pt-5" style={{ overflow: 'visible' }}>
                  {matchedSpecs.map((sp, i) => (
                    <ResultRow key={sp.name} sp={sp} index={i} />
                  ))}
                  {/* Bottom border after last item */}
                  <div className="border-t" style={{ borderColor: COLOR }} />
                </div>
              </>
            ) : (
              <div className="mb-10">
                <p
                  className="text-xl mb-3"
                  style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
                >
                  Вы не отметили ни одного запроса.
                </p>
                <p
                  className="text-base"
                  style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
                >
                  Ничего страшного — мы подберём специалиста вручную после короткой консультации.
                </p>
              </div>
            )}

            <button
              onClick={reset}
              className="text-base mt-10 transition-colors"
              style={{ fontFamily: 'var(--font-content)', color: COLOR }}
            >
              ← Пройти заново
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
 * 3. PRINCIPLES & MANIFESTO
 *
 * Heading left. Principles fill the width as
 * a two-column grid — content spreads naturally.
 * ═══════════════════════════════════════ */

const PRINCIPLES = [
  {
    title: 'Доказательность',
    text: 'Только подходы и методы с подтверждённой эффективностью. Никакой эзотерики, никакого шаманства.',
  },
  {
    title: 'Партнёрство',
    text: 'Не патернализм, а совместная работа. Клиент — полноправный участник процесса.',
  },
  {
    title: 'Сложные случаи',
    text: 'Мы не боимся нетиповых ситуаций. Там, где другие говорят «это не ко мне» — мы работаем.',
  },
  {
    title: 'Функциональность',
    text: 'Цель — не бесконечный анализ, а возвращение к полноценной жизни.',
  },
  {
    title: 'Прозрачность',
    text: 'Мы объясняем, что делаем и почему. Терапия — не магия, а понятный процесс.',
  },
];

function PrinciplesSection() {
  return (
    <div className="min-h-screen flex flex-col px-10 py-16 lg:px-24 lg:py-20">
      {/* Header — left flag */}
      <Reveal>
        <h1
          className="text-5xl lg:text-8xl tracking-tight max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          Во что мы
          <br />
          <span style={{ color: COLOR }}>верим</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          className="mt-4 text-lg lg:text-xl leading-relaxed max-w-xl"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          Каждый принцип — не лозунг, а ежедневная практика.
        </p>
      </Reveal>

      {/* Principles — full-width two-col grid */}
      <div className="flex-1 flex flex-col justify-center mt-12">
        <div className="w-full grid lg:grid-cols-2 gap-x-16 gap-y-0">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div
                className="flex items-start gap-6 py-8 border-b"
                style={{ borderColor: CLR.border }}
              >
                <span
                  className="text-base tabular-nums mt-0.5 flex-shrink-0 w-8"
                  style={{ fontFamily: 'var(--font-content)', color: COLOR }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    className="text-xl lg:text-2xl mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
                  >
                    {p.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Manifesto — offset right to create visual counterpoint */}
        <Reveal delay={0.4}>
          <div
            className="mt-16 ml-auto pl-10 border-l-3 max-w-lg"
            style={{ borderColor: COLOR }}
          >
            <p
              className="text-xl lg:text-2xl leading-relaxed italic"
              style={{ fontFamily: 'var(--font-heading)', color: '#1B1D20' }}
            >
              «Мы создаём пространство, где сложность не пугает,
              а становится точкой роста. Где наука служит человеку,
              а не наоборот.»
            </p>
            <span
              className="mt-4 inline-block text-[13px] tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-content)', color: COLOR }}
            >
              Practicum HELP
            </span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
 * 4. IMPACT COUNTER
 *
 * Heading left. Stats spread across
 * full width as a 4-col grid.
 * ══════════════════════════════════════ */

const STATS = [
  { value: 4200, label: 'Проведённых сессий', suffix: '+' },
  { value: 840, label: 'Клиентов получили помощь', suffix: '+' },
  { value: 89, label: 'Клиентов отмечают улучшение', suffix: '%' },
  { value: 18, label: 'Специалистов в команде', suffix: '' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = Math.max(1, Math.floor(target / (dur / 16)));
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(id);
      }
      setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('ru-RU')}
      {suffix}
    </span>
  );
}

function ImpactSection() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-10 py-16 lg:px-24 lg:py-20">
      {/* Header — left flag */}
      <Reveal>
        <h1
          className="text-5xl lg:text-8xl tracking-tight max-w-4xl"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          Помощь
          <br />
          <span style={{ color: COLOR }}>в цифрах</span>
        </h1>
      </Reveal>

      {/* Stats — full-width spread */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 mt-16">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="space-y-2">
              <span
                className="text-4xl lg:text-6xl tracking-tight block"
                style={{ fontFamily: 'var(--font-heading)', color: COLOR }}
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </span>
              <span
                className="text-[14px] leading-snug block"
                style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
              >
                {s.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
 * 5. ANTI-STRESS BREATHING
 *
 * 4-7-8 technique. Water-fill circle animation.
 * Each phase has its own color:
 *   inhale = blue (#1192E6), hold = green (#069B93), exhale = orange (#FF5E0E)
 * ═══════════════════════════════════════ */

const PHASE_COLORS = {
  inhale: '#1192E6',
  hold: '#069B93',
  exhale: '#FF5E0E',
} as const;

const PHASE_DURATIONS = { inhale: 4, hold: 7, exhale: 8 } as const;
const PHASE_LABELS = { inhale: 'Вдох', hold: 'Задержка', exhale: 'Выдох' } as const;
const PHASE_ORDER: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];

function AntiStressSection() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.inhale);
  const [fillPct, setFillPct] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const dur = PHASE_DURATIONS[phaseRef.current];
      const t = Math.min(elapsed / dur, 1);

      let fill: number;
      if (phaseRef.current === 'inhale') fill = t * 100;
      else if (phaseRef.current === 'hold') fill = 100;
      else fill = (1 - t) * 100;

      setFillPct(fill);
      setSecondsLeft(Math.max(0, Math.ceil(dur - elapsed)));

      if (t >= 1) {
        const idx = PHASE_ORDER.indexOf(phaseRef.current);
        const next = PHASE_ORDER[(idx + 1) % 3];
        phaseRef.current = next;
        setPhase(next);
        setSecondsLeft(PHASE_DURATIONS[next]);
        startRef.current = performance.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  const handleStart = () => {
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setSecondsLeft(PHASE_DURATIONS.inhale);
    setFillPct(0);
    setActive(true);
  };

  const handleStop = () => {
    setActive(false);
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setFillPct(0);
    setSecondsLeft(PHASE_DURATIONS.inhale);
  };

  const phaseColor = PHASE_COLORS[phase];
  const innerSize = 144;
  const outerSize = 224;

  /* Measure flex area → compute max safe scale so circle never overflows viewport */
  const areaRef = useRef<HTMLDivElement>(null);
  const [safeScale, setSafeScale] = useState(1.8);

  useEffect(() => {
    const measure = () => {
      if (!areaRef.current) return;
      const h = areaRef.current.clientHeight;
      // reserve 80px for legend + stop button
      const maxDiam = h - 80;
      setSafeScale(Math.min(2.6, Math.max(1, maxDiam / outerSize)));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      className="flex flex-col px-10 py-16 lg:px-24 lg:py-20"
      style={{ height: 'calc(100vh - 129px)' }}
    >
      {/* Header — 4-7-8 */}
      <Reveal>
        <h1
          className="text-5xl lg:text-8xl tracking-tight max-w-4xl whitespace-nowrap"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          <span>4-7-</span><span style={{ color: COLOR, verticalAlign: 'baseline', display: 'inline', lineHeight: 'inherit', fontSize: 'inherit' }}>8</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p
          className="mt-4 text-base lg:text-lg"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          Следуй за ритмом. Дыши
        </p>
      </Reveal>

      {/* Breathing circle — scales to safeScale on start */}
      <div ref={areaRef} className="flex-1 flex flex-col items-center justify-center min-h-0">
        <motion.div
          className="relative flex items-center justify-center cursor-pointer"
          style={{ width: outerSize, height: outerSize }}
          animate={{
            scale: active ? safeScale : 1,
            y: active ? -((outerSize / 2) * (safeScale - 1)) : 0,
          }}
          transition={{ duration: active ? 1.2 : 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={active ? handleStop : handleStart}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full transition-colors duration-700"
            style={{ border: `2px solid ${active ? phaseColor : CLR.border}` }}
          />

          {/* Inner circle — water-fill container */}
          <div
            className="rounded-full overflow-hidden relative transition-colors duration-700"
            style={{
              width: innerSize,
              height: innerSize,
              backgroundColor: active ? '#fff' : COLOR,
              border: active ? `2px solid ${phaseColor}` : 'none',
            }}
          >
            {/* Water fill from bottom */}
            {active && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${fillPct}%`,
                  backgroundColor: phaseColor,
                  transition: 'background-color 0.7s ease',
                }}
              />
            )}

            {/* Countdown — dual layer for perfect inversion at fill edge */}
            {active ? (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Layer 1: coloured digit on white background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-2xl tabular-nums select-none"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: phaseColor,
                      transition: 'color 0.7s ease',
                    }}
                  >
                    {secondsLeft}
                  </span>
                </div>
                {/* Layer 2: white digit, clip container anchored bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 overflow-hidden"
                  style={{ height: `${fillPct}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
                    style={{ height: innerSize }}
                  >
                    <span
                      className="text-2xl tabular-nums select-none"
                      style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}
                    >
                      {secondsLeft}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <span
                  className="text-base tracking-wide text-white"
                  style={{ fontFamily: 'var(--font-content)' }}
                >
                  Начать
                </span>
              </div>
            )}
          </div>

          {/* Orbiting AccentStars */}
          {active && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    rotate: { duration: 16 + i * 4, repeat: Infinity, ease: 'linear' },
                  }}
                  style={{
                    top: `${15 + i * 28}%`,
                    left: i === 1 ? '88%' : i === 0 ? '5%' : '80%',
                  }}
                >
                  <AccentStar color={phaseColor} size={8 + i * 3} />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Phase legend — flex-shrink-0 keeps it visible */}
        <div className="flex items-center gap-8 mt-6 flex-shrink-0">
          {PHASE_ORDER.map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: PHASE_COLORS[p],
                  opacity: active && phase === p ? 1 : 0.3,
                  transform: active && phase === p ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span
                className="text-[13px] transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-content)',
                  color: active && phase === p ? PHASE_COLORS[p] : CLR.muted,
                }}
              >
                {PHASE_LABELS[p]}
              </span>
            </div>
          ))}
        </div>

        {active && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[14px] mt-4 transition-colors flex-shrink-0"
            style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
            onClick={(e) => { e.stopPropagation(); handleStop(); }}
          >
            Остановить
          </motion.button>
        )}
      </div>
    </div>
  );
}