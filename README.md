# ОГЭ Математика — Telegram Mini App

Тренажёр для подготовки к ОГЭ по математике (9 класс).
MVP: Задание №6 — Дроби и степени.

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Telegram-бот

Бот: **TODO** (будет добавлен позже)

### Настройка бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. `/newbot` — создайте бота, задайте имя и username
3. Сохраните токен бота (понадобится позже для деплоя)
4. `/mybots` → выберите бота → **Bot Settings** → **Menu Button** → укажите URL приложения
5. Или: `/mybots` → **Web App** → **Configure Mini App** → укажите URL

### Локальное тестирование через ngrok

1. Установите [ngrok](https://ngrok.com/) и авторизуйтесь:

```bash
npx ngrok config add-authtoken YOUR_TOKEN
```

2. Запустите туннель:

```bash
npx ngrok http 5173
```

3. Скопируйте HTTPS-ссылку (например, `https://xxxx.ngrok-free.dev`) и укажите её в BotFather.

4. Откройте бота и нажмите кнопку меню — приложение загрузится внутри Telegram.

## Сборка

```bash
npm run build
```

Собранные файлы будут в папке `dist/`.

## Стек

- Vite + React + TypeScript
- Tailwind CSS
- KaTeX (рендер формул)
- Telegram WebApp SDK
