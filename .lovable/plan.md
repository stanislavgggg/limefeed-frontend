# CRO-переработка воронки канала

Цель — заменить «баннерную слепоту» из десятков одинаковых кнопок на сочетание постоянной точки входа (нижний таб-бар + экран-витрина канала) и контекстных триггеров. Бэкенд-контракт (`/api/*`) не меняется — все новые сигналы идут через существующий `postEvent` в `meta.surface`.

## 1. Нижний таб-бар: Feed / Live / Channel

Сейчас навигация — это верхний `FilterRail` с 4 вкладками (Hot/News/Live/Markets). Реструктурируем:

- Вводим состояние `section: "feed" | "live" | "channel"` в `src/routes/index.tsx`.
- **Новый `BottomNav.tsx`** — фиксированный нижний бар в iOS-стиле (glass, safe-area-inset снизу), 3 таба с иконками lucide: Feed (Newspaper), Live (Radio/Activity), Channel (Send/Sparkles). Активный таб подсвечивается лаймовым акцентом.
- **Feed** показывает существующие под-вкладки Hot / News / Markets (верхний `FilterRail` теряет «Live» и становится под-навигацией Feed; чипы категорий для News остаются).
- **Live** — отдельная секция (см. блок 2).
- **Channel** — новый экран-витрина (см. ниже).
- Клик по табу Channel логирует `cta_view`/`cta_tap` c `surface: "nav_channel_tab"` и открывает экран (НЕ сразу deep-link).
- Паддинги: контент получает нижний отступ под бар; sticky-CTA встают над баром.

## 2. Экран-витрина канала (`ChannelScreen.tsx`)

«Магазинная витрина» — даёт осмотреться без давления:

- Лого/маскот, имя канала и `@handle` (из `resolveBranding`), описание (tagline).
- 2–3 «закреплённых поста» — статичные иллюстративные карточки (заголовок + превью-строка).
- Соц-доказательство — статичные строки (по решению: без обращения к бэкенду), напр. «12 материалов сегодня», «подписчики растут».
- Крупная primary-кнопка **«Open in Telegram»** → `openChannel(cfg, "channel_screen")`.
- Фоновое тематическое изображение (сгенерируем новое в `src/assets/`, под блюром через `StageBackdrop`).

## 3. Live: убрать кнопку из-под каждой карточки

- **`LiveCard.tsx`**: удаляем нижнюю кнопку «Join» (источник CTA-усталости). Карточка остаётся информационной (счёт/статус), без повторяющегося призыва.
- **Pinned-карточка сверху** (`PinnedMatchCard.tsx`): hero-баннер по топ-матчу (первый live, иначе первый upcoming) с явным «Live commentary in channel →». Логирует `surface: "live_pinned"`.
- **Один sticky-CTA внизу Live** (`LiveStickyCTA`, по образцу `SubscribeBar`): появляется после скролла или ~N секунд на экране, встаёт над нижним баром. Логирует `surface: "live_sticky"`. Один сильный призыв вместо десяти слабых.

## 4. News: усилить точку лока

- Lock-стек остаётся (`LockedCard`).
- Sticky-CTA для News показывается **только когда юзер доскроллил до лок-стека** (IntersectionObserver на первом `LockedCard`), а не сразу. Surface `feed_lock_sticky`.
- В лок-стек добавляем 1 строку статичного соц-пруфа (напр. «читают сейчас · обновлено N мин назад» — время берём из реального `updated_at`, число читателей — иллюстративное).

## 5. Onboarding-handoff

- В конце онбординга добавляем мягкий шаг **«Join channel»** (skip-able) — отдельный второй экран после списка фич: маскот, короткий питч, кнопка «Open in Telegram» + «позже».
- Логирует `surface: "onboarding_join"`.

## 6. Аналитика

Все поверхности через существующий `postEvent('cta_view'|'cta_tap', { surface })`:
`nav_channel_tab`, `channel_screen`, `live_pinned`, `live_sticky`, `feed_lock` (есть), `feed_lock_sticky`, `onboarding_join`. Контракт не меняется — это строки в `meta`.

## Адаптивность

Проверим на 320 / 375 / 390 / 414px: нижний бар не наезжает на контент, sticky-CTA стекаются над баром корректно, экран канала и pinned-карточка не переполняются.

---

## Технические детали

- **`src/routes/index.tsx`**: добавить `section` state; маршрутизировать рендер между Feed/Live/Channel; перенести логику live в отдельную ветку; sticky-CTA News/Live привязать к секции; обновить нижние паддинги.
- **`FilterRail.tsx`**: убрать `live` из `TABS` (оставить hot/news/markets) — теперь это под-навигация Feed.
- **Новые файлы**: `src/components/app/BottomNav.tsx`, `ChannelScreen.tsx`, `cards/PinnedMatchCard.tsx`, (опц.) `LiveStickyCTA` внутри существующего паттерна `SubscribeBar` или отдельным компонентом.
- **`LiveCard.tsx`**: удалить кнопку и связанный `onCta`/`tap` per-card (пропсы подчистить в `index.tsx`).
- **`LockedCard.tsx`**: добавить строку соц-пруфа; первый экземпляр — цель IntersectionObserver (через ref/коллбэк в родителе).
- **`Onboarding.tsx`**: внутренний 2-шаговый стейт (features → join), `onSubscribe` ведёт на join-шаг, финал открывает канал.
- **`i18n.tsx`**: новые ключи (en/ru/es): `nav_feed`, `nav_live`, `nav_channel`, `channel_title`, `channel_desc`, `channel_open_tg`, `channel_social_*`, `channel_pinned_*`, `live_pinned_cta`, `live_sticky`/повтор `subscribe`, `lock_social_proof`, `onb_join_title`, `onb_join_sub`, `onb_join_cta`, `onb_join_skip`.
- **`funnel.ts`**: контракт без изменений; новые `surface`-строки — только в `meta`.
- **Изображение**: сгенерировать `src/assets/stage-channel.jpg` (тёмная лаймово-изумрудная финтех-витрина) для фона экрана канала.

## Что НЕ меняется

- Бэкенд-эндпоинты и контракт `funnel.ts`.
- Логика гейтинга membership и celebration-момент.
- Внешние ссылки в News-карточках (отдельный вопрос — в этой итерации не трогаем, т.к. не входит в 5 согласованных блоков; при желании вынесем отдельно).