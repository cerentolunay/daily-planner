# DailyPlanner - Codex Task 03

## Amaç

Bu task’ın amacı artık altyapı problemlerini geçip ürünü gerçek MVP seviyesine taşımaktır.

Mevcut durumda:

- Backend `/health` endpoint’i çalışıyor.
- PostgreSQL bağlantısı çalışıyor.
- Frontend temel arayüz var.
- Ancak UI hâlâ istenen neşeli planner hissinde değil.
- Docker Compose dosyasında geçmiş düzenlemelerden kalan YAML bozuklukları olabilir.
- Frontend ile backend arasında gerçek veri akışı henüz net değil.

Bu task ile hedef:

1. UI temasını tamamen yeni açık/lilac tema ile yenilemek
2. Frontend’i backend CRUD API’lerine bağlamak
3. Görev oluşturma, listeleme, güncelleme ve silme akışlarını çalışır hale getirmek
4. Proje yönetimini temel seviyede çalışır yapmak
5. Gelen Kutusu üzerinden mock/manuel task çıkarma akışını gerçek task oluşturacak hale getirmek
6. Docker Compose dosyasını temizlemek
7. README’yi gerçek çalıştırma adımlarına göre güncellemek

---

## 1. Tema ve UI Tasarım Revizyonu

Dark tema kullanma.

Uygulama neşeli, açık, pozitif, modern ve günlük kullanılabilir bir planner gibi görünmeli.

Sadece şu 4 ana renk kullanılmalı:

