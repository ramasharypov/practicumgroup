import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AccentStar } from './accent-star';
import { motion } from 'motion/react';

const COLOR = '#1192E6';
const HELP_COLOR = '#069B93';
const DIFFICULTY_COLOR = '#FF5E0E';

const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

function getModuleTime(difficulty: number, moduleIndex: number): string {
  const base = [15, 25, 35, 50, 70];
  const mins = base[Math.min(difficulty - 1, 4)] + (moduleIndex % 3) * 10;
  return mins >= 60 ? `${Math.floor(mins / 60)}ч ${mins % 60}мин` : `${mins} мин`;
}

function getModuleDifficulty(courseDifficulty: number, moduleIndex: number, total: number): number {
  const progress = moduleIndex / Math.max(total - 1, 1);
  const base = Math.max(1, courseDifficulty - 1);
  const peak = Math.min(5, courseDifficulty + 1);
  return Math.round(base + (peak - base) * progress);
}

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle: string;
    difficulty: number;
    duration: string;
    modules: number;
    tags: string[];
    progress: number;
    description: string;
    goal: string;
    result: string;
    modulesList: string[];
  };
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isLoggedIn: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  illustrationIndex: number;
  AnimatedIllustration: React.ComponentType<{ index: number }>;
  DifficultyStars: React.ComponentType<{ level: number }>;
  ProgressBar: React.ComponentType<{ progress: number }>;
}

