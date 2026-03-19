# Лидерборд Road Escape

Топ считается на сервере (один лучший результат на адрес кошелька). Запись идёт только с **подписью** `personal_sign`, чтобы нельзя было подставить чужой счёт без кошелька.

## Upstash Redis (бесплатный тариф)

1. Зайди на [upstash.com](https://upstash.com) → создай базу **Redis**.
2. Скопируй **REST URL** и **REST TOKEN**.
3. В Vercel: **Project → Settings → Environment Variables**:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Передеплой.

Локально добавь те же переменные в `baseapp/.env.local`.

Без этих переменных игра работает как раньше: кнопка **TOP** покажет пустой список и подсказку, что сервер не настроен.

## API

- `GET /api/leaderboard` → `{ entries: [{ rank, address, score }], configured: boolean }`
- `POST /api/leaderboard` → тело JSON: `{ address, score, signature, timestamp }`  
  Сообщение для подписи: `RoadEscape|<score>|<unix_ts>` (как в `game.html`).
