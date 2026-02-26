# Код-ревью: practicumgroup

Оценка соответствия best practices, поддерживаемости и структуры кода.

---

## 1. Архитектура и структура проекта

### Плюсы
- Понятное разделение: `src/app` (приложение), `src/app/components` (компоненты), `src/imports` (артефакты Figma).
- Алиас `@` в Vite настроен на `./src`.
- UI-компоненты (shadcn-style) вынесены в `app/components/ui/`.

### Проблемы

| Проблема | Рекомендация |
|----------|--------------|
| **Нет `tsconfig.json`** в корне | Добавить `tsconfig.json` с `strict: true`, путями для `@/*`. |
| **Нет ESLint/Prettier** | Добавить ESLint и Prettier для единого стиля. |
| **Абсолютный импорт** `from '/utils/supabase/info'` в `help-content.tsx` | Путь работает (папка `utils` в корне проекта), но для единообразия лучше использовать `@/utils/supabase/info` или относительный путь. |
| **Дублирование папки `guidelines/`** | Удалить копию или оформить как отдельный подпроект. |
| **Данные (ARTICLES, COURSES, STORIES…) внутри компонентов** | Вынести в `src/data/` или `src/constants/`. |

---

## 2. Дублирование кода (DRY)

### Критично: палитра и константы

Один и тот же объект **CLR** и акцентные цвета повторяются в **7+ файлах**:
`App.tsx`, `triad-panel.tsx`, `home-page.tsx`, `media-content.tsx`, `school-content.tsx`, `course-card.tsx`, `help-content.tsx`.

**Рекомендация:** общий модуль `src/theme.ts`:

```ts
export const palette = {
  bg: '#F9F9F9',
  text: '#1B1D20',
  base: '#012168',
  border: 'rgba(1, 33, 104, 0.1)',
  muted: 'rgba(27, 29, 32, 0.45)',
} as const;

export const sectionColors = {
  help: '#069B93',
  school: '#1192E6',
  media: '#FF5E0E',
} as const;
```

Импортировать в компонентах вместо локальных `CLR`/`COLOR`. Свести конфиг секций (META в App, PANEL_CONFIG в triad-panel) к одному источнику.

---

## 3. Типизация (TypeScript)

### Плюсы
- TypeScript, интерфейсы, переиспользуемый `PanelId`.

### Проблемы
- Нет общих типов для домена: завести `src/types/` с `Article`, `Course`, `HelpStory`.
- Тип курса дублируется в `CourseCardProps` и в данных — один интерфейс `Course` в `types/course.ts`.

---

## 4. Размер и ответственность компонентов

| Файл | Строк | Рекомендация |
|------|-------|--------------|
| `App.tsx` | 875 | Вынести TriadCore и логику баров в `TriadLayout.tsx`, в App оставить роутинг. |
| `school-content.tsx` | 1408 | Разнести: данные в `data/courses.ts`, AnimatedIllustration, DifficultyStars, ProgressBar — в отдельные файлы; страницы — по файлам. |
| `help-content.tsx` | 1560 | Каждую секцию (Hero, Stories, Specialists…) в отдельный файл в `help-content/sections/`. |
| `course-card.tsx` | 483 | Таблицу модулей — в `CourseModulesTable`; убрать прямое изменение `e.currentTarget.style`, перейти на state/классы. |

---

## 5. Стилизация

- Смешаны inline `style` и Tailwind; в theme.css есть переменные, но много жёстких hex в JS.
- Рекомендация: по возможности использовать классы Tailwind от темы и переменные из theme.css; inline — только для динамики. Вынести частые комбинации (fontContent, fontHeading) в константы или утилиты.

---

## 6. Точечные замечания

- **course-card.tsx:** кнопки с `onMouseEnter`/`onMouseLeave` меняют стили через `e.currentTarget.style.*` — заменить на state + классы/стили.
- **Опечатка:** «расстройтсво» → «расстройство» в `Frame102.tsx` и `Frame104.tsx` (в 404-экран в `media-content.tsx` уже написано верно).
- **Магические числа:** высоты 64, 129, 220 и пороги анимаций вынести в именованные константы.
- **Auth:** при росте логики — вынести в контекст (AuthContext) вместо пропса `isLoggedIn`.

---

## 7. Безопасность и конфигурация

- Supabase `projectId` и `publicAnonKey` в коде — вынести в `import.meta.env.VITE_*`.
- API_BASE в help-content собирать из env (например, `VITE_FUNCTIONS_URL`).

---

## 8. Доступность (a11y)

- Добавить `aria-label` там, где текст кнопки/контрола неочевиден.
- Проверить фокус и табуляцию на 404 и ключевых CTA.
- Аудиоплеер: подписи для скринридеров («воспроизведение», «пауза»).

---

## 9. Производительность

- При росте списков — виртуализация (например, react-virtual).
- При лагах анимаций — упрощение или отключение по `prefers-reduced-motion`.

---

## 10. Зависимости

- Добавить `react` и `react-dom` в `dependencies` (сейчас только в peerDependencies).
- Проверить неиспользуемые UI-пакеты и при возможности убрать для уменьшения бандла.

---

## 11. Приоритеты

| Приоритет | Действие |
|-----------|----------|
| Высокий | Общий модуль темы (palette + sectionColors), убрать дубли CLR/COLOR. |
| Высокий | Заменить импорт `from '/utils/supabase/info'` на `@/` или относительный путь (сейчас путь рабочий, но для единообразия). |
| Высокий | Вынести ARTICLES, COURSES, STORIES и типы в отдельные модули. |
| Средний | Разбить App.tsx, school-content, help-content на меньшие компоненты. |
| Средний | Убрать манипуляции style в course-card, использовать state. |
| Средний | Добавить tsconfig.json, ESLint (и при желании Prettier). |
| Низкий | Supabase через env; доработки a11y; виртуализация при необходимости. |

Код читаемый и логично разделён по разделам. Централизация темы и данных плюс разбиение крупных файлов упростят поддержку и развитие проекта.