export function CourseCard({
  course,
  favorites,
  toggleFavorite,
  isLoggedIn,
  isExpanded,
  onToggleExpand,
  illustrationIndex,
  AnimatedIllustration,
  DifficultyStars,
  ProgressBar,
}: CourseCardProps) {
  const navigate = useNavigate();
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  const completedModules = Math.floor((course.progress / 100) * course.modules);

  return (
    <div
      id={`course-card-${course.id}`}
      className="group relative p-8 rounded-xl border-2 overflow-hidden transition-all duration-300"
      style={{ 
        borderColor: COLOR,
        backgroundColor: '#fff',
      }}
    >
      {/* Save button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(course.id);
        }}
        className="absolute top-8 right-8 flex items-center gap-2 z-10"
        style={{ lineHeight: 1.05 }}
      >
        <span
          className="text-[12px] tracking-wide whitespace-nowrap"
          style={{ 
            fontFamily: 'var(--font-content)', 
            color: favorites.has(course.id) ? COLOR : CLR.muted,
          }}
        >
          {favorites.has(course.id) ? 'Сохранено' : 'Сохранить'}
        </span>
        <AccentStar 
          color={favorites.has(course.id) ? COLOR : CLR.muted} 
          size={24}
          style={{ 
            opacity: favorites.has(course.id) ? 1 : 0.5,
            transition: 'all 0.2s',
          }}
        />
      </button>

      {/* Title */}
      <div className="mb-6 pr-32">
        <h3
          className="text-2xl lg:text-3xl mb-3"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          {course.title}
        </h3>
        <p
          className="text-base"
          style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
        >
          {course.subtitle}
        </p>
      </div>

      {/* === COLLAPSED === */}
      {!isExpanded && (
        <>
          <div className="mb-6 rounded-lg overflow-hidden" style={{ height: '200px' }}>
            <AnimatedIllustration index={illustrationIndex} />
          </div>

          <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: CLR.border }}>
            <DifficultyStars level={course.difficulty} />
            <div className="flex items-center gap-4">
              <span className="text-[13px]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
                {course.duration}
              </span>
              <span className="text-[13px]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
                {course.modules} модулей
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[15px] leading-relaxed" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
              {course.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] tracking-wide px-3 py-1.5 rounded-full"
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

          {isLoggedIn && course.progress > 0 && (
            <div className="mb-6">
              <ProgressBar progress={course.progress} />
            </div>
          )}
        </>
      )}

      {/* === EXPANDED === */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header: illustration + meta/desc/tags */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="rounded-lg overflow-hidden" style={{ height: '240px' }}>
              <AnimatedIllustration index={illustrationIndex} />
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-5 pb-5 border-b" style={{ borderColor: CLR.border }}>
                <DifficultyStars level={course.difficulty} />
                <div className="flex items-center gap-4">
                  <span className="text-[13px]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
                    {course.duration}
                  </span>
                  <span className="text-[13px]" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
                    {course.modules} модулей
                  </span>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed mb-5" style={{ fontFamily: 'var(--font-content)', color: CLR.text }}>
                {course.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] tracking-wide px-3 py-1.5 rounded-full"
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

              {isLoggedIn && course.progress > 0 && (
                <ProgressBar progress={course.progress} />
              )}
            </div>
          </div>

          {/* Goal + Result — one row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div
              className="p-6 rounded-xl"
              style={{ border: `2px solid ${COLOR}`, backgroundColor: '#fff' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR }} />
                <h4
                  className="text-[15px] tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: COLOR }}
                >
                  Цель курса
                </h4>
              </div>
              <p
                className="text-[14px] leading-relaxed"
                style={{ fontFamily: 'var(--font-content)', color: CLR.text }}
              >
                {course.goal}
              </p>
            </div>

            <div
              className="p-6 rounded-xl"
              style={{ border: `2px solid ${HELP_COLOR}`, backgroundColor: '#fff' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: HELP_COLOR }} />
                <h4
                  className="text-[15px] tracking-wide"
                  style={{ fontFamily: 'var(--font-heading)', color: HELP_COLOR }}
                >
                  Результат обучения
                </h4>
              </div>
              <p
                className="text-[14px] leading-relaxed"
                style={{ fontFamily: 'var(--font-content)', color: CLR.text }}
              >
                {course.result}
              </p>
            </div>
          </div>

          {/* Modules — tabular list */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Программа курса
              </h3>
              <span
                className="text-[13px]"
                style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
              >
                {course.modulesList.length} модулей · {course.duration}
              </span>
            </div>

            {/* Table header */}
            <div
              className="border-b-2 mb-0"
              style={{ borderColor: CLR.base }}
            >
              <div
                className="grid items-center px-5 py-2"
                style={{
                  gridTemplateColumns: '40px 16px 1fr 100px 96px 104px',
                  gap: '28px',
                }}
              >
                <span className="text-[11px] tracking-widest" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>
                  №
                </span>
                <span />
                <span className="text-[11px] tracking-widest" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>
                  МОДУЛЬ
                </span>
                <span className="text-[11px] tracking-widest text-center" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>
                  УРОВЕНЬ
                </span>
                <span className="text-[11px] tracking-widest text-right" style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}>
                  ВРЕМЯ
                </span>
              </div>
            </div>

            {/* Table rows */}
            <div className="flex flex-col">
              {course.modulesList.map((mod, i) => {
                const isCompleted = i < completedModules;
                const isHovered = hoveredModule === i;
                const modTime = getModuleTime(course.difficulty, i);
                const modDiff = getModuleDifficulty(course.difficulty, i, course.modulesList.length);

                return (
                  <div
                    key={i}
                    className="transition-colors duration-150 cursor-default"
                    style={{
                      backgroundColor: isHovered ? COLOR : '#fff',
                      borderBottom: `1px solid ${CLR.border}`,
                    }}
                    onMouseEnter={() => setHoveredModule(i)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <div
                      className="grid items-center px-5 py-5"
                      style={{
                        gridTemplateColumns: '40px 16px 1fr 100px 96px 104px',
                        gap: '28px',
                      }}
                    >
                      {/* Number */}
                      <span
                        className="text-[13px] tabular-nums"
                        style={{
                          fontFamily: 'var(--font-content)',
                          color: isHovered ? '#fff' : (isCompleted ? COLOR : CLR.muted),
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Status dot */}
                      <div className="flex justify-center">
                        <div
                          className="w-3 h-3 rounded-full transition-colors duration-150"
                          style={{
                            backgroundColor: isHovered
                              ? '#fff'
                              : (isCompleted ? COLOR : CLR.border),
                          }}
                        />
                      </div>

                      {/* Title */}
                      <span
                        className="text-[14px] truncate transition-colors duration-150"
                        style={{
                          fontFamily: 'var(--font-content)',
                          color: isHovered ? '#fff' : CLR.text,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {mod}
                      </span>

                      {/* Difficulty stars */}
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((d) => (
                          <AccentStar
                            key={d}
                            color={
                              isHovered
                                ? (d <= modDiff ? '#fff' : 'rgba(255,255,255,0.3)')
                                : (d <= modDiff ? DIFFICULTY_COLOR : CLR.border)
                            }
                            size={14}
                          />
                        ))}
                      </div>

                      {/* Duration */}
                      <span
                        className="text-[12px] tabular-nums text-right transition-colors duration-150"
                        style={{
                          fontFamily: 'var(--font-content)',
                          color: isHovered ? '#fff' : CLR.muted,
                        }}
                      >
                        {modTime}
                      </span>

                      {/* Action button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/school/${course.id}`);
                        }}
                        className="px-3 py-1.5 rounded-full text-[12px] tracking-wide transition-colors duration-150 text-center"
                        style={{
                          fontFamily: 'var(--font-content)',
                          backgroundColor: isHovered ? '#fff' : 'transparent',
                          color: isHovered ? COLOR : COLOR,
                          border: `1.5px solid ${isHovered ? '#fff' : COLOR}`,
                        }}
                      >
                        {isCompleted ? 'Повторить' : 'Изучить'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: CLR.border }}>
        <button
          onClick={() => navigate(`/school/${course.id}`)}
          className="flex-1 px-6 py-3 rounded-full text-[15px] font-medium transition-colors duration-150"
          style={{
            fontFamily: 'var(--font-content)',
            backgroundColor: COLOR,
            color: '#fff',
            border: `2px solid ${COLOR}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FF5E0E';
            e.currentTarget.style.borderColor = '#FF5E0E';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLOR;
            e.currentTarget.style.borderColor = COLOR;
            e.currentTarget.style.color = '#fff';
          }}
        >
          {course.progress > 0 && isLoggedIn ? 'Продолжить' : 'Начать курс'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="px-6 py-3 rounded-full text-[15px] font-medium transition-colors duration-150"
          style={{
            fontFamily: 'var(--font-content)',
            backgroundColor: 'transparent',
            color: COLOR,
            border: `2px solid ${COLOR}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = HELP_COLOR;
            e.currentTarget.style.borderColor = HELP_COLOR;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = COLOR;
            e.currentTarget.style.color = COLOR;
          }}
        >
          {isExpanded ? 'Свернуть' : 'Подробнее'}
        </button>
      </div>
    </div>
  );
}