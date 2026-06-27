# DailyPlanner - Codex Task 09

## Sprint Başlığı

Mobile MVP + WhatsApp Share-to-App Capture Flow

## Ana Amaç

DailyPlanner artık sadece web uygulaması değil, mobilde de kullanılabilen bir capture-first planner olmalıdır.

Bu task’ın amacı:

1. `apps/mobile` altında React Native / Expo mobil uygulama iskeletini kurmak
2. Mobilde DailyPlanner’ın temel ekranlarını oluşturmak
3. Backend ile bağlantı kurmak
4. WhatsApp’tan veya başka uygulamalardan paylaşılan metin/linkleri DailyPlanner Inbox’a düşürebilecek share-to-app mimarisini hazırlamak
5. Android Share Intent desteği için gerekli native/config altyapısını kurmak
6. Share-to-app çalışmazsa manual paste fallback akışını sağlam tutmak

Bu task’ta amaç resmi WhatsApp API entegrasyonu değildir.

Doğru V1 yaklaşımı:

```txt
WhatsApp mesajı
↓
Paylaş
↓
DailyPlanner
↓
Inbox Item
↓
AI ile Analiz Et
↓
TaskDraft
↓
Kullanıcı Onayı
↓
Task + Subtasks
1. Önemli Ürün Kararı

WhatsApp mesajları otomatik okunmayacak.

Bu task’ta yapılacak yöntem:

Kullanıcı mesajı seçer
↓
WhatsApp Paylaş menüsünden DailyPlanner’ı seçer
↓
DailyPlanner mesajı capture eder
↓
Inbox’a kaydeder

Neden?

Kişisel WhatsApp mesajlarını arkadan okumak resmi ve güvenli bir yöntem değildir.
WhatsApp Business API kişisel hesaplar için uygun değildir.
Share-to-app kullanıcı onaylı ve daha güvenli bir akıştır.
2. Mobil Tech Stack

Kullan:

React Native
Expo
TypeScript
Expo Router veya React Navigation
AsyncStorage

Repo yapısı:

apps/mobile/
├── app/
│   ├── index.tsx
│   ├── inbox.tsx
│   ├── tasks.tsx
│   ├── projects.tsx
│   ├── calendar.tsx
│   ├── focus.tsx
│   ├── settings.tsx
│   └── share-capture.tsx
│
├── src/
│   ├── components/
│   ├── features/
│   │   ├── inbox/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── ai/
│   │   └── capture/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── config.ts
│   ├── constants/
│   │   ├── colors.ts
│   │   └── labels.ts
│   └── types/
│
├── assets/
├── app.json
├── package.json
├── tsconfig.json
└── README.md
3. Tema

Web ile aynı açık ve canlı tema kullanılacak.

Renkler:

Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Kurallar:

Ana arka plan Lilac olmalı.
Başlıklar Purple olmalı.
CTA butonları Yellow olmalı.
Başarı/tamamlandı durumları Neon olmalı.
Dark tema kullanılmamalı.
UI neşeli, hızlı ve günlük kullanılabilir görünmeli.
Tüm görünür metinler Türkçe olmalı.
4. Mobil Ekranlar
4.1 Bugün Ekranı

Route:

/

İçerik:

Dinamik karşılama
Bugünkü görevler
Bugünün odağı
Günlük ilerleme
Hızlı capture butonu

Örnek metin:

Günaydın 👋
Bugün neler başaracağız?
4.2 Inbox Ekranı

Route:

/inbox

İçerik:

Capture alanı
Bekleyen inbox itemları
Thread’ler
AI ile analiz et butonu
TaskDraft preview

Capture seçenekleri:

Yaz
Yapıştır
Link
WhatsApp’tan Paylaşılanlar

Dosya/görsel/ses bu task’ta “Yakında” olabilir.

4.3 Share Capture Ekranı

Route:

/share-capture

Bu ekran share intent ile gelen text/link’i göstermeli.

İçerik:

Paylaşılan İçerik
Metin veya link preview
Kaynak: WhatsApp / Diğer
[Inbox’a Kaydet]
[AI ile Analiz Et]
[Vazgeç]

Eğer share intent henüz platformda çalışmıyorsa bu ekran manual test için kullanılmalı.

4.4 Görevler Ekranı

Route:

/tasks

İçerik:

Görev listesi
Filtreler
Görev detayına gitme
Görev tamamla
Hızlı son tarih aksiyonları
4.5 Projeler Ekranı

Route:

/projects

İçerik:

Proje listesi
Proje kartları
Yeni proje ekleme
4.6 Takvim Ekranı

Route:

/calendar

İçerik:

Haftalık görünüm
Deadline’ı olan görevler
Geciken görevler
4.7 Odak Ekranı

Route:

/focus

İçerik:

Bugünün odağı
Seçili görev
Tamamlandı olarak işaretle
Sonra devam et
4.8 Ayarlar Ekranı

Route:

/settings

İçerik:

Backend URL ayarı
AI ayarları görünümü
Mobil capture ayarları
Bildirim placeholder
5. Mobil Navigasyon

Mobilde bottom tab navigation kullanılabilir.

Sekmeler:

Bugün
Inbox
Görevler
Takvim
Ayarlar

Projeler ve Odak ekranları:

Daha Fazla
veya
Command/Quick menu

Basitlik için drawer veya stack navigation da kullanılabilir.

6. Backend API Bağlantısı

Mobil app web ile aynı backend’i kullanacak.

API helper:

apps/mobile/src/lib/api.ts

Desteklenecek fonksiyonlar:

getTasks()
createTask(payload)
updateTask(id, payload)
deleteTask(id)

getProjects()
createProject(payload)

getInboxItems()
createInboxItem(payload)
analyzeInboxItem(id)
analyzeText(text)
analyzeThread(messages)

createTaskDraft(payload)
convertTaskDraftToTask(id)

Backend URL ayarı:

Development default:
http://localhost:8000

Ama Android emulator için localhost farklıdır.

Ayar ekranında kullanıcı backend URL girebilmeli:

http://10.0.2.2:8000

Not:

Android Emulator için backend genellikle http://10.0.2.2:8000 üzerinden erişilir.
Gerçek telefon için bilgisayarın local IP adresi kullanılmalıdır.

Bu bilgi README’ye eklenmeli.

7. AsyncStorage

Mobil app bazı ayarları AsyncStorage’da saklamalı.

Saklanacaklar:

backendUrl
lastCaptureText
draftCaptureQueue
selectedTheme
captureSourcePreference

Dosya:

apps/mobile/src/lib/storage.ts
8. Offline / Failed Capture Queue

Kullanıcı WhatsApp’tan bir metni paylaştı ama backend erişilemiyor olabilir.

Bu durumda içerik kaybolmamalı.

Akış:

Share received
↓
Backend available?
↓
Yes → Inbox’a kaydet
No → Local capture queue’ya kaydet

Ayarlar veya Inbox ekranında:

Bekleyen Capture’lar

bölümü olsun.

Kullanıcı tekrar gönderebilsin:

Tekrar Dene
Sil
9. WhatsApp Share-to-App Mimari Notu

Expo managed workflow’da native share extension/share intent desteği sınırlı olabilir.

Bu task’ta iki aşamalı yaklaşım kullan:

Aşama 1 — Manual Capture

Bu kesin çalışmalı:

WhatsApp mesajını kopyala
↓
DailyPlanner mobil app
↓
Inbox’a yapıştır
↓
AI ile analiz et
Aşama 2 — Android Share Intent Hazırlığı

Android share target için gerekli config ve dokümantasyon hazırlanmalı.

Android’de hedef:

text/plain
text/*

Paylaşılan içerik DailyPlanner içinde /share-capture ekranına düşmeli.

Eğer Expo managed workflow ile tam destek mümkün değilse:

README’ye net not ekle:
Android Share Intent için prebuild veya custom native module gerekebilir.

Kod yapısı buna hazır olmalı.

10. Android Share Intent

Eğer Expo config ile mümkünse app.json içinde Android intent filter hazırlanmalı.

Hedef:

ACTION_SEND
MIME text/plain
MIME text/*

Ama Expo tarafında çalışabilirlik garanti değilse bunu dokümante et.

Beklenen native intent davranışı:

Kullanıcı WhatsApp’ta mesajı paylaşır.
Android share sheet açılır.
DailyPlanner seçilir.
DailyPlanner açılır.
Paylaşılan text /share-capture ekranında görünür.

Implementasyon başarısız olursa bile:

Manual paste flow eksiksiz çalışmalı.
README’de Share Intent sınırlaması açıklanmalı.
11. Capture Normalization

Paylaşılan veya yapıştırılan içerik backend’e şu formatta gönderilmeli:

{
  "source_type": "whatsapp",
  "content_type": "text",
  "raw_text": "Abi cuma gününe kadar Codesight sunumunu hazırla",
  "title": "WhatsApp paylaşımı",
  "metadata_json": {
    "platform": "mobile",
    "capture_method": "share_intent",
    "app": "whatsapp"
  }
}

Manual paste ise:

{
  "source_type": "manual",
  "content_type": "text",
  "raw_text": "...",
  "title": "Manuel capture",
  "metadata_json": {
    "platform": "mobile",
    "capture_method": "manual_paste"
  }
}
12. AI Analysis from Mobile

Mobil Inbox item üzerinde:

AI ile Analiz Et

butonu olmalı.

Akış:

Inbox item
↓
analyzeInboxItem(id)
↓
TaskDraft
↓
AI Preview
↓
Kullanıcı düzenler
↓
Task’a çevir

AI Preview mobilde sade olmalı:

AI bunu şöyle anladı
Başlık
Açıklama
Proje
Son tarih
Öncelik
Yapılacaklar
Confidence
[Görev Olarak Kaydet]
13. Multi-message Mobile Grouping

Mobil Inbox’ta çoklu seçim desteklenmeli.

Kullanıcı birden fazla inbox item seçebilmeli.

Action bar:

3 mesaj seçildi
[Birleştir ve Analiz Et]
[Thread Oluştur]
[Sil]

Akış:

Seçili mesajlar
↓
Thread oluştur
↓
Thread analyze
↓
TaskDraft preview

Bu özellikle WhatsApp gruplarında önemlidir.

14. Mobile UI Components

Oluşturulacak temel componentler:

MobileShell
BottomTabs
ScreenHeader
Card
Button
Input
Textarea
TaskCard
InboxItemCard
CaptureComposer
AIResultPreview
ProjectCard
EmptyState
LoadingState
ErrorState
FloatingCaptureButton
15. Mobile Capture Button

Tüm ana ekranlarda floating capture button olsun.

Buton:

+

Açılan menü:

Yaz
Yapıştır
Link Ekle
Inbox’a Git

Bu web’deki quick add hissini mobilde de sürdürmeli.

16. Permissions

Bu task’ta gerçek kamera, mikrofon veya dosya erişimi zorunlu değildir.

Ama ileride kullanılacağı için UI placeholder olabilir:

Görsel yakala - Yakında
Ses kaydı - Yakında
Dosya ekle - Yakında

Eğer permission istenmiyorsa kullanıcıdan gereksiz izin isteme.

17. Backend Değişiklikleri

Backend büyük oranda hazır olmalı.

Gerekirse şunları ekle:

Inbox item metadata_json alanı düzgün çalışmalı.
source_type whatsapp değerini kabul etmeli.
content_type text/url değerlerini kabul etmeli.
CORS mobil development için sorun çıkarmamalı.

CORS izinlerine local network için esnek geliştirme config’i eklenebilir.

Ama prod güvenliği bozulmamalı.

18. Development Scripts

Root README ve mobile README’ye scriptleri ekle.

Mobile setup:

cd apps/mobile
npm install
npx expo start

Android:

npx expo start --android

Backend:

docker compose up -d postgres
cd backend
python -m uvicorn app.main:app --reload --port 8000

Frontend web:

cd apps/web
npm run dev
19. Test Plan

README’ye manual test planı ekle.

Test 1 — Mobile app opens
Expo app açılır.
Bugün ekranı görünür.
Test 2 — Backend connection
Ayarlar ekranında backend URL doğru ayarlanır.
Health veya tasks request başarılı olur.
Test 3 — Manual WhatsApp paste
WhatsApp mesajı kopyalanır.
Inbox capture alanına yapıştırılır.
Inbox’a kaydedilir.
AI ile analiz edilir.
TaskDraft görünür.
Task’a çevrilir.
Test 4 — Offline queue
Backend URL yanlış yapılır.
Capture gönderilir.
Bekleyen capture olarak saklanır.
Backend düzeltilir.
Tekrar dene ile Inbox’a gönderilir.
Test 5 — Multi-message grouping
3 capture item oluşturulur.
Üçü seçilir.
Birleştir ve Analiz Et yapılır.
Tek TaskDraft önerilir.
Subtasks görünür.
Test 6 — Share intent preparation
Android paylaşım akışı manuel olarak test edilir.
Eğer çalışmıyorsa README’de belirtilen prebuild/native limitation doğrulanır.
20. Güvenlik

Kurallar:

AI key mobil app içinde bulunmayacak.
Gemini key frontend veya mobile bundle içinde olmayacak.
Mobil sadece backend endpointlerini çağıracak.
Kullanıcı paylaşmadan hiçbir WhatsApp mesajı okunmayacak.
Sadece kullanıcının seçtiği/paylaştığı içerik backend’e gönderilecek.
Bekleyen local captures cihazda tutulacak.
21. Kabul Kriterleri

Bu task tamamlandığında:

apps/mobile oluşturulmuş olmalı.
Expo React Native app çalışmalı.
Mobil açık Lilac tema kullanmalı.
Bugün, Inbox, Görevler, Takvim, Ayarlar ekranları olmalı.
Mobil app backend URL ayarını desteklemeli.
Mobil app backend’e bağlanabilmeli.
Manual text capture çalışmalı.
Manual link capture çalışmalı.
Capture Inbox’a kaydedilebilmeli.
Backend yoksa capture local queue’ya alınmalı.
Queue’dan tekrar gönderme çalışmalı.
Inbox item AI ile analiz edilebilmeli.
AI Preview mobilde görünmeli.
TaskDraft Task’a çevrilebilmeli.
Multi-message seçme ve birleştirip analiz etme akışı çalışmalı.
Android share-to-app için config veya en azından net hazırlık/dokümantasyon yapılmış olmalı.
Gerçek WhatsApp API kullanılmamalı.
AI API key mobile app’e konmamalı.
Web ve backend mevcut çalışmasını bozmamalı.
README ve apps/mobile/README.md güncellenmeli.
22. Yapılmayacaklar

Bu task’ta şunları yapma:

Resmi WhatsApp Business API entegrasyonu
Kişisel WhatsApp mesajlarını otomatik okuma
Google Calendar API entegrasyonu
Gmail API entegrasyonu
Gerçek push notification
Authentication
Payment
Team management
Kamera/mikrofon gerçek permission akışı
Gerçek dosya upload sistemi

Bu task’ın amacı mobil capture deneyimini başlatmak ve WhatsApp share-to-app için temel mimariyi kurmaktır.