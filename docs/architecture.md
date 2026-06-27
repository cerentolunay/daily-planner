# Architecture

## Monorepo yapısı

- `apps/web`: Next.js frontend uygulaması
- `backend`: FastAPI backend servisi
- `docs`: Proje belgeleri
- `infra/caddy`: Gelecekte reverse proxy veya TLS yapılandırması için yer
- `docker-compose.yml`: PostgreSQL, backend ve frontend servislerini bir arada çalıştırma

## Frontend mimarisi

- `src/app`: Next.js sayfaları
- `src/components`: yeniden kullanılabilir UI bileşenleri
- `src/features`: görev, proje, gelen kutusu ve takvim alanları
- `src/lib`, `src/types`, `src/constants`: destekleyici yardımcı dosyaları barındırır

## Backend mimarisi

- `app/api/routes`: FastAPI route tanımları
- `app/core`: konfigürasyon ve veritabanı bağlantısı
- `app/models`: SQLAlchemy modelleri
- `app/schemas`: Pydantic şemalar
- `app/services`: iş mantığını yöneten servisler
- `app/services/ai`: AI Gateway, provider interface, Gemini/Mock provider, guard layer, cache, fallback ve usage logging
- `app/connectors`: WhatsApp, Gmail, Calendar, Slack, GitHub ve Discord için connector-ready placeholder mimari

## Veritabanı yapısı

- `projects`: projeler için UUID tabanlı kayıt
- `tasks`: görev verisi, proje ilişkisi ve öncelik/durum alanları
- `subtasks`: görevlerin yapılacak alt maddeleri
- `inbox_items`: universal capture kaynakları
- `inbox_threads`: ilişkili inbox mesaj grupları
- `task_drafts`: kullanıcı onayından önceki AI/rule-based görev önerileri
- `ai_analysis_cache`: AI analiz cache kayıtları
- `ai_usage_logs`: quota, fallback, cache ve başarı istatistikleri için kullanım kayıtları

## AI mimarisi

AI çağrılarının tek kapısı `AIGateway` sınıfıdır. Route'lar GeminiProvider'ı doğrudan çağırmaz. Gateway input temizleme, cache, quota, rate limit, provider seçimi, JSON validation, fallback ve usage logging sırasını uygular.

AI hiçbir zaman doğrudan gerçek task oluşturmaz. Analiz sonucu önce `TaskDraft` olarak saklanır; kullanıcı onay verirse mevcut convert endpoint'i `Task + Subtasks` oluşturur.

## Docker yapısı

- `postgres`: PostgreSQL veritabanı
- `backend`: Python FastAPI uygulaması
- `web`: Next.js uygulaması

Servisler `docker compose up --build` ile ayağa kalkar.
