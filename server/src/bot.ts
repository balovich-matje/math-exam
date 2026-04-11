import { tgApi } from './tgApi.js'
import db from './db/index.js'

const WEB_APP_URL = 'https://balovich-matje.github.io/math-exam/'

/** Set up bot commands and menu button */
export async function setupBot() {
  await tgApi('setMyCommands', {
    commands: [
      { command: 'start', description: 'Начать подготовку к ОГЭ' },
      { command: 'help', description: 'Помощь' },
    ],
  })

  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Открыть приложение',
      web_app: { url: WEB_APP_URL },
    },
  })

  console.log('Bot commands and menu button configured')
}

/** Simple webhook-free polling */
let lastUpdateId = 0

export async function pollUpdates() {
  try {
    const data = await tgApi('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30,
      allowed_updates: ['message', 'pre_checkout_query'],
    }) as { ok: boolean; result: any[] }

    if (!data.ok || !data.result) return

    for (const update of data.result) {
      lastUpdateId = update.update_id

      // ── Pre-checkout query (must answer within 10s) ──
      if (update.pre_checkout_query) {
        await tgApi('answerPreCheckoutQuery', {
          pre_checkout_query_id: update.pre_checkout_query.id,
          ok: true,
        })
        continue
      }

      const msg = update.message
      if (!msg) continue
      const chatId = msg.chat.id

      // ── Successful payment ──
      if (msg.successful_payment) {
        const sp = msg.successful_payment
        try {
          const payload = JSON.parse(sp.invoice_payload) as { userId: number; telegramId: number }

          // Record payment
          db.prepare(`
            INSERT OR IGNORE INTO payments (user_id, telegram_payment_charge_id, provider_payment_charge_id, amount, currency)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            payload.userId,
            sp.telegram_payment_charge_id,
            sp.provider_payment_charge_id || '',
            sp.total_amount,
            sp.currency,
          )

          // Activate / extend 30-day subscription
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          const existing = db.prepare(
            'SELECT expires_at FROM subscriptions WHERE user_id = ?'
          ).get(payload.userId) as { expires_at: string | null } | undefined

          // If user already has active sub, extend from current expiry
          let newExpiry = expiresAt
          if (existing?.expires_at && new Date(existing.expires_at) > new Date()) {
            newExpiry = new Date(new Date(existing.expires_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }

          db.prepare(`
            INSERT INTO subscriptions (user_id, plan, expires_at)
            VALUES (?, 'paid', ?)
            ON CONFLICT(user_id) DO UPDATE SET plan = 'paid', expires_at = ?
          `).run(payload.userId, newExpiry, newExpiry)

          await tgApi('sendMessage', {
            chat_id: chatId,
            text: '✅ Оплата прошла! Полный доступ активирован на 30 дней.\n\nПриятной подготовки к ОГЭ!',
          })

          console.log(`Payment OK: user ${payload.userId}, ${sp.total_amount} ${sp.currency}`)
        } catch (err) {
          console.error('Payment processing error:', err)
        }
        continue
      }

      // ── Text commands ──
      if (!msg.text) continue

      if (msg.text === '/start') {
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
      } else if (msg.text === '/help') {
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