```txt
Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62
Tema Kuralları
Ana arka plan Lilac (#D2C7FF) olmalı.
Koyu siyah/dark background kullanılmamalı.
Sidebar Purple (#5D5491) olabilir.
Ana CTA butonları Yellow (#FFD230) olmalı.
Başarı/tamamlandı/pozitif durumlar Neon (#E1FB62) ile gösterilmeli.
Başlıklar ve önemli metinlerde Purple (#5D5491) kullanılmalı.
Kartlar açık, yumuşak, ferah ve rounded olmalı.
UI admin paneli gibi değil, günlük planner uygulaması gibi görünmeli.
Mobil uyumluluk korunmalı.
Tüm görünür metinler Türkçe olmalı.
2. Frontend API Bağlantısı

Frontend artık sadece mock data göstermemeli.

NEXT_PUBLIC_API_URL üzerinden backend’e bağlanmalı.

Varsayılan:

NEXT_PUBLIC_API_URL=http://localhost:8000

Bir API helper oluştur:

apps/web/src/lib/api.ts

Bu helper şunları içermeli:

getTasks()
createTask(payload)
updateTask(id, payload)
deleteTask(id)
getProjects()
createProject(payload)
createInboxItem(payload)

Fetch kullanabilirsin. Hata yönetimi basit ama temiz olsun.

3. Görevler Sayfası

Route:

/tasks

Bu sayfa backend’den gerçek task listesini çeksin.

Özellikler:

Görevleri listele
Yeni görev ekle
Görev durumunu değiştir
Görevi sil
Priority badge göster
Status badge göster
Deadline göster

Form alanları:

Başlık
Açıklama
Proje
Son Tarih
Öncelik
Durum

Priority değerleri backend’e İngilizce gitsin:

low
medium
high
urgent

Ama UI’da Türkçe gösterilsin:

Düşük
Orta
Yüksek
Acil

Status değerleri backend’e İngilizce gitsin:

todo
in_progress
waiting
done
cancelled

Ama UI’da Türkçe gösterilsin:

Yapılacak
Devam Ediyor
Beklemede
Tamamlandı
İptal Edildi
4. Dashboard / Bugün Sayfası

Route:

/

Dashboard backend’den gelen task’ları kullanmalı.

Gösterilecek alanlar:

Bugünkü görev sayısı
Geciken görev sayısı
Tamamlanan görev sayısı
Acil görev sayısı
Bugünün görevleri
Geciken görevler
Bugünün odağı

Mock data mümkün olduğunca kaldırılmalı.

Eğer task yoksa güzel bir empty state göster:

Bugün için görev yok. Yeni bir görev ekleyerek gününü planlamaya başlayabilirsin.
5. Gelen Kutusu Sayfası

Route:

/inbox

Bu sayfa şu şekilde çalışmalı:

Kullanıcı WhatsApp/e-posta/mesaj metni yapıştırır.
“Göreve Dönüştür” butonuna basar.
Şimdilik gerçek AI kullanma.
Basit mock extraction yap:
İlk cümleden title üret
Eğer metinde “bugün” geçiyorsa deadline bugün
“yarın” geçiyorsa deadline yarın
“cuma” geçiyorsa yakın cuma
“acil” geçiyorsa priority urgent
Yoksa priority medium
Kullanıcı çıkan önizlemeyi düzenleyebilsin.
“Görev Olarak Kaydet” dediğinde backend’e gerçek task oluşturulsun.

Bu sayfada ileride AI bağlanacağı belli olsun ama şu an AI API kullanılmasın.

6. Projeler Sayfası

Route:

/projects

Backend’den gerçek proje listesini çeksin.

Özellikler:

Proje listeleme
Yeni proje ekleme
Proje kartları
Proje rengi seçme
Her proje için aktif görev sayısı gösterme

Varsayılan proje önerileri sadece empty state olarak gösterilebilir:

Heptapus
Cyber-Quanta
Üniversite
Kişisel

Ama otomatik DB’ye seed edilmesin, kullanıcı oluşturabilsin.

7. Takvim Sayfası

Route:

/calendar

Backend’den task’ları çekip haftalık görünümde göster.

Gün başlıkları Türkçe olsun:

Pazartesi
Salı
Çarşamba
Perşembe
Cuma
Cumartesi
Pazar

Deadline’ı olan görevleri ilgili güne koy.

Task yoksa:

Bu hafta için planlanmış görev yok.
8. Component Kalitesi

Şu component’ler temizlenmeli veya oluşturulmalı:

AppShell
Sidebar
Topbar
TaskCard
TaskForm
ProjectCard
ProjectForm
PriorityBadge
StatusBadge
EmptyState
Button
Input
Textarea
Select
Card

Component’ler tekrar kullanılabilir olmalı.

Kod sade olsun. Gereksiz library ekleme.

9. Backend Kontrol

Backend route’ları gerçekten çalışmalı:

GET /health
GET /tasks
POST /tasks
PATCH /tasks/{task_id}
DELETE /tasks/{task_id}

GET /projects
POST /projects
PATCH /projects/{project_id}
DELETE /projects/{project_id}

GET /inbox
POST /inbox
PATCH /inbox/{inbox_item_id}
DELETE /inbox/{inbox_item_id}

Eksik endpoint varsa tamamla.

CORS ayarı ekle:

Frontend http://localhost:3000 backend’e istek atabilmeli.

10. Docker Compose Temizliği

docker-compose.yml dosyası geçerli YAML olmalı.

Şu komut hata vermemeli:

docker compose config

Postgres local portu 5433 olmalı:

ports:
  - "5433:5432"

Backend Docker içinde PostgreSQL’e şu URL ile bağlanmalı:

DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@postgres:5432/dailyplanner

Local backend çalıştırmada backend/.env şu olmalı:

DATABASE_URL=postgresql+psycopg://dailyplanner:dailyplanner@localhost:5433/dailyplanner
11. README Güncellemesi

README’ye net Windows PowerShell komutları ekle.

Sadece Postgres Docker + Local Backend + Local Frontend
docker compose up -d postgres

cd backend
python -m uvicorn app.main:app --reload --port 8000

Ayrı terminal:

cd apps\web
npm install
npm run dev

Test adresleri:

Frontend: http://localhost:3000
Backend Health: http://127.0.0.1:8000/health
12. Kabul Kriterleri

Bu task tamamlandığında:

http://127.0.0.1:8000/health → {"status":"ok"} dönmeli.
http://localhost:3000 frontend açılmalı.
Görev oluşturulup backend’e kaydedilmeli.
Görevler sayfasında gerçek task’lar listelenmeli.
Dashboard gerçek task verisinden özet çıkarmalı.
Gelen Kutusu’ndan yapıştırılan mesaj task’a dönüştürülebilmeli.
Proje oluşturma çalışmalı.
Takvim sayfası gerçek task deadline’larını göstermeli.
UI açık Lilac temalı, neşeli ve modern görünmeli.
Tüm görünür metinler Türkçe olmalı.
docker compose config hata vermemeli.
13. Yapılmayacaklar

Bu task’ta şunları yapma:

Gerçek OpenAI API entegrasyonu
WhatsApp API
Google Calendar API
Push notification
Authentication
Payment
Team management
Native mobile app

Önce çalışan, güzel görünen ve veri kaydedebilen MVP yapılacak.