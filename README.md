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
