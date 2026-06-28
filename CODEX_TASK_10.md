# DailyPlanner - Codex Task 10

## Sprint Başlığı

Production-Ready MVP Stabilization + First Usable Release

## Ana Amaç

DailyPlanner artık deneysel geliştirme aşamasından çıkıp günlük kullanım için stabil bir MVP haline gelmelidir.

Bu task’ın amacı yeni büyük özellik eklemek değildir.

Amaç:

- Var olan web, backend, mobile ve AI akışlarını stabil hale getirmek
- Çalışmayan endpoint, UI, env, docker ve bağlantı sorunlarını temizlemek
- Kullanıcının uygulamayı gerçekten kullanmaya başlayabileceği ilk sürümü hazırlamak
- README ve kullanım adımlarını netleştirmek
- Gereksiz karmaşıklıkları azaltmak
- Kritik bugları çözmek
- Minimal ama düzgün demo/veri akışı sağlamak

---

## 1. Kesinlikle Öncelik

Bu task’ta öncelik sırası:

```txt
1. Backend stabil çalışmalı
2. Web frontend stabil çalışmalı
3. Mobile app açılmalı
4. AI analyze akışı çalışmalı veya fallback ile bozulmadan devam etmeli
5. Inbox → TaskDraft → Task + Subtasks akışı çalışmalı
6. Task CRUD bozulmamalı
7. Docker / local dev dokümantasyonu net olmalı
8. UI tutarlı ve Türkçe olmalı

Yeni büyük özellik ekleme.

2. Backend Stabilizasyon

Aşağıdaki endpointler manuel test edilmeli ve çalışmalı:

GET    /health

GET    /tasks
POST   /tasks
PATCH  /tasks/{task_id}
DELETE /tasks/{task_id}

GET    /projects
POST   /projects
PATCH  /projects/{project_id}
DELETE /projects/{project_id}

GET    /inbox
POST   /inbox
POST   /inbox/{item_id}/analyze

GET    /inbox/threads
POST   /inbox/threads
POST   /inbox/threads/{thread_id}/analyze
POST   /inbox/threads/{thread_id}/convert-to-task

GET    /task-drafts
POST   /task-drafts/{draft_id}/convert-to-task

POST   /ai/analyze/text
POST   /ai/analyze/thread
GET    /ai/usage/summary

Eksik endpoint varsa ya tamamla ya da frontend’den kullanılmıyorsa güvenli şekilde kaldır/dokümante et.

3. Environment Dosyaları

.env.example temiz ve doğru olmalı.

Repo kökü .env.example:

DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@postgres:5432/dailyplanner
POSTGRES_USER=dailyplanner
POSTGRES_PASSWORD=dailyplanner
POSTGRES_DB=dailyplanner

AI_ENABLED=true
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
AI_CACHE_ENABLED=true
AI_FALLBACK_ENABLED=true
AI_DAILY_QUOTA_FREE=20
AI_RATE_LIMIT_PER_MINUTE=10
AI_MAX_MESSAGES_PER_THREAD=10
AI_MAX_CHARS_PER_REQUEST=8000

NEXT_PUBLIC_API_URL=http://localhost:8000

Backend local için backend/.env.example oluştur:

DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@localhost:5433/dailyplanner

AI_ENABLED=true
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
AI_CACHE_ENABLED=true
AI_FALLBACK_ENABLED=true
AI_DAILY_QUOTA_FREE=20
AI_RATE_LIMIT_PER_MINUTE=10
AI_MAX_MESSAGES_PER_THREAD=10
AI_MAX_CHARS_PER_REQUEST=8000

Kurallar:

.env git'e commitlenmemeli.
.env.example gerçek API key içermemeli.
Frontend/mobile içine GEMINI_API_KEY girmemeli.
4. Docker Compose Stabilizasyon

docker-compose.yml temiz ve geçerli YAML olmalı.

Şu komut hata vermemeli:

docker compose config

Postgres port mapping localde şu kalmalı:

ports:
  - "5433:5432"

Backend Docker içinde postgres:5432 kullanmalı.

Local backend ise localhost:5433 kullanmalı.

Bozuk veya eski satırlar olmamalı:

432:5432"
5432:5432
5. Database Reset Script

Development için basit script ekle.

Dosya:

scripts/reset-dev-db.ps1

İçerik mantığı:

docker compose down -v
docker compose up -d postgres

README’ye not ekle:

Model değişikliklerinden sonra development DB sıfırlamak gerekebilir.
6. Backend Startup Kontrolü

Backend startup sırasında DB connection hatası olursa kullanıcıya daha anlaşılır log basılsın.

Örnek log:

Database connection failed.
Local development için backend/.env içinde localhost:5433 kullandığından emin ol.
Docker içinde çalışıyorsan postgres:5432 kullanılmalı.

Uygulama anlaşılmaz traceback ile kalmasın.

7. Frontend Web Stabilizasyon

Web frontend’de şu sayfalar açılmalı:

/
 /tasks
 /inbox
 /calendar
 /projects
 /focus
 /settings
 /integrations
 /review/daily
 /review/weekly

Tüm sayfalarda:

Loading state
Error state
Empty state
Türkçe metinler
Responsive layout

olmalı.

API hata verirse uygulama beyaz ekran vermemeli.

8. Mobile Stabilizasyon

apps/mobile açılmalı.

Şu komut çalışmalı:

cd apps/mobile
npm install
npx expo start

Mobilde minimum şu ekranlar çalışmalı:

Bugün
Inbox
Görevler
Takvim
Ayarlar

Manual capture çalışmalı:

Metin yaz
Inbox’a kaydet
AI ile analiz et
TaskDraft gör
Task’a çevir

Backend URL ayarı net olmalı:

Android emulator: http://10.0.2.2:8000
Gerçek telefon: http://LOCAL_IP:8000
Web/local: http://localhost:8000
9. AI Fallback Zorunlu

Gemini API key yoksa uygulama patlamamalı.

Beklenen davranış:

GEMINI_API_KEY yok
↓
GeminiProvider kullanılmaz
↓
Rule-based fallback devreye girer
↓
TaskDraft yine oluşturulur
↓
UI’da "Kural tabanlı analiz kullanıldı" görünür

AI key varsa Gemini kullanılabilir.

AI key yoksa demo yine çalışmalı.

Bu çok önemli.

10. AI Analyze Testleri

Aşağıdaki inputlar test edilmeli.

Tek mesaj
Yarın saat 5'e kadar Codesight sunumunu bitirmem gerekiyor. Acil.

Beklenen:

Title dolu
Deadline yarın 17:00 veya yakın mantıklı tarih
Priority urgent/high
TaskDraft oluşuyor
Çok mesaj
Codesight sunumunu hazırlayalım.
Avantaj dezavantaj da olsun.
CBOM kısmını da ekleyelim, cuma bitmiş olsun.

Beklenen:

Tek task draft
Subtasks dolu
Project hint mümkünse Cyber-Quanta
11. Inbox → Task Akışı

Bu ana kullanım akışı sorunsuz olmalı:

Inbox item oluştur
↓
AI ile analiz et
↓
AI Preview gör
↓
Düzenle
↓
TaskDraft oluştur
↓
Görev olarak kaydet
↓
Task + Subtasks oluşur
↓
Task listesinde görünür

Bu akış web ve mümkünse mobilde çalışmalı.

12. Seed / Demo Data

Development için opsiyonel demo data script’i ekle.

Dosya:

scripts/seed-demo.py

Demo içerik:

Projects:
- Cyber-Quanta
- Heptapus
- Üniversite
- Kişisel

Tasks:
- Codesight sunumunu hazırla
- DMS dokümantasyonunu tamamla
- Haftalık planı gözden geçir

Inbox Items:
- Codesight sunumunu hazırlayalım.
- Avantaj dezavantaj da olsun.
- CBOM kısmını da ekleyelim, cuma bitmiş olsun.

README’de nasıl çalıştırılacağı yazılsın.

13. UI Son Temizlik

Tema korunmalı:

Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Kurallar:

Dark tema yok.
Tüm görünür metinler Türkçe.
Butonlar tutarlı.
Formlar taşmıyor.
Kartlar okunabilir.
Mobil responsive bozulmuyor.
14. README - Final Kullanım Rehberi

Ana README şu bölümleri içermeli:

DailyPlanner nedir?
Özellikler
Mimari
Local Development
Backend çalıştırma
Web çalıştırma
Mobile çalıştırma
AI ayarları
Gemini API key nasıl eklenir?
PostgreSQL port sorunu
DB reset
Manual test plan
Common errors

Common errors kısmında özellikle:

5432 port is already allocated

Çözüm:

Docker PostgreSQL localde 5433 portuna maplenmiştir.
backend/.env içinde localhost:5433 kullan.
GEMINI_API_KEY yok

Çözüm:

Fallback devreye girer. Gerçek AI için backend/.env içine GEMINI_API_KEY ekle.
Android emulator backend’e bağlanamıyor

Çözüm:

localhost yerine http://10.0.2.2:8000 kullan.
15. Docs

Aşağıdaki dokümanlar güncellenmeli:

docs/architecture.md
docs/ai-architecture.md
docs/mobile.md
docs/security.md
docs/manual-test-plan.md
16. Manual Test Plan

docs/manual-test-plan.md içine kısa checklist koy:

[ ] Backend health çalışıyor
[ ] Web açılıyor
[ ] Mobile açılıyor
[ ] Project oluşturuluyor
[ ] Task oluşturuluyor
[ ] Inbox item oluşturuluyor
[ ] AI analyze fallback ile çalışıyor
[ ] AI analyze Gemini ile çalışıyor
[ ] Thread analyze çalışıyor
[ ] TaskDraft task’a dönüşüyor
[ ] Subtasks görünüyor
[ ] Calendar deadline gösteriyor
[ ] Offline mobile capture queue çalışıyor
17. Güvenlik Kontrolü

Şunları kontrol et:

.env gitignore içinde
GEMINI_API_KEY frontend/mobile bundle içinde yok
NEXT_PUBLIC_GEMINI_API_KEY gibi bir değişken yok
AI endpointleri input uzunluğunu sınırlıyor
AI usage log hassas içerik saklamıyor
Cache result içinde gereksiz hassas veri saklanmıyor
18. Kabul Kriterleri

Bu task tamamlandığında:

Backend /health çalışmalı.
Web frontend açılmalı.
Mobile app açılmalı.
PostgreSQL 5433 ile çalışmalı.
docker compose config hata vermemeli.
Gemini key yoksa fallback çalışmalı.
Gemini key varsa AI analyze çalışmalı.
Inbox → TaskDraft → Task + Subtasks akışı çalışmalı.
Task CRUD çalışmalı.
Project CRUD çalışmalı.
Thread analyze çalışmalı.
AI usage summary çalışmalı.
Web UI Türkçe ve tutarlı olmalı.
Mobile UI Türkçe ve tutarlı olmalı.
README gerçek kullanım için yeterli olmalı.
Manual test plan tamamlanmalı.
.env dosyaları güvenli olmalı.
19. Yapılmayacaklar

Bu task’ta şunları yapma:

Yeni büyük özellik ekleme
WhatsApp Business API
Gmail API
Google Calendar API
Authentication
Payment
Team workspace
Production deployment
Push notification

Bu task sadece ilk kullanılabilir MVP sürümünü stabilize eder.