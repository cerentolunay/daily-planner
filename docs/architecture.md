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

## Veritabanı yapısı

- `projects`: projeler için UUID tabanlı kayıt
- `tasks`: görev verisi, proje ilişkisi ve öncelik/durum alanları
- `inbox_items`: gelen metin tabanlı inbox öğeleri

## Docker yapısı

- `postgres`: PostgreSQL veritabanı
- `backend`: Python FastAPI uygulaması
- `web`: Next.js uygulaması

Servisler `docker compose up --build` ile ayağa kalkar.
