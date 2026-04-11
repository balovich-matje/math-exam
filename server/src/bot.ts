import { BOT_TOKEN } from './config.js'

const API = `https://api.telegram.org/bot${BOT_TOKEN}`
const WEB_APP_URL = 'https://balovich-matje.github.io/math-exam/'

async function tgApi(method: string, body?: Record<string, unknown>) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

/** Set up bot commands and menu button */
export async function setupBot() {
  // Set commands
  await tgApi('setMyCommands', {
    commands: [
      { command: 'start', description: 'Начать подготовку к ОГЭ' },
      { command: 'help', description: 'Помощь' },
    ],
  })

  // Set menu button → opens WebApp
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Открыть приложение',
      web_app: { url: WEB_APP_URL },
    },
  })

  console.log('Bot commands and menu button configured')
}

/** Simple webhook-free polling for /start and /help */
let lastUpdateId = 0

export async function pollUpdates() {
  try {
    const data = await tgApi('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30,
      allowed_updates: ['message'],
    }) as { ok: boolean; result: any[] }

    if (!data.ok || !data.result) return

    for (const update of data.result) {
      lastUpdateId = update.update_id
      const msg = update.message
      if (!msg?.text) continue

      const chatId = msg.chat.id
      const text = msg.text

      if (text === '/start') {
        await tgApi('sendMessage', {
          chat_id: chatId,
          text: '📐 *ОГЭ Математика 2026*\n\nГотовься к экзамену с адаптивными задачами и подробной теорией.\n\nЗадания №1–5 — бесплатно!',
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '🚀 Открыть приложение', web_app: { url: WEB_APP_URL } },
            ]],
          },
        })
      } else if (text === '/help') {
        await tgApi('sendMessage', {
          chat_id: chatId,
          text: 'Нажми кнопку «Открыть приложение» внизу чата или используй /start.\n\nПо вопросам — пиши сюда, ответим!',
        })
      }
    }
  } catch (err) {
    console.error('Poll error:', err)
  }
}

/** Start polling loop */
export function startPolling() {
  setupBot()
  const loop = async () => {
    while (true) {
      await pollUpdates()
    }
  }
  loop()
}
