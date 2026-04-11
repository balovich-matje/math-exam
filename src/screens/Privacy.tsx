import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTelegram } from '../lib/telegram'

export default function Privacy() {
  const navigate = useNavigate()

  useEffect(() => {
    const tg = getTelegram()
    if (!tg) return
    tg.BackButton.show()
    const onBack = () => navigate('/')
    tg.BackButton.onClick(onBack)
    return () => { tg.BackButton.hide(); tg.BackButton.offClick(onBack) }
  }, [navigate])

  return (
    <div className="p-4 animate-fade-in pb-12">
      <h1 className="text-xl font-bold mb-4">Политика конфиденциальности</h1>

      <div className="space-y-4 text-sm text-tg-hint leading-relaxed">
        <section>
          <h2 className="font-semibold text-tg-text mb-1">1. Какие данные мы собираем</h2>
          <p>При входе через Telegram мы получаем: ваш Telegram ID, имя и юзернейм. Эти данные используются для идентификации и синхронизации прогресса между устройствами.</p>
        </section>

        <section>
          <h2 className="font-semibold text-tg-text mb-1">2. Прогресс обучения</h2>
          <p>Мы сохраняем ваш прогресс по темам (пройденные блоки, результаты тестов) на сервере, чтобы вы не потеряли данные при смене устройства.</p>
        </section>

        <section>
          <h2 className="font-semibold text-tg-text mb-1">3. Как используются данные</h2>
          <p>Данные используются исключительно для работы приложения. Мы не передаём их третьим лицам, не используем для рекламы и не продаём.</p>
        </section>

        <section>
          <h2 className="font-semibold text-tg-text mb-1">4. Хранение данных</h2>
          <p>Данные хранятся на защищённом сервере. Прогресс также дублируется локально на вашем устройстве (localStorage).</p>
        </section>

        <section>
          <h2 className="font-semibold text-tg-text mb-1">5. Удаление данных</h2>
          <p>Вы можете запросить удаление всех своих данных, написав в поддержку. Все данные будут удалены в течение 7 дней.</p>
        </section>

        <section>
          <h2 className="font-semibold text-tg-text mb-1">6. Изменения</h2>
          <p>Мы можем обновлять эту политику. Актуальная версия всегда доступна в приложении.</p>
        </section>
      </div>
    </div>
  )
}
