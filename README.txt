EUROBRIDGE + TELEGRAM

Файлы для GitHub/Vercel:
- index.html
- login.html
- api/order.js

НАСТРОЙКА TELEGRAM
1. В Telegram откройте @BotFather.
2. Команда /newbot, задайте имя и username.
3. Скопируйте токен. Никому его не отправляйте и не помещайте в HTML/GitHub.
4. Напишите новому боту любое сообщение.
5. Откройте в браузере: https://api.telegram.org/botВАШ_ТОКЕН/getUpdates
6. Найдите chat.id — это ваш TELEGRAM_CHAT_ID.

НАСТРОЙКА VERCEL
Project -> Settings -> Environment Variables:
TELEGRAM_BOT_TOKEN = токен BotFather
TELEGRAM_CHAT_ID = chat.id
Отметьте Production, Preview, Development. Сохраните и сделайте Redeploy.

БЕЗОПАСНОСТЬ
Не запрашивайте CVV, PIN, пароль интернет-банка и одноразовые коды.
Для реального финансового сервиса нужны юридическая проверка, KYC/AML, политика конфиденциальности, защищённая база данных и серверная авторизация.
