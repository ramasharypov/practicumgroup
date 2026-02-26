import { useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AccentStar } from './accent-star';
import { PracticumLogo } from './practicum-logos';
import { CourseCard } from './course-card';

const COLOR = '#1192E6';

const CLR = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
};

const DIFFICULTY_COLOR = '#FF5E0E'; // MEDIA color for difficulty stars
const HELP_COLOR = '#069B93'; // HELP color for detail button hover

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Начальный',
  2: 'Базовый',
  3: 'Средний',
  4: 'Продвинутый',
  5: 'Экспертный',
};

// Animated SVG illustration component
const AnimatedIllustration = memo(function AnimatedIllustration({ index }: { index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const patterns = [
    // Pattern 0 - Flowing curves
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.path 
          d="M0,100 Q100,20 200,100 T400,100 L400,200 L0,200 Z" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, 15, -10, 20, 0],
            y: [0, -8, 5, -12, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M0,120 Q150,60 300,120 T600,120 L600,200 L0,200 Z" 
          fill="#012168"
          animate={isHovered ? {
            x: [0, -18, 12, -15, 0],
            y: [0, 10, -6, 8, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="80" cy="80" r="40" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 25, -15, 30, 0],
            y: [0, -20, 12, -25, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="320" cy="130" r="30" 
          fill="#FF5E0E"
          animate={isHovered ? {
            x: [0, -22, 18, -28, 0],
            y: [0, 15, -10, 20, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.4 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 1 - Geometric shapes
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.rect 
          x="20" y="40" width="100" height="100" 
          fill="#1192E6" rx="12"
          animate={isHovered ? {
            x: [0, 28, -18, 32, 0],
            y: [0, -15, 10, -20, 0],
            rotate: [0, 5, -3, 8, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ 
            duration: isHovered ? 3.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.rect 
          x="150" y="80" width="80" height="80" 
          fill="#012168" rx="8"
          animate={isHovered ? {
            x: [0, -20, 15, -25, 0],
            y: [0, 22, -12, 18, 0],
            rotate: [0, -6, 4, -8, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ 
            duration: isHovered ? 4.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="340" cy="100" r="50" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 30, -20, 35, 0],
            y: [0, -28, 18, -32, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M250,50 L300,150 L200,150 Z" 
          fill="#FF5E0E"
          animate={isHovered ? {
            x: [0, -25, 18, -30, 0],
            y: [0, 12, -8, 15, 0],
            rotate: [0, 8, -5, 10, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ 
            duration: isHovered ? 3.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 2 - Organic waves
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.path 
          d="M0,80 C100,40 200,120 400,80 L400,200 L0,200 Z" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, 22, -15, 25, 0],
            y: [0, -18, 10, -22, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M0,140 C120,100 280,160 400,130 L400,200 L0,200 Z" 
          fill="#012168"
          animate={isHovered ? {
            x: [0, -25, 18, -28, 0],
            y: [0, 12, -8, 15, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 4.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.ellipse 
          cx="200" cy="60" rx="60" ry="40" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 28, -20, 32, 0],
            y: [0, -25, 15, -30, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 3 - Scattered circles
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.circle 
          cx="60" cy="60" r="35" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, 20, -15, 25, 0],
            y: [0, -18, 12, -22, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="180" cy="120" r="45" 
          fill="#012168"
          animate={isHovered ? {
            x: [0, -28, 20, -32, 0],
            y: [0, 22, -15, 25, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.4 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="320" cy="70" r="40" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 32, -22, 35, 0],
            y: [0, -28, 18, -32, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="250" cy="150" r="30" 
          fill="#FF5E0E"
          animate={isHovered ? {
            x: [0, -18, 12, -22, 0],
            y: [0, 15, -10, 18, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="120" cy="140" r="25" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, 22, -15, 28, 0],
            y: [0, -12, 8, -15, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 4.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 4 - Linear grid
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.line 
          x1="0" y1="50" x2="400" y2="50" 
          stroke="#1192E6" strokeWidth="2"
          animate={isHovered ? {
            x: [0, 35, -25, 40, 0],
            y: [0, 8, -5, 10, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.line 
          x1="0" y1="100" x2="400" y2="100" 
          stroke="#012168" strokeWidth="3"
          animate={isHovered ? {
            x: [0, -30, 22, -35, 0],
            y: [0, -6, 4, -8, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.line 
          x1="0" y1="150" x2="400" y2="150" 
          stroke="#1192E6" strokeWidth="2"
          animate={isHovered ? {
            x: [0, 32, -20, 38, 0],
            y: [0, 10, -6, 12, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 4.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.rect 
          x="50" y="60" width="80" height="80" 
          fill="#069B93" rx="8"
          animate={isHovered ? {
            x: [0, -22, 15, -28, 0],
            y: [0, 18, -12, 22, 0],
            rotate: [0, -5, 3, -8, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ 
            duration: isHovered ? 3.4 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.rect 
          x="270" y="40" width="60" height="100" 
          fill="#FF5E0E" rx="6"
          animate={isHovered ? {
            x: [0, 25, -18, 30, 0],
            y: [0, -20, 12, -25, 0],
            rotate: [0, 6, -4, 8, 0],
          } : { x: 0, y: 0, rotate: 0 }}
          transition={{ 
            duration: isHovered ? 2.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 5 - Diagonal composition
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.path 
          d="M0,0 L200,200 L0,200 Z" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, -25, 18, -30, 0],
            y: [0, 12, -8, 15, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M200,0 L400,200 L200,200 Z" 
          fill="#012168"
          animate={isHovered ? {
            x: [0, 25, -18, 30, 0],
            y: [0, -12, 8, -15, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 4.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="100" cy="100" r="40" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 32, -22, 38, 0],
            y: [0, -28, 18, -35, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="300" cy="100" r="35" 
          fill="#FF5E0E"
          animate={isHovered ? {
            x: [0, -30, 22, -35, 0],
            y: [0, 25, -15, 28, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 6 - Flowing ribbons
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.path 
          d="M0,60 Q100,20 200,60 T400,60" 
          stroke="#1192E6" strokeWidth="20" fill="none"
          animate={isHovered ? {
            x: [0, 25, -18, 30, 0],
            y: [0, -20, 12, -25, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.2 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M0,120 Q150,80 300,120 T600,120" 
          stroke="#012168" strokeWidth="25" fill="none"
          animate={isHovered ? {
            x: [0, -28, 20, -32, 0],
            y: [0, 15, -10, 18, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.path 
          d="M0,160 Q80,140 160,160 T320,160" 
          stroke="#FF5E0E" strokeWidth="15" fill="none"
          animate={isHovered ? {
            x: [0, 32, -22, 35, 0],
            y: [0, -22, 15, -28, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
    // Pattern 7 - Minimal dots
    () => (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <motion.circle 
          cx="80" cy="100" r="50" 
          fill="#1192E6"
          animate={isHovered ? {
            x: [0, -28, 20, -32, 0],
            y: [0, 22, -15, 25, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.4 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="200" cy="80" r="60" 
          fill="#012168"
          animate={isHovered ? {
            x: [0, 25, -18, 30, 0],
            y: [0, -28, 18, -32, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 2.8 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="320" cy="120" r="45" 
          fill="#069B93"
          animate={isHovered ? {
            x: [0, 32, -22, 35, 0],
            y: [0, -20, 15, -25, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.0 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
        <motion.circle 
          cx="140" cy="140" r="30" 
          fill="#FF5E0E"
          animate={isHovered ? {
            x: [0, -25, 18, -28, 0],
            y: [0, 18, -12, 22, 0],
          } : { x: 0, y: 0 }}
          transition={{ 
            duration: isHovered ? 3.6 : 0.4,
            repeat: isHovered ? Infinity : 0,
            ease: isHovered ? "easeInOut" : "easeOut"
          }}
        />
      </svg>
    ),
  ];

  const Pattern = patterns[index % patterns.length];
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-full"
    >
      {Pattern()}
    </div>
  );
});

export const COURSES = [
  {
    id: 'cbt-basics',
    title: 'Основы КПТ',
    subtitle: 'Когнитивно-поведенческая терапия',
    difficulty: 2,
    duration: '6 недель',
    modules: 12,
    tags: ['Тревога', 'Депрессия', 'Практика'],
    progress: 34,
    favorite: true,
    description: 'Как мысли создают эмоции и поведение. Конкретные техники работы с деструктивными паттернами.',
    goal: 'Научиться распознавать и изменять деструктивные мыслительные паттерны, управлять эмоциями через когнитивное переструктурирование.',
    result: 'Вы овладеете базовыми техниками КПТ, сможете самостоятельно работать с тревогой и депрессивными состояниями, применять методы поведенческой активации.',
    modulesList: [
      'Введение в когнитивную модель',
      'ABC-схема: события, мысли, эмоции',
      'Автоматические мысли и их фиксация',
      'Когнитивные искажения',
      'Сократический диалог',
      'Проверка реальностью',
      'Поведенческая активация',
      'Градуированные задания',
      'Работа с избеганием',
      'Экспозиция in vivo',
      'Профилактика рецидивов',
      'Интеграция и план на будущее',
    ],
  },
  {
    id: 'trauma-recovery',
    title: 'Работа с травмой',
    subtitle: 'От выживания к жизни',
    difficulty: 4,
    duration: '8 недель',
    modules: 16,
    tags: ['ПТСР', 'Травма', 'Телесность'],
    progress: 0,
    favorite: false,
    description: 'Травма живёт в теле. Методы освобождения от застывших реакций — EMDR, соматика, нейробиология.',
    goal: 'Понять нейробиологию травмы, освоить методы работы с телесными проявлениями ПТСР, восстановить чувство безопасности.',
    result: 'Снижение симптомов ПТСР, восстановление способности к саморегуляции, интеграция травматического опыта через соматические и когнитивные техники.',
    modulesList: [
      'Нейробиология травмы',
      'Окно толерантности',
      'Телесные маркеры безопасности',
      'Ресурсные состояния',
      'Заземление и ориентация',
      'Работа с диссоциацией',
      'Введение в EMDR',
      'Двусторонняя стимуляция',
      'Обработка травматических воспоминаний',
      'Соматическое переживание',
      'Работа с застывшими реакциями',
      'Восстановление границ',
      'Нарративная интеграция',
      'Посттравматический рост',
      'Работа с близкими',
      'Жизнь после травмы',
    ],
  },
  {
    id: 'mindfulness',
    title: 'Практика осознанности',
    subtitle: 'MBSR',
    difficulty: 1,
    duration: '8 недель',
    modules: 8,
    tags: ['Стресс', 'Тревога', 'Медитация'],
    progress: 87,
    favorite: true,
    description: 'Программа снижения стресса через осознанность. Без эзотерики — чистая нейронаука.',
    goal: 'Развить навык осознанного присутствия, снизить реактивность на стресс, научиться наблюдать опыт без автоматических реакций.',
    result: 'Устойчивое снижение уровня стресса, улучшение эмоциональной регуляции, развитие метакогнитивной осознанности, стабильная практика медитации.',
    modulesList: [
      'Автопилот и осознанность',
      'Восприятие и реальность',
      'Пребывание в теле',
      'Стресс-реакция vs стресс-отклик',
      'Автоматичность и выбор',
      'Мысли — это не факты',
      'Забота о себе',
      'Интеграция в жизнь',
    ],
  },
  {
    id: 'emotion-regulation',
    title: 'Регуляция эмоций',
    subtitle: 'DBT навыки',
    difficulty: 3,
    duration: '10 недель',
    modules: 20,
    tags: ['ПРЛ', 'Эмоции', 'Навыки'],
    progress: 12,
    favorite: false,
    description: 'Диалектическая поведенческая терапия. Как управлять интенсивными эмоциями без разрушения.',
    goal: 'Овладеть четырьмя модулями DBT: осознанность, стрессоустойчивость, эмоциональная регуляция, межличностная эффективность.',
    result: 'Способность переносить дистресс без деструктивного поведения, навыки управления интенсивными эмоциями, улучшение отношений.',
    modulesList: [
      'Диалектическое мышление',
      'Осознанность: «Что» навыки',
      'Осознанность: «Как» навыки',
      'Модель эмоций',
      'Функции эмоций',
      'Снижение уязвимости (PLEASE)',
      'Накопление позитивного опыта',
      'Opposite Action',
      'Самоуспокоение через 5 чувств',
      'IMPROVE момента',
      'TIP навыки',
      'Radical Acceptance',
      'DEAR MAN',
      'GIVE навыки',
      'FAST навыки',
      'Валидация',
      'Walking the Middle Path',
      'Цепной анализ',
      'Управление кризисами',
      'Построение жизни, ради которой стоит жить',
    ],
  },
  {
    id: 'sleep-restoration',
    title: 'Восстановление сна',
    subtitle: 'CBT-I',
    difficulty: 2,
    duration: '4 недели',
    modules: 8,
    tags: ['Бессонница', 'Сон', 'КПТ'],
    progress: 0,
    favorite: true,
    description: 'Когнитивно-поведенческая терапия бессонницы. Эффективнее снотворных, без побочек.',
    goal: 'Восстановить здоровый паттерн сна через изменение убеждений и поведения, связанного со сном.',
    result: 'Засыпание менее чем за 20 минут, консолидированный сон, отказ от снотворных, устойчивый циркадный ритм.',
    modulesList: [
      'Физиология сна',
      'Дневник сна и оценка',
      'Гигиена сна',
      'Контроль стимулов',
      'Ограничение сна',
      'Когнитивная реструктуризация',
      'Релаксационные техники',
      'Профилактика и поддержание',
    ],
  },
  {
    id: 'relationship-patterns',
    title: 'Паттерны отношений',
    subtitle: 'Схема-терапия',
    difficulty: 4,
    duration: '12 недель',
    modules: 24,
    tags: ['Отношения', 'Привязанность', 'Схемы'],
    progress: 56,
    favorite: false,
    description: 'Глубинные схемы, которые саботируют близость. Работа с детскими ранаи через схема-терапию.',
    goal: 'Выявить ранние дезадаптивные схемы, понять их происхождение, развить здоровые способы удовлетворения потребностей.',
    result: 'Осознание паттернов выбора партнёров, изменение деструктивных копинг-стратегий, развитие secure attachment.',
    modulesList: [
      'Введение в схема-терапию',
      '18 ранних дезадаптивных схем',
      'Схемы отвержения и разъединения',
      'Схемы нарушенной автономии',
      'Схемы нарушенных границ',
      'Схемы направленности на других',
      'Схемы гиперконтроля',
      'Базовые эмоциональные потребности',
      'Режимы схем',
      'Уязвимый ребёнок',
      'Разгневанный ребёнок',
      'Импульсивный ребёнок',
      'Счастливый ребёнок',
      'Дисфункциональные родители',
      'Дисфункциональные копинги',
      'Здоровый взрослый',
      'Ограниченное перевоспитание',
      'Эмпатическая конфронтация',
      'Работа с imagery',
      'Письма родителям',
      'Поведенческие паттерн-брейки',
      'Терапевтические отношения',
      'Романтические отношения',
      'Интеграция и завершение',
    ],
  },
  {
    id: 'anxiety-mastery',
    title: 'Работа с тревогой',
    subtitle: 'Экспозиция и принятие',
    difficulty: 3,
    duration: '8 недель',
    modules: 16,
    tags: ['Тревога', 'Паника', 'ОКР'],
    progress: 0,
    favorite: false,
    description: 'Не борьба с тревогой, а проход сквозь неё. Экспозиция, ACT, конкретные протоколы.',
    goal: 'Освоить экспозиционные техники, научиться принимать тревогу без избегания, снизить функциональные нарушения.',
    result: 'Расширение поведенческого репертуара, снижение избегания, способность действовать при наличии тревоги.',
    modulesList: [
      'Нейробиология тревоги',
      'Цикл тревоги и избегания',
      'Иерархия страхов',
      'Градуированная экспозиция',
      'Интероцептивная экспозиция',
      'Экспозиция с предотвращением реакции (для ОКР)',
      'Когнитивная дефузия',
      'Принятие и готовность',
      'Ценности vs цели',
      'Committed Action',
      'Работа с паническими атаками',
      'Социальная тревога',
      'Генерализованное тревожное расстройство',
      'Обсессивно-компульсивное расстройство',
      'Работа с рецидивами',
      'Жизнь с тревогой',
    ],
  },
  {
    id: 'self-compassion',
    title: 'Самосострадание',
    subtitle: 'Против самокритики',
    difficulty: 1,
    duration: '6 недель',
    modules: 6,
    tags: ['Самооценка', 'Перфекционизм', 'Практика'],
    progress: 100,
    favorite: true,
    description: 'Как перестать быть своим худшим врагом. Практические техники самосострадания.',
    goal: 'Развить способность относиться к себе с добротой, принимать несовершенство, признавать общность человеческого опыта.',
    result: 'Снижение самокритики и стыда, повышение эмоциональной устойчивости, развитие внутренней поддерживающей позиции.',
    modulesList: [
      'Три компонента самосострадания',
      'Распознавание внутреннего критика',
      'Практика доброты к себе',
      'Общность человеческого опыта',
      'Осознанность vs избыточная идентификация',
      'Интеграция в повседневную жизнь',
    ],
  },
];

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <AccentStar
            key={star}
            color={star <= level ? DIFFICULTY_COLOR : CLR.muted}
            size={16}
            style={{ opacity: star <= level ? 1 : 0.6 }}
          />
        ))}
      </div>
      <span
        className="text-[13px] tracking-wide font-medium"
        style={{ 
          fontFamily: 'var(--font-content)', 
          color: DIFFICULTY_COLOR,
        }}
      >
        {DIFFICULTY_LABELS[level]}
      </span>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[11px] tracking-wide"
          style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
        >
          Прогресс
        </span>
        <span
          className="text-[11px] tabular-nums"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          {progress}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: CLR.border }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${progress}%`,
            backgroundColor: COLOR,
          }}
        />
      </div>
    </div>
  );
}

interface SchoolContentProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

export function SchoolContent({ isLoggedIn, onLoginClick, onProfileClick }: SchoolContentProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(COURSES.filter((c) => c.favorite).map((c) => c.id))
  );
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = (courseId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const handleToggleExpand = (courseId: string) => {
    if (expandedCourse === courseId) {
      // Закрытие текущей карточки
      setExpandedCourse(null);
      window.scrollTo({ top: savedScrollPosition, behavior: 'smooth' });
    } else if (expandedCourse) {
      // Переключение с одной раскрытой на другую —
      // НЕ перезаписываем savedScrollPosition (храним оригинальную позицию до любого expand)
      setExpandedCourse(courseId);
      
      // Больший delay: старая карточка коллапсирует + swap меняется + новая раскрывается
      setTimeout(() => {
        const cardElement = document.getElementById(`course-card-${courseId}`);
        if (cardElement) {
          const topOffset = 64 + 24;
          const elementPosition = cardElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - topOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 500);
    } else {
      // Первое раскрытие — сохраняем позицию скролла
      setSavedScrollPosition(window.scrollY);
      setExpandedCourse(courseId);
      
      setTimeout(() => {
        const cardElement = document.getElementById(`course-card-${courseId}`);
        if (cardElement) {
          const topOffset = 64 + 24;
          const elementPosition = cardElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - topOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 400);
    }
  };

  const allTags = ['Все', ...Array.from(new Set(COURSES.flatMap((c) => c.tags)))];
  
  const filtered = COURSES.filter((course) => {
    const matchesTag = !filter || filter === 'Все' || course.tags.includes(filter);
    const matchesFavorite = !showFavoritesOnly || course.favorite;
    return matchesTag && matchesFavorite;
  });

  // Рекомендации на основе прогресса
  const inProgress = COURSES.filter((c) => c.progress > 0 && c.progress < 100);
  const recommended = COURSES.filter((c) => c.progress === 0 && !c.favorite).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="h-[calc(100vh-129px)] flex flex-col justify-between px-10 py-16 lg:px-24 lg:py-20">
        <PracticumLogo
          id="school"
          height={160}
          style={{ color: '#1B1D20' }}
        />
        <div>
          <h2
            className="text-4xl lg:text-6xl tracking-tight max-w-4xl"
            style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
          >
            Формирование<br />
            <span style={{ color: COLOR }}>клинического</span> мышления
          </h2>
          <p className="mt-8 text-lg lg:text-2xl leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}>
            Доказательные методы, критическое мышление, практические навыки.
          </p>
        </div>
      </div>

      {/* Content section */}
      <div className="px-10 py-16 lg:px-24 lg:py-20">
        {/* User section (если залогинен) */}
        {isLoggedIn && inProgress.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl lg:text-3xl tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Продолжить обучение
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {inProgress.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/school/${course.id}`)}
                  className="text-left p-6 rounded-xl border-2 transition-all hover:border-opacity-100"
                  style={{ borderColor: `${COLOR}40` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-xl"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {course.title}
                    </h3>
                    {course.favorite && (
                      <AccentStar color={COLOR} size={12} />
                    )}
                  </div>
                  <ProgressBar progress={course.progress} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Рекомендации (если есть) */}
        {isLoggedIn && recommended.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl lg:text-3xl tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Рекомендации для вас
            </h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {recommended.map((course) => (
                <div
                  key={course.id}
                  className="p-6 rounded-xl border-2"
                  style={{ borderColor: CLR.border }}
                >
                  <DifficultyStars level={course.difficulty} />
                  <h3
                    className="text-lg mt-3 mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {course.title}
                  </h3>
                  <p
                    className="text-[14px] mb-4"
                    style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
                  >
                    {course.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] tracking-wide px-2 py-1 rounded-full"
                        style={{
                          fontFamily: 'var(--font-content)',
                          color: COLOR,
                          backgroundColor: `${COLOR}15`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag === 'Все' ? null : tag)}
                className="px-4 py-2 rounded-full text-[13px] tracking-wide transition-all"
                style={{
                  fontFamily: 'var(--font-content)',
                  backgroundColor: (filter === tag || (tag === 'Все' && !filter)) ? COLOR : 'transparent',
                  color: (filter === tag || (tag === 'Все' && !filter)) ? '#fff' : '#1B1D20',
                  border: `2px solid ${(filter === tag || (tag === 'Все' && !filter)) ? COLOR : CLR.border}`,
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {isLoggedIn && (
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] tracking-wide transition-all"
              style={{
                fontFamily: 'var(--font-content)',
                backgroundColor: showFavoritesOnly ? COLOR : 'transparent',
                color: showFavoritesOnly ? '#fff' : '#1B1D20',
                border: `2px solid ${showFavoritesOnly ? COLOR : CLR.border}`,
              }}
            >
              <AccentStar color={showFavoritesOnly ? '#fff' : COLOR} size={10} />
              Избранное
            </button>
          )}
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" ref={gridRef}>
          {(() => {
            const expandedIdx = expandedCourse
              ? filtered.findIndex(c => c.id === expandedCourse)
              : -1;

            // Build flat render order:
            // before pair | expanded | displaced neighbor | after pair
            let ordered: typeof filtered;

            if (expandedIdx === -1) {
              ordered = filtered;
            } else {
              const pairStart = expandedIdx - (expandedIdx % 2);
              const before = filtered.slice(0, pairStart);
              const expandedCard = filtered[expandedIdx];
              const neighborIdx = expandedIdx % 2 === 0 ? expandedIdx + 1 : expandedIdx - 1;
              const neighbor = neighborIdx >= 0 && neighborIdx < filtered.length
                ? filtered[neighborIdx]
                : null;
              const afterPair = filtered.slice(pairStart + 2);
              ordered = [
                ...before,
                expandedCard,
                ...(neighbor ? [neighbor] : []),
                ...afterPair,
              ];
            }

            return ordered.map((course) => {
              const isExpanded = expandedCourse === course.id;
              return (
                <div
                  key={course.id}
                  style={isExpanded ? { gridColumn: '1 / -1' } : undefined}
                >
                  <CourseCard
                    course={course}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    isLoggedIn={isLoggedIn}
                    isExpanded={isExpanded}
                    onToggleExpand={() => handleToggleExpand(course.id)}
                    illustrationIndex={COURSES.indexOf(course)}
                    AnimatedIllustration={AnimatedIllustration}
                    DifficultyStars={DifficultyStars}
                    ProgressBar={ProgressBar}
                  />
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

export function CoursePage({ 
  courseId, 
  onBack,
  isLoggedIn,
}: { 
  courseId: string; 
  onBack: () => void;
  isLoggedIn: boolean;
}) {
  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-10">
        <p style={{ fontFamily: 'var(--font-content)' }}>Курс не найден</p>
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
        <span>←</span> Все курсы
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <DifficultyStars level={course.difficulty} />
        <h1
          className="text-4xl lg:text-6xl tracking-tight mt-4 mb-4"
          style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
        >
          {course.title}
        </h1>
        <p
          className="text-xl lg:text-2xl leading-relaxed mb-8"
          style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
        >
          {course.subtitle}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-6 mb-12">
          <span
            className="text-base"
            style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
          >
            {course.duration}
          </span>
          <span
            className="text-base"
            style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
          >
            {course.modules} модулей
          </span>
        </div>

        {/* Progress (если залогинен) */}
        {isLoggedIn && course.progress > 0 && (
          <div className="mb-12">
            <ProgressBar progress={course.progress} />
          </div>
        )}

        {/* Description */}
        <p
          className="text-lg leading-relaxed mb-12"
          style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
        >
          {course.description}
        </p>

        {/* Modules preview */}
        <div className="space-y-4 mb-12">
          <h2
            className="text-2xl lg:text-3xl tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Программа курса
          </h2>
          {Array.from({ length: Math.min(course.modules, 5) }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border-2"
              style={{ borderColor: i < (course.progress / 100) * course.modules ? COLOR : CLR.border }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-base"
                  style={{ fontFamily: 'var(--font-content)' }}
                >
                  Модуль {i + 1}
                </span>
                {i < (course.progress / 100) * course.modules && (
                  <span
                    className="text-[12px] tracking-wide px-3 py-1 rounded-full"
                    style={{
                      fontFamily: 'var(--font-content)',
                      color: '#fff',
                      backgroundColor: COLOR,
                    }}
                  >
                    Пройдено
                  </span>
                )}
              </div>
            </div>
          ))}
          {course.modules > 5 && (
            <p
              className="text-[14px] text-center"
              style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
            >
              И ещё {course.modules - 5} модулей
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          className="w-full px-8 py-4 rounded-full text-base transition-all"
          style={{
            fontFamily: 'var(--font-content)',
            backgroundColor: COLOR,
            color: '#fff',
          }}
        >
          {isLoggedIn && course.progress > 0 ? 'Продолжить обучение' : 'Начать курс'}
        </button>
      </div>
    </div>
  );
}

export function ProfilePage({ 
  onBack, 
  onLogout,
}: { 
  onBack: () => void;
  onLogout: () => void;
}) {
  const completedCourses = COURSES.filter((c) => c.progress === 100);
  const inProgressCourses = COURSES.filter((c) => c.progress > 0 && c.progress < 100);
  const totalProgress = Math.round(
    COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
  );

  return (
    <div className="min-h-screen px-10 py-16 lg:px-24 lg:py-20">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 text-base transition-colors flex items-center gap-2"
        style={{ fontFamily: 'var(--font-content)', color: COLOR }}
      >
        <span>←</span> Назад
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1
              className="text-4xl lg:text-6xl tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-heading)', lineHeight: 1.05 }}
            >
              Ваш профиль
            </h1>
            <p
              className="text-lg"
              style={{ fontFamily: 'var(--font-content)', color: CLR.muted }}
            >
              student@practicum.group
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-full text-[14px] transition-all"
            style={{
              fontFamily: 'var(--font-content)',
              color: CLR.muted,
              border: `2px solid ${CLR.border}`,
            }}
          >
            Выйти
          </button>
        </div>

        {/* Stats */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <div
            className="p-6 rounded-xl border-2"
            style={{ borderColor: COLOR }}
          >
            <span
              className="text-4xl lg:text-5xl block mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: COLOR }}
            >
              {totalProgress}%
            </span>
            <span
              className="text-[14px]"
              style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
            >
              Общий прогресс
            </span>
          </div>

          <div
            className="p-6 rounded-xl border-2"
            style={{ borderColor: CLR.border }}
          >
            <span
              className="text-4xl lg:text-5xl block mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: COLOR }}
            >
              {completedCourses.length}
            </span>
            <span
              className="text-[14px]"
              style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
            >
              Завершённых курсов
            </span>
          </div>

          <div
            className="p-6 rounded-xl border-2"
            style={{ borderColor: CLR.border }}
          >
            <span
              className="text-4xl lg:text-5xl block mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: COLOR }}
            >
              {inProgressCourses.length}
            </span>
            <span
              className="text-[14px]"
              style={{ fontFamily: 'var(--font-content)', color: '#1B1D20' }}
            >
              В процессе
            </span>
          </div>
        </div>

        {/* Completed courses */}
        {completedCourses.length > 0 && (
          <div className="mb-12">
            <h2
              className="text-2xl lg:text-3xl tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Завершённые курсы
            </h2>
            <div className="space-y-4">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-5 rounded-xl border-2"
                  style={{ borderColor: COLOR }}
                >
                  <div>
                    <h3
                      className="text-lg mb-1"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {course.title}
                    </h3>
                    <DifficultyStars level={course.difficulty} />
                  </div>
                  <AccentStar color={COLOR} size={16} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In progress */}
        {inProgressCourses.length > 0 && (
          <div>
            <h2
              className="text-2xl lg:text-3xl tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              В процессе
            </h2>
            <div className="space-y-4">
              {inProgressCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-xl border-2"
                  style={{ borderColor: CLR.border }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {course.title}
                    </h3>
                    {course.favorite && <AccentStar color={COLOR} size={14} />}
                  </div>
                  <ProgressBar progress={course.progress} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}