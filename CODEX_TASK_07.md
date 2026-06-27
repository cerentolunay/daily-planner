# DailyPlanner - Codex Task 07

## Sprint Başlığı

Smart Inbox + Universal Capture + Message Grouping + AI Ready Architecture

## Ana Amaç

DailyPlanner artık yalnızca görev oluşturulan bir planner değil; WhatsApp grupları, e-postalar, linkler, notlar ve ileride diğer kaynaklardan gelen dağınık bilgileri yakalayan, gruplayan ve görev bloklarına dönüştüren bir Personal Work OS altyapısına dönüşmelidir.

Bu task’ta gerçek AI API entegrasyonu yapılmayacak.  
Ama AI’ın gelecekte kolayca bağlanabileceği tüm mimari kurulacak.

Ana hedef:

```txt
Capture everything.
Group related messages.
Understand context.
Create one clear task block.
1. Temel Problem

WhatsApp gruplarında görevler çoğu zaman tek mesajla gelmez.

Örnek:

Mesaj 1:
Abi Codesight sunumunu hazırlayalım.

Mesaj 2:
İçinde avantaj dezavantaj da olsun.

Mesaj 3:
CBOM kısmını da ekleyelim, cuma bitmiş olsun.

Uygulama bunları ayrı ayrı 3 görev yapmamalı.

Doğru sonuç:

Görev:
Codesight sunumunu hazırla

Proje:
Cyber-Quanta

Son tarih:
Cuma

Öncelik:
Yüksek

Yapılacaklar:
- Codesight genel açıklamasını hazırla
- Teknik çalışma mantığını anlat
- Avantajları listele
- Dezavantajları listele
- CBOM kısmını ekle
- Sunumu son kontrolden geçir

Bu task’ın en önemli özelliği budur.

2. Büyük Mimari Değişim

Mevcut basit akış:

Inbox Text
↓
Task

Yeni akış:

Capture
↓
Inbox Item
↓
Inbox Thread
↓
AI/Rule Analysis
↓
Task Draft
↓
User Review
↓
Task
↓
Subtasks

Her şey önce Inbox’a düşmeli.
Task doğrudan oluşmamalı.
Kullanıcı önce öneriyi görmeli, düzenlemeli, sonra onaylamalı.

3. Universal Capture Modeli

Inbox artık sadece text alanı olmamalı.

Yeni capture tipleri:

text
note
url
file
image
voice_placeholder
manual_paste
whatsapp_paste
email_paste

Bu task’ta gerçek dosya upload şart değil.
Ama UI ve backend model alanları ileride destekleyecek şekilde hazırlanmalı.

4. Backend Veri Modeli

Aşağıdaki modelleri ekle veya mevcut modelleri buna göre genişlet.

4.1 InboxItem

InboxItem her yakalanan ham bilgiyi temsil eder.

Alanlar:

id
source_type
content_type
raw_text
title
source_name
source_url
metadata_json
status
thread_id
created_at
updated_at

Status değerleri:

unprocessed
analyzed
converted
dismissed
archived

Content type değerleri:

text
url
file
image
voice
note

Source type değerleri:

manual
whatsapp
email
slack
discord
github
calendar
web
unknown

Not:
Mevcut inbox modeli varsa migration yerine basit şekilde genişletilebilir. Alembic zorunlu değilse create_all yaklaşımı korunabilir.

4.2 InboxThread

InboxThread ilişkili inbox item’ları gruplayan yapıdır.

Alanlar:

id
title
summary
project_hint
deadline_hint
priority_hint
confidence
status
created_at
updated_at

Status değerleri:

open
reviewed
converted
archived

Bir thread birden fazla InboxItem içerebilir.

Amaç:

3 WhatsApp mesajı
↓
1 InboxThread
↓
1 Task Draft
4.3 Task

Mevcut Task modelini şu alanlarla genişlet:

source_thread_id
source_inbox_item_id

İkisi de nullable olabilir.

4.4 Subtask

Yeni model ekle.

Alanlar:

id
task_id
title
is_completed
position
created_at
updated_at

İlişki:

Task 1 → N Subtask

Task detayında yapılacaklar listesi gösterilecek.

4.5 TaskDraft

TaskDraft gerçek task oluşturulmadan önce kullanıcıya gösterilen öneridir.

Alanlar:

id
thread_id
title
description
project_hint
deadline
priority
status
confidence
analysis_json
created_at
updated_at

TaskDraft içinde önerilen subtasks listesi de saklanmalı.

Basitlik için:

subtasks_json

alanı kullanılabilir.

5. Backend Route’ları

Aşağıdaki endpointleri ekle.

Inbox Items
GET    /inbox
POST   /inbox
GET    /inbox/{item_id}
PATCH  /inbox/{item_id}
DELETE /inbox/{item_id}
Inbox Threads
GET    /inbox/threads
POST   /inbox/threads
GET    /inbox/threads/{thread_id}
PATCH  /inbox/threads/{thread_id}
DELETE /inbox/threads/{thread_id}
Add Item to Thread
POST /inbox/threads/{thread_id}/items/{item_id}
Remove Item from Thread
DELETE /inbox/threads/{thread_id}/items/{item_id}
Analyze Single Inbox Item
POST /inbox/{item_id}/analyze

Bu endpoint rule-based/mock analysis döndürmeli.

Analyze Thread
POST /inbox/threads/{thread_id}/analyze

Birden fazla mesajı birlikte analiz etmeli.

Convert Thread to Task
POST /inbox/threads/{thread_id}/convert-to-task

Bu endpoint:

InboxThread
↓
Task
↓
Subtasks

oluşturmalı.

Task Drafts
GET    /task-drafts
POST   /task-drafts
GET    /task-drafts/{draft_id}
PATCH  /task-drafts/{draft_id}
DELETE /task-drafts/{draft_id}
POST   /task-drafts/{draft_id}/convert-to-task
6. Rule-Based Analysis Engine

Gerçek AI yok.
Ama AI mimarisine benzeyen bir rule engine kurulacak.

Klasör yapısı:

backend/app/services/ai/
├── __init__.py
├── extraction_engine.py
├── rule_engine.py
├── confidence.py
├── normalizer.py
├── suggestion_builder.py
└── prompts/
    └── task_extraction_prompt.md
6.1 ExtractionEngine

Ana servis.

Sorumluluk:

raw text veya thread items al
↓
rule engine ile analiz et
↓
normalize et
↓
task draft önerisi üret

Methodlar:

analyze_text(text: str) -> TaskExtractionResult
analyze_thread(items: list[InboxItem]) -> TaskExtractionResult
6.2 RuleEngine

Şunları yakalamalı:

Deadline kelimeleri:

bugün
yarın
bu hafta
haftaya
pazartesi
salı
çarşamba
perşembe
cuma
cumartesi
pazar
saat 5
saat 17
17:00
18.00
akşama
öğlene

Priority kelimeleri:

acil → urgent
kritik → urgent
çok önemli → urgent
önemli → high
yüksek öncelik → high
normal → medium
sonra → low
ufak → low
basit → low
müsait olunca → low

Status kelimeleri:

başladım → in_progress
devam ediyor → in_progress
beklemede → waiting
bitti → done
tamamlandı → done
iptal → cancelled

Project hints:

heptapus → Heptapus
heptacert → HeptaCert
cyber-quanta → Cyber-Quanta
cyber quanta → Cyber-Quanta
codesight → Cyber-Quanta
üniversite → Üniversite
okul → Üniversite
ders → Üniversite
kişisel → Kişisel

Subtask çıkarma ipuçları:

- “şunu da”
- “bunu da ekle”
- “içinde ... olsun”
- “ayrıca”
- “bir de”
- “unutma”
- virgülle ayrılmış liste
6.3 Confidence Sistemi

Her analiz sonucunda confidence dönmeli.

Confidence 0-100 arasında olmalı.

Basit mantık:

title bulunduysa +20
deadline bulunduysa +20
priority bulunduysa +15
project bulunduysa +15
subtasks çıkarıldıysa +20
birden fazla mesaj tutarlıysa +10

Minimum 30, maksimum 98 olabilir.

Confidence label:

0-49   → Emin değil
50-74  → Kısmen emin
75-89  → Emin
90-100 → Çok emin
6.4 TaskExtractionResult

Backend içinde ortak sonuç objesi oluştur.

Alanlar:

title
description
project_hint
deadline
priority
status
subtasks
confidence
confidence_label
source_summary
raw_signals
7. Message Grouping / Threading UX

Frontend Inbox sayfası tamamen geliştirilecek.

7.1 Inbox görünümü

Yeni bölümler:

Capture Alanı
Bekleyenler
Thread’ler
Analiz Edilenler
Göreve Çevrilenler
7.2 Multi-select

Inbox item kartlarında seçim checkbox’ı olmalı.

Kullanıcı birden fazla mesaj seçebilmeli.

Seçim sonrası üstte action bar çıksın:

3 mesaj seçildi

[ Thread Oluştur ]
[ Birleştir ve Analiz Et ]
[ Arşivle ]
[ Sil ]
7.3 Thread oluşturma

Kullanıcı 2 veya daha fazla item seçerse:

Thread Oluştur

butonuyla yeni InboxThread oluşmalı.

Thread başlığı otomatik önerilebilir:

Codesight sunumu hakkında konuşma
7.4 Birleştir ve Analiz Et

Bu buton:

Seçili inbox itemları
↓
Thread oluşturur
↓
Thread analyze endpointini çağırır
↓
TaskDraft oluşturur
↓
AI Preview ekranını gösterir
8. AI Preview UI

AI Preview görünümü çok önemli.

Başlık:

AI bunu şöyle anladı

Alanlar:

Görev Başlığı
Açıklama
Proje
Son Tarih
Öncelik
Durum
Confidence
Yapılacaklar
Kaynak Mesajlar

Her alan düzenlenebilir olmalı.

Butonlar:

Görev Olarak Kaydet
Düzenle
Tekrar Analiz Et
Vazgeç

Confidence renkleri:

Çok emin → Neon
Emin → Yellow
Kısmen emin → Yellow soft
Emin değil → Purple soft warning
9. Task Block / Subtask UI

Task detayında yapılacaklar bölümü olmalı.

Başlık:

Yapılacaklar

Özellikler:

Subtask listele
Subtask ekle
Subtask tamamla
Subtask sil
Sıralı göster

Task card üzerinde küçük özet göster:

3/6 yapılacak tamamlandı
10. Universal Capture UI

Inbox üstünde capture alanı olsun.

Sekmeler veya butonlar:

Yaz
Yapıştır
Link
Dosya
Görsel
Ses

Bu task’ta:

Yaz/Yapıştır aktif çalışsın.
Link aktif çalışsın.
Dosya/Görsel/Ses “Yakında” olarak görünsün.

Link capture:

URL gir
Başlık opsiyonel
Inbox’a kaydet
11. Connector Architecture

Gerçek entegrasyon yapılmayacak.
Ama altyapı kurulacak.

Klasör yapısı:

backend/app/connectors/
├── __init__.py
├── base.py
├── registry.py
├── whatsapp/
│   ├── __init__.py
│   └── connector.py
├── gmail/
│   ├── __init__.py
│   └── connector.py
├── calendar/
│   ├── __init__.py
│   └── connector.py
├── slack/
│   ├── __init__.py
│   └── connector.py
├── github/
│   ├── __init__.py
│   └── connector.py
└── discord/
    ├── __init__.py
    └── connector.py

Base connector interface:

class BaseConnector:
    name: str
    source_type: str

    def normalize(self, payload: dict) -> dict:
        pass

    def to_inbox_item(self, payload: dict) -> dict:
        pass

Her connector şimdilik mock/placeholder olabilir.

12. Integration Center

Yeni sayfa:

/integrations

Sidebar’a ekle:

Entegrasyonlar

Integration kartları:

WhatsApp
Gmail
Google Calendar
Slack
GitHub
Discord
Notion
Outlook

Her kartta:

Durum: Yakında
Kaynak tipi
Açıklama

WhatsApp kart açıklaması:

WhatsApp mesajlarını paylaşarak veya ileride Business API ile yakala.

Gmail kart açıklaması:

E-postalardan görevleri yakala ve Inbox’a düşür.

Google Calendar kart açıklaması:

Deadline ve etkinliklerini planınla senkronize et.
13. Smart Search Genişletme

Command palette veya global search şunları arayabilmeli:

tasks
projects
inbox items
threads
commands
integrations

Search placeholder:

Her şeyi ara...

Sonuçlar kategoriyle gelsin:

Görevler
Projeler
Inbox
Thread’ler
Komutlar
Entegrasyonlar
14. AI Settings

Settings sayfasına AI bölümü ekle.

Başlık:

AI Ayarları

Alanlar:

AI görev çıkarımı
AI günlük plan önerileri
AI özetleme
AI otomatik gruplama
AI confidence eşiği

Bu ayarlar localStorage’da tutulabilir.

Gerçek AI API kullanılmayacak.

Varsayılanlar:

AI görev çıkarımı: açık
AI günlük plan önerileri: açık
AI özetleme: kapalı
AI otomatik gruplama: kapalı
Confidence eşiği: 70
15. Daily Review / Weekly Review Skeleton

Yeni sayfalar oluştur:

/review/daily
/review/weekly

Sidebar’a eklemek zorunlu değil, ama command palette üzerinden erişilebilir.

Daily Review göster:

Bugünün Özeti
Tamamlanan görevler
Ertelenen görevler
Geciken görevler
Yarın için öneriler

Weekly Review göster:

Haftalık Özet
Toplam görev
Tamamlanan görev
En yoğun proje
Geciken işler
Sonraki hafta önerileri

Veriler rule-based hesaplanmalı.

16. Backend CORS ve Stabilite

Mevcut çalışan backend bozulmamalı.

Aşağıdakiler çalışmaya devam etmeli:

GET /health
GET /tasks
POST /tasks
GET /projects
POST /projects

CORS izinleri korunmalı:

http://localhost:3000
http://127.0.0.1:3000
17. Migration / DB Notu

Alembic kurulmadıysa bu task’ta zorunlu hale getirme.

Basit MVP için:

Base.metadata.create_all

yaklaşımı devam edebilir.

Ancak model değişiklikleri mevcut DB ile çakışırsa README’ye şu not ekle:

Development sırasında model değişikliklerinden sonra PostgreSQL volume’u sıfırlamak gerekebilir:
docker compose down -v
docker compose up -d postgres
18. UI Tema

Açık ve canlı Lilac tema korunacak.

Renkler:

Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Yeni AI preview, inbox thread ve integration center kartları bu temaya uygun olmalı.

UI admin paneli gibi görünmemeli.

19. Kabul Kriterleri

Bu task tamamlandığında:

Universal Inbox UI oluşturulmuş olmalı.
Text ve link capture çalışmalı.
Birden fazla inbox item seçilebilmeli.
Seçili itemlardan thread oluşturulabilmeli.
Thread analyze endpoint’i çalışmalı.
AI Preview UI görünmeli.
TaskDraft oluşturulmalı.
TaskDraft task’a çevrilebilmeli.
Task oluşturulurken subtasks da oluşmalı.
Task detayında subtasks görünmeli.
Subtask tamamlanabilmeli.
Connector mimarisi klasörleri oluşturulmuş olmalı.
Integration Center sayfası olmalı.
Smart Search inbox/thread/integration arayabilmeli.
AI Settings UI eklenmiş olmalı.
Daily Review ve Weekly Review skeleton sayfaları olmalı.
Backend /health çalışmaya devam etmeli.
Mevcut task/project CRUD bozulmamalı.
UI açık, canlı, neşeli ve kullanımı keyifli kalmalı.
20. Yapılmayacaklar

Bu task’ta şunları yapma:

Gerçek OpenAI API entegrasyonu
Gerçek WhatsApp API entegrasyonu
Gerçek Gmail entegrasyonu
Gerçek Google Calendar entegrasyonu
Gerçek dosya upload sistemi
Gerçek ses transkripsiyonu
Authentication
Payment
Team management
Native mobile app

Bu task’ın amacı gerçek entegrasyon değil, AI-ready ve connector-ready mimariyi kurmaktır.