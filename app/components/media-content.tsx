import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { AccentStar } from './accent-star';
import { PracticumLogo } from './practicum-logos';
import svgPaths404 from '../../imports/svg-16r0pl3rcx';
import img404 from 'figma:asset/202a5fea03d48a92c4e74143723ce83d91c32954.png';

const COLOR = '#FF5E0E';

const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

export const ARTICLES = [
  {
    id: 'burnout-science',
    title: 'Наука выгорания',
    subtitle: 'Что происходит с мозгом, когда вы устали жить',
    category: 'Исследования',
    readTime: '8 мин',
    imageHeight: 280,
    content: `Выгорание — не метафора. Это измеримое изменение в работе префронтальной коры и миндалевидного тела.

Когда стресс становится хроническим, мозг переключается в режим выживания. Префронтальная кора — зона, отвечающая за планирование, контроль, принятие решений — буквально сжимается. МРТ показывает уменьшение объёма серого вещества.

Одновременно гипертрофируется миндалевидное тело — структура, отвечающая за страх и тревогу. Вы начинаете воспринимать обычные задачи как угрозу.

Хорошая новость: это обратимо. Исследования показывают, что 8 недель терапии или практики осознанности восстанавливают структуру мозга.

Плохая: сам по себе отпуск не поможет. Нужна системная работа.`,
  },
  {
    id: 'therapy-myths',
    title: 'Пять мифов о терапии',
    subtitle: 'Которые мешают вам начать',
    category: 'Разбор',
    readTime: '5 мин',
    imageHeight: 320,
    content: `Миф 1: "Терапия — для слабых"
Реальность: терапия требует смелости смотреть на то, что больно.

Миф 2: "Психолог даст советы"
Реальность: терапевт помогает найти собственные решения, а не навязывает чужие.

Миф 3: "Нужно ходить годами"
Реальность: КПТ показывает результаты за 12–16 сессий. EMDR — за 8–12.

Миф 4: "Можно справиться самому"
Реальность: можно. Но с поддержкой — быстрее и эффективнее.

Миф 5: "Терапевт всё исправит"
Реальность: терапевт — партнёр, а не волшебник. Работа общая.`,
  },
  {
    id: 'trauma-body',
    title: 'Травма живёт в теле',
    subtitle: 'Почему психотерапия работает с телом',
    category: 'Практика',
    readTime: '10 мин',
    imageHeight: 240,
    content: `Травматические воспоминания хранятся не только в сознании. Они закодированы в мышечном напряжении, дыхании, реакциях автономной нервной системы.

Человек может не помнить событие, но тело помнит. Внезапное напряжение в плечах, учащённое сердцебиение, затруднённое дыхание — это следы травмы.

Именно поэтому современная травма-терапия работает с телом. EMDR использует движения глаз. Соматическая терапия — осознанность телесных ощущений. Сенсомоторная психотерапия — работу с позой и движением.

Цель — не просто вспомнить и переосмыслить, а освободить тело от застывших реакций.

Когда тело расслабляется, разум следует за ним.`,
  },
  {
    id: 'anxiety-mechanism',
    title: 'Механизм тревоги',
    subtitle: 'Как работает тревожное расстройство',
    category: 'Исследования',
    readTime: '7 мин',
    imageHeight: 300,
    content: `Тревога — нормальная реакция на угрозу. Тревожное расстройство — сломанный детектор угрозы.

Миндалевидное тело начинает срабатывать на безопасные стимулы. Звонок телефона, письмо от начальника, взгляд незнакомца — всё воспринимается как опасность.

Мозг застревает в цикле: тревога → избегание → краткосрочное облегчение → усиление тревоги.

Когнитивно-поведенческая терапия разрывает этот цикл. Через постепенную экспозицию мозг учится заново: это не опасно.

Не сразу. Не легко. Но работает.`,
  },
  {
    id: 'antidepressants-truth',
    title: 'Правда об антидепрессантах',
    subtitle: 'Что нужно знать перед началом',
    category: 'Разбор',
    readTime: '12 мин',
    imageHeight: 260,
    content: `Антидепрессанты — не таблетки счастья. Это инструмент нормализации нейромедиаторного обмена.

Они не делают вас весёлым. Они возвращают способность чувствовать вообще.

Эффект наступает через 2–4 недели. Первые дни могут быть сложными — побочные эффекты появляются раньше, чем улучшение.

Важно: антидепрессанты эффективнее всего в сочетании с терапией. Таблетки стабилизируют состояние, терапия меняет паттерны.

Отмена требует постепенности. Резкое прекращение приводит к синдрому отмены.

Это не навсегда. Большинство принимает антидепрессанты 6–12 месяцев, затем постепенно снижает дозу.`,
  },
  {
    id: 'boundaries',
    title: 'Границы без вины',
    subtitle: 'Как говорить "нет" и не чувствовать себя плохим',
    category: 'Практика',
    readTime: '6 мин',
    imageHeight: 340,
    content: `Границы — это не стены. Это определение, где заканчивается вы и начинается другой человек.

Многие путают границы с жёсткостью. На самом деле границы делают отношения безопаснее и честнее.

Говорить "нет" — не эгоизм. Это забота о себе, которая позволяет давать другим из наполненности, а не из опустошения.

Формула: "Я не могу [действие], потому что [причина]. Я могу [альтернатива]."

Пример: "Я не огу остаться сегодня после работы, у меня важные планы. Я могу помочь завтра утром."

Вина — нормальная реакция на первые попытки. Со временем проходит.`,
  },
  {
    id: 'sleep-mental-health',
    title: 'Сон и психика',
    subtitle: 'Почему бессонница делает всё хуже',
    category: 'Исследования',
    readTime: '9 мин',
    imageHeight: 290,
    content: `Хроническое недосыпание не просто делает вас усталым. Оно перестраивает работу мозга.

После одной бессонной ночи активность миндалевидного тела увеличивается на 60%. Вы острее реагируете на стресс, хуже контролируете эмоции.

Префронтальная кора — зона рационального мышления — теряет связь с миндалевидным телом. Эмоции берут контроль.

Хроническая бессонница — фактор риска для депрессии, тревожных расстройств, биполярного расстройства.

КПТ бессонницы (CBT-I) эффективнее снотворных. Она не просто помогает заснуть — она восстанавливает естественный цикл сна.

Сон — не роскошь. Это базовая потребность мозга.`,
  },
  {
    id: 'perfectionism',
    title: 'Перфекционизм убивает',
    subtitle: 'Почему стремление к идеалу ведёт к коллапсу',
    category: 'Разбор',
    readTime: '8 мин',
    imageHeight: 310,
    content: `Перфекционизм — не про высокие стандарты. Это про страх быть недостаточным.

Перфекционист не ставит цели — он избегает провала. Разница критична.

Исследования связывают перфекционизм с депрессией, тревогой, расстройствами пищевого поведения, суицидальными мыслями.

Парадокс: перфекционизм снижает продуктивность. Страх ошибки парализует.

Антидот — самосострадание. Способность относиться к себе так же, как к близкому другу.

Не "я неудачник", а "я совершил ошибку, и это нормально".

Прогресс важнее совершенства.`,
  },
];

interface MediaContentProps {
  onNavigateToSchool?: () => void;
}

/* ── Deterministic grid spans — tiles 3 cols with zero gaps ── */
const GRID_LAYOUTS: { colSpan: number; rowSpan: number }[] = [
  { colSpan: 2, rowSpan: 2 },  // 0  big feature
  { colSpan: 1, rowSpan: 1 },  // 1  small
  { colSpan: 1, rowSpan: 1 },  // 2  small
  { colSpan: 3, rowSpan: 1 },  // 3  full-width banner
  { colSpan: 1, rowSpan: 2 },  // 4  tall
  { colSpan: 2, rowSpan: 1 },  // 5  wide
  { colSpan: 1, rowSpan: 1 },  // 6  small
  { colSpan: 1, rowSpan: 1 },  // 7  small
];

/*
  Row 1: [0][0][1]
  Row 2: [0][0][2]
  Row 3: [3][3][3]
  Row 4: [4][5][5]
  Row 5: [4][6][7]
*/

/* ── Generative SVG abstractions ── */
function CardSvg({ index, color, hovered }: { index: number; color: string; hovered: boolean }) {
  const fill = hovered ? 'rgba(255,255,255,0.12)' : `${color}12`;
  const stroke = hovered ? 'rgba(255,255,255,0.18)' : `${color}25`;
  const variant = index % 6;

  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute pointer-events-none"
      style={{
        width: '65%',
        height: '65%',
        right: '-8%',
        bottom: '-8%',
        transition: 'opacity 0.2s',
      }}
    >
      {variant === 0 && (
        /* concentric circles */
        <>
          <circle cx="100" cy="100" r="90" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="100" cy="100" r="65" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="100" cy="100" r="15" fill={fill} />
        </>
      )}
      {variant === 1 && (
        /* diagonal lines */
        <>
          {[0, 28, 56, 84, 112, 140, 168].map((d) => (
            <line key={d} x1={d} y1="0" x2={d + 60} y2="200" stroke={stroke} strokeWidth="1" />
          ))}
          <rect x="50" y="50" width="100" height="100" rx="50" fill={fill} />
        </>
      )}
      {variant === 2 && (
        /* dot grid */
        <>
          {Array.from({ length: 7 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={20 + c * 28}
                cy={20 + r * 28}
                r={r === 3 && c === 3 ? 8 : 3}
                fill={r === 3 && c === 3 ? fill : stroke}
              />
            ))
          )}
        </>
      )}
      {variant === 3 && (
        /* nested squares rotated */
        <>
          <g transform="translate(100,100)">
            <rect x="-80" y="-80" width="160" height="160" fill="none" stroke={stroke} strokeWidth="1" transform="rotate(0)" />
            <rect x="-56" y="-56" width="112" height="112" fill="none" stroke={stroke} strokeWidth="1" transform="rotate(15)" />
            <rect x="-36" y="-36" width="72" height="72" fill={fill} stroke={stroke} strokeWidth="1" transform="rotate(30)" />
            <rect x="-16" y="-16" width="32" height="32" fill={fill} transform="rotate(45)" />
          </g>
        </>
      )}
      {variant === 4 && (
        /* wave arcs */
        <>
          {[30, 60, 90, 120, 150].map((r) => (
            <path
              key={r}
              d={`M 0 ${200 - r * 0.8} Q 100 ${200 - r * 1.6} 200 ${200 - r * 0.8}`}
              fill="none"
              stroke={stroke}
              strokeWidth="1"
            />
          ))}
          <circle cx="100" cy="140" r="20" fill={fill} />
        </>
      )}
      {variant === 5 && (
        /* radial spokes */
        <>
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + Math.cos(angle) * 90}
                y2={100 + Math.sin(angle) * 90}
                stroke={stroke}
                strokeWidth="1"
              />
            );
          })}
          <circle cx="100" cy="100" r="30" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="100" cy="100" r="8" fill={fill} />
        </>
      )}
    </svg>
  );
}

/* ── Article card with hover inversion ── */
function ArticleCard({
  article,
  layout,
  index,
  onClick,
}: {
  article: typeof ARTICLES[0];
  layout: { colSpan: number; rowSpan: number };
  index: number;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isLarge = layout.colSpan >= 2 && layout.rowSpan >= 2;
  const isWide = layout.colSpan >= 2 && layout.rowSpan === 1;
  const isBanner = layout.colSpan === 3;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full h-full text-left rounded-xl border-2 transition-colors duration-200 overflow-hidden relative"
      style={{
        gridColumn: `span ${layout.colSpan}`,
        gridRow: `span ${layout.rowSpan}`,
        borderColor: hov ? COLOR : CLR.border,
        backgroundColor: hov ? COLOR : '#fff',
      }}
    >
      {/* SVG abstraction */}
      <CardSvg index={index} color={COLOR} hovered={hov} />

      <div className={`flex flex-col justify-between h-full relative z-10 ${isLarge ? 'p-8 lg:p-10' : 'p-6 lg:p-8'}`}>
        {/* Top: category + read time */}
        <div className="flex items-center gap-3">
          <span
            className="text-[12px] tracking-[0.15em] uppercase transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-content)',
              color: hov ? 'rgba(255,255,255,0.7)' : COLOR,
            }}
          >
            {article.category}
          </span>
          <span
            className="text-[13px] transition-colors duration-200"
            style={{
              fontFamily: 'var(--font-content)',
              color: hov ? 'rgba(255,255,255,0.5)' : CLR.muted,
            }}
          >
            {article.readTime}
          </span>
        </div>

        {/* Bottom: title + subtitle */}
        <div className="mt-auto">
          <h3
            className={`tracking-tight mb-2 transition-colors duration-200 ${
              isLarge ? 'text-3xl lg:text-4xl' :
              isBanner ? 'text-2xl lg:text-3xl' :
              'text-xl lg:text-2xl'
            }`}
            style={{
              fontFamily: 'var(--font-heading)',
              color: hov ? '#fff' : CLR.text,
              lineHeight: 1.1,
            }}
          >
            {article.title}
          </h3>
          <p
            className={`leading-relaxed transition-colors duration-200 ${
              isLarge ? 'text-base lg:text-lg' :
              isBanner ? 'text-[15px]' :
              'text-[14px]'
            }`}
            style={{
              fontFamily: 'var(--font-content)',
              color: hov ? 'rgba(255,255,255,0.7)' : CLR.muted,
            }}
          >
            {article.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

export function MediaContent({ onNavigateToSchool }: MediaContentProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  /* Restore scroll position AFTER grid has been measured */
  const scrollRestoredRef = useRef(false);
  useEffect(() => {
    if (!cellSize || scrollRestoredRef.current) return;
    const saved = sessionStorage.getItem('media-scrollY');
    if (saved) {
      const y = parseInt(saved, 10);
      // Two rAFs so the grid has rendered with correct row height
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: 'instant' });
        });
      });
      sessionStorage.removeItem('media-scrollY');
    }
    scrollRestoredRef.current = true;
  }, [cellSize]);

  /* Navigate to article, saving scroll position */
  const openArticle = (id: string) => {
    sessionStorage.setItem('media-scrollY', String(window.scrollY));
    navigate(`/media/${id}`);
  };

  /* Measure container → derive square cell size (3 columns, gap 16px) */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const GAP = 16;
    const measure = () => {
      const w = el.clientWidth;
      setCellSize(Math.floor((w - GAP * 2) / 3));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const categories = ['Все', ...Array.from(new Set(ARTICLES.map((a) => a.category)))];
  const filtered = filter && filter !== 'Все' 
    ? ARTICLES.filter((a) => a.category === filter) 
    : ARTICLES;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-[calc(100vh-129px)] flex flex-col justify-between px-10 py-16 lg:px-24 lg:py-20">
        <PracticumLogo
          id="media"
          height={160}
          style={{ color: '#1B1D20' }}
        />
        <div>
          <h2
            className="text-4xl lg:text-6xl tracking-tight max-w-4xl"
            style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
          >
            Прозрачность<br />
            <span style={{ color: COLOR }}>сложного</span>
          </h2>
          <p className="mt-8 text-lg lg:text-2xl leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}>
            Научная обоснованность без упрощения. Делаем сложное понятным.
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="px-10 py-16 lg:px-24 lg:py-20">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = filter === cat || (cat === 'Все' && !filter);
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat === 'Все' ? null : cat)}
                className="px-5 py-2.5 rounded-full text-[14px] tracking-wide transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-content)',
                  backgroundColor: isActive ? COLOR : 'transparent',
                  color: isActive ? '#fff' : CLR.text,
                  border: `2px solid ${isActive ? COLOR : CLR.border}`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Square grid — 3 columns, auto-flow dense */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: cellSize || 320,
            gridAutoFlow: 'dense',
            gap: '16px',
          }}
        >
          {filtered.map((article, i) => {
            const layout = GRID_LAYOUTS[i % GRID_LAYOUTS.length];
            return (
              <ArticleCard
                key={article.id}
                article={article}
                layout={layout}
                index={i}
                onClick={() => openArticle(article.id)}
              />
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="mt-20 p-12 rounded-2xl border-2"
          style={{ borderColor: COLOR }}
        >
          <h2
            className="text-3xl lg:text-5xl tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            В курсах — <span style={{ color: COLOR }}>практика</span>
          </h2>
          <p
            className="text-lg mb-6 max-w-2xl"
            style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
          >
            Упражнения, техники, протоколы. То, что можно применять.
          </p>
          <button
            onClick={onNavigateToSchool}
            className="px-8 py-4 rounded-full text-base transition-all hover:opacity-90"
            style={{
              fontFamily: 'var(--font-content)',
              backgroundColor: COLOR,
              color: '#fff',
            }}
          >
            Перейти к курсам
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArticlePage({ articleId, onBack, onNavigateToSchool }: { 
  articleId: string; 
  onBack: () => void;
  onNavigateToSchool?: () => void;
}) {
  const article = ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    /*
     * 404 page — single SVG viewBox 768×486.
     * Text lives in the SAME local coordinate space as its polygon
     * (shared <g transform>), clipped by <clipPath> using the polygon path.
     *
     * Figma coords (local to each polygon):
     *   Orange (479×275): text center-x=195, top=60.5, width=213
     *   Blue   (387×123.5): text center-x=239.5, top=50, font=15px
     */
    return (
      <div className="w-full" style={{ backgroundColor: '#F9F9F9' }}>
        <div className="relative w-full" style={{ paddingBottom: '63.28%' }}>
          {/* Background photo */}
          <img
            alt=""
            className="absolute pointer-events-none"
            style={{
              left: 0, right: 0,
              top: '23.87%', bottom: 0,
              width: '100%', height: '76.13%',
              objectFit: 'cover',
            }}
            src={img404}
          />

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 768 486"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            <defs>
              {/* clipPaths in LOCAL polygon coordinate spaces */}
              <clipPath id="clip-orange">
                <path d={svgPaths404.p14d6c900} />
              </clipPath>
              <clipPath id="clip-blue">
                <path d={svgPaths404.p35da4600} />
              </clipPath>
            </defs>

            {/* ── Orange polygon + text (local space 479×275) ── */}
            <g transform="translate(14.5,-2.5)">
              <path d={svgPaths404.p14d6c900} fill="#FF5E0E" />
              <foreignObject
                x="88.5" y="60.5" width="213" height="210"
                clipPath="url(#clip-orange)"
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Inter', var(--font-content), sans-serif",
                    fontWeight: 400,
                    lineHeight: 0,
                    fontSize: '0px',
                    textAlign: 'center',
                    color: 'white',
                    width: '213px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <span style={{ lineHeight: 'normal', fontSize: '16px' }}>{'я просмотрел '}</span>
                  <span style={{ lineHeight: 'normal', fontSize: '48px' }}>404</span>
                  <span style={{ lineHeight: 'normal', fontSize: '16px' }}>{' миллиона возможных вариантов страниц, но не нашел нужной'}</span>
                </p>
              </foreignObject>
            </g>

            {/* ── Blue polygon + text (local space 387×123.5) ── */}
            <g transform="translate(288,341)">
              <path d={svgPaths404.p35da4600} fill="#1192E6" />
              <foreignObject
                x="89.5" y="50" width="300" height="50"
                clipPath="url(#clip-blue)"
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Inter', var(--font-content), sans-serif",
                    fontWeight: 400,
                    lineHeight: 'normal',
                    fontSize: '15px',
                    textAlign: 'center',
                    color: 'white',
                    whiteSpace: 'nowrap',
                  }}
                >
                  это тревожное расстройство…
                </p>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-10 py-16 lg:px-24 lg:py-20">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 text-base transition-colors flex items-center gap-2"
        style={{ fontFamily: 'var(--font-content)', color: COLOR }}
      >
        <span>←</span> Все статьи
      </button>

      {/* Article header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] tracking-[0.15em] uppercase"
            style={{ fontFamily: 'var(--font-content)', color: COLOR }}
          >
            {article.category}
          </span>
          <span
            className="text-[12px]"
            style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
          >
            {article.readTime}
          </span>
        </div>

        <h1
          className="text-4xl lg:text-6xl tracking-tight mb-4"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          {article.title}
        </h1>

        <p
          className="text-xl lg:text-2xl leading-relaxed mb-12"
          style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
        >
          {article.subtitle}
        </p>

        {/* Image */}
        <div
          className="w-full rounded-xl overflow-hidden mb-12 relative"
          style={{ 
            height: 400,
            backgroundColor: `${COLOR}15`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AccentStar color={COLOR} size={48} style={{ opacity: 0.2 }} />
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-6 text-lg leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 p-10 rounded-2xl border-2"
          style={{ borderColor: COLOR }}
        >
          <h3
            className="text-2xl lg:text-3xl tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Хотите практики?
          </h3>
          <p
            className="text-base mb-6"
            style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
          >
            Курсы — от понимания к конкретным техникам.
          </p>
          <button
            onClick={onNavigateToSchool}
            className="px-6 py-3 rounded-full text-[15px] transition-all"
            style={{
              fontFamily: 'var(--font-content)',
              backgroundColor: COLOR,
              color: '#fff',
            }}
          >
            К курсам
          </button>
        </div>
      </div>
    </div>
  );
}