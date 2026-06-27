# DailyPlanner

DailyPlanner, WhatsApp mesajları ve manuel girdilerden görev oluşturmaya odaklanan modern bir günlük planlayıcı MVP'sidir.

## Local Development

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend için önerilen yol Docker Compose kullanmaktır. Lokal Python ile çalıştırılacaksa `backend/.env` içinde `DATABASE_URL` değerinin çalışan PostgreSQL bağlantısını gösterdiğinden emin olun.

## Docker Development

Tüm servisleri başlatmak için:

```bash
docker compose up --build
```

Servisler:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Backend health check: http://127.0.0.1:8000/health
- PostgreSQL: localhost:5433 -> container içinde 5432

## Environment Variables

Örnek değerler `.env.example` içinde bulunur.

```env
DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@postgres:5432/dailyplanner
POSTGRES_USER=dailyplanner
POSTGRES_PASSWORD=dailyplanner
POSTGRES_DB=dailyplanner
NEXT_PUBLIC_API_URL=http://localhost:8000
AI_PROVIDER=gemini
AI_ENABLED=true
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
AI_DAILY_QUOTA_FREE=20
AI_RATE_LIMIT_PER_MINUTE=10
AI_CACHE_ENABLED=true
AI_FALLBACK_ENABLED=true
```

Docker dışından backend çalıştırırken `backend/.env` içinde PostgreSQL host/port değerini lokal bağlantıya göre ayarlayın:

```env
DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@localhost:5433/dailyplanner
```

## Common Errors

### 5432 port is already allocated

Yerel makinede PostgreSQL zaten 5432 portunu kullanıyor olabilir.

Çözüm:

- PostgreSQL Docker container localde `5433` portuna maplenmiştir.
- `backend/.env` içinde local çalıştırma için `localhost:5433` kullanın.
- Docker Compose içinde container bağlantısı için host `postgres`, port `5432` kalmalıdır.

### Backend health check

Backend'in çalıştığını kontrol etmek için:

```bash
curl http://127.0.0.1:8000/health
```

Beklenen yanıt:

```json
{ "status": "ok" }
```

### Development database reset

Task 07 ile Inbox Thread, Task Draft ve Subtask modelleri eklendi. Development sırasında mevcut PostgreSQL volume eski şemayla çakışırsa volume'u sıfırlamak gerekebilir:

```bash
docker compose down -v
docker compose up -d postgres
```

## AI Manual Test Plan

Test 1 - Health:

```bash
curl http://127.0.0.1:8000/health
```

Test 2 - AI text analysis:

```bash
curl -X POST http://127.0.0.1:8000/ai/analyze/text \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Yarın saat 5'e kadar Codesight sunumunu bitirmem gerekiyor. Acil.\"}"
```

Test 3 - Thread analysis:

```bash
curl -X POST http://127.0.0.1:8000/ai/analyze/thread \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[\"Codesight sunumunu hazırlayalım.\",\"Avantaj dezavantaj da olsun.\",\"CBOM kısmını da ekleyelim, cuma bitmiş olsun.\"]}"
```

Test 4 - Cache: aynı AI request'i ikinci kez gönder. Beklenen: `cache_hit: true`.

Test 5 - Fallback: `GEMINI_API_KEY` boş bırak. Beklenen: `used_fallback: true`.

Test 6 - Frontend: Inbox'ta mesajları seç, AI ile analiz et, preview gör, TaskDraft oluştur ve Task'a çevir.
