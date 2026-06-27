# DailyPlanner - Codex Task 08

## Sprint Başlığı

Real AI Extraction + AI Gateway + Guard Layer + Cache + Fallback

## Ana Amaç

DailyPlanner artık mock/rule-based analizden gerçek AI destekli analiz mimarisine geçmelidir.

Bu task’ın amacı Gemini API’yi güvenli, kontrollü ve ölçeklenebilir şekilde backend’e bağlamaktır.

Önemli:

- AI API key asla frontend’e gitmeyecek.
- AI direkt Task oluşturmayacak.
- AI sadece TaskDraft önerisi üretecek.
- Kullanıcı onay verirse Task + Subtasks oluşacak.
- Gemini hata verirse sistem bozulmayacak, rule-based fallback kullanılacak.
- Cache, quota, rate limit ve validation katmanları kurulacak.

---

## 1. Hedef Akış

Yeni AI akışı:

```txt
Frontend
↓
Backend Analyze Endpoint
↓
AI Gateway
↓
AI Guard Layer
↓
Cache Check
↓
Quota Check
↓
Rate Limit Check
↓
Sanitizer
↓
Gemini Provider
↓
Safe JSON Parser
↓
Validator
↓
TaskDraft
↓
User Review
↓
Task + Subtasks

Task hiçbir zaman AI tarafından direkt oluşturulmamalı.

2. AI’ın Görevi Ne?

AI’ın görevi şudur:

Kullanıcının seçtiği inbox item veya inbox thread mesajlarını oku.
Aynı konuya ait mesajları birlikte değerlendir.
Tek bir görev bloğu öner.
Gerekirse subtasks çıkar.
Deadline, priority, project ve status tahmini yap.
Confidence score üret.
Sonucu strict JSON olarak döndür.

Örnek input:

Mesaj 1:
Abi Codesight sunumunu hazırlayalım.

Mesaj 2:
İçinde avantaj dezavantaj da olsun.

Mesaj 3:
CBOM kısmını da ekleyelim, cuma bitmiş olsun.

Beklenen output:

{
  "title": "Codesight sunumunu hazırla",
  "description": "Cyber-Quanta için Codesight sunumu hazırlanacak. Sunumda Codesight'ın amacı, çalışma mantığı, avantajları, dezavantajları ve CBOM ilişkisi yer almalı.",
  "project_hint": "Cyber-Quanta",
  "deadline": "2026-07-03T18:00:00",
  "priority": "high",
  "status": "todo",
  "subtasks": [
    "Codesight genel açıklamasını hazırla",
    "Teknik çalışma mantığını anlat",
    "Avantajları listele",
    "Dezavantajları listele",
    "CBOM kısmını ekle",
    "Sunumu son kontrolden geçir"
  ],
  "confidence": 91,
  "confidence_label": "Çok emin",
  "source_summary": "Üç mesaj Codesight sunumu hazırlığı ve cuma deadline'ı etrafında birleşiyor.",
  "reasoning_summary": "Mesajlarda sunum, içerik başlıkları ve deadline açıkça belirtilmiş."
}

Not:
reasoning_summary kısa ve kullanıcıya gösterilebilir özet olmalı. Modelin gizli chain-of-thought’unu isteme.

3. Teknoloji

Gemini kullanılacak.

Backend Python tarafında Gemini entegrasyonu için resmi SDK kullanılmalı.

Dependency ekle:

google-genai

requirements.txt içine eklenmeli.

Environment variables:

AI_PROVIDER=gemini
AI_ENABLED=true
GEMINI_API_KEY=your_api_key_here
AI_DAILY_QUOTA_FREE=20
AI_DAILY_QUOTA_PRO=300
AI_RATE_LIMIT_PER_MINUTE=10
AI_CACHE_ENABLED=true
AI_FALLBACK_ENABLED=true
AI_MAX_MESSAGES_PER_THREAD=10
AI_MAX_CHARS_PER_REQUEST=8000

.env.example güncellensin ama gerçek key yazılmasın.

Önemli:

GEMINI_API_KEY frontend’e asla geçmeyecek.
NEXT_PUBLIC_ ile başlayan hiçbir AI key olmayacak.
4. Backend Klasör Yapısı

Aşağıdaki AI mimarisi kurulmalı veya mevcut yapı buna göre refactor edilmeli.

backend/app/services/ai/
├── __init__.py
├── gateway.py
├── types.py
├── config.py
├── errors.py
│
├── providers/
│   ├── __init__.py
│   ├── base.py
│   ├── mock_provider.py
│   └── gemini_provider.py
│
├── guard/
│   ├── __init__.py
│   ├── quota.py
│   ├── rate_limit.py
│   ├── cache.py
│   ├── fallback.py
│   ├── validator.py
│   └── sanitizer.py
│
├── prompts/
│   ├── task_extraction.md
│   ├── thread_extraction.md
│   └── system_rules.md
│
└── services/
    ├── extraction_service.py
    └── usage_service.py
5. AI Gateway

Dosya:

backend/app/services/ai/gateway.py

AI Gateway uygulamanın AI’a açılan tek kapısıdır.

Backend route’ları GeminiProvider’ı direkt çağırmamalı.

Sadece Gateway çağrılmalı.

Örnek methodlar:

class AIGateway:
    async def analyze_text(self, text: str, user_id: str | None = None) -> TaskExtractionResult:
        ...

    async def analyze_thread(self, messages: list[str], user_id: str | None = None) -> TaskExtractionResult:
        ...

Gateway sorumlulukları:

Input validation
Sanitization
Cache check
Quota check
Rate limit check
Provider selection
Gemini call
JSON validation
Fallback handling
Usage logging
6. Provider Interface

Dosya:

backend/app/services/ai/providers/base.py

Interface:

from abc import ABC, abstractmethod

class AIProvider(ABC):
    name: str

    @abstractmethod
    async def extract_task_from_text(self, text: str) -> dict:
        pass

    @abstractmethod
    async def extract_task_from_thread(self, messages: list[str]) -> dict:
        pass

Provider’lar:

MockProvider
GeminiProvider
MockProvider

Rule-based engine veya sabit mock kullanabilir.
Gemini kapalıysa çalışmalı.

GeminiProvider

Gemini API çağrısını burada yap.

Kurallar:

API key backend env’den okunmalı.
Prompt dosyaları kullanılmalı.
Model çıktısı strict JSON olarak istenmeli.
AI çıktısı direkt DB’ye yazılmamalı.
Timeout / error handling olmalı.

Model adı ayarlanabilir olsun:

GEMINI_MODEL=gemini-1.5-flash

Varsayılan model env’den okunmalı.

7. Prompt Dosyaları
system_rules.md

İçerik:

You are an assistant that extracts structured task drafts from user-provided messages.
You never create real tasks directly.
You only return valid JSON.
You do not include markdown.
You do not include explanations outside JSON.
You only analyze the messages explicitly provided.
You do not infer private facts beyond the provided messages.
You return Turkish user-facing text.
task_extraction.md

Tek mesaj için prompt.

AI’dan istenecek JSON schema:

{
  "title": "string",
  "description": "string",
  "project_hint": "string | null",
  "deadline": "ISO datetime string | null",
  "priority": "low | medium | high | urgent",
  "status": "todo | in_progress | waiting | done | cancelled",
  "subtasks": ["string"],
  "confidence": 0,
  "confidence_label": "Emin değil | Kısmen emin | Emin | Çok emin",
  "source_summary": "string",
  "reasoning_summary": "string"
}
thread_extraction.md

Birden fazla mesaj için prompt.

Ek kurallar:

If messages are about the same task, merge them into one task draft.
If messages contain several distinct tasks, return the most likely main task and list other possible tasks inside analysis_json.possible_additional_tasks.
If deadline is uncertain, set deadline to null.
If priority is uncertain, use medium.
If project is uncertain, set project_hint to null.
Subtasks should be concrete and actionable.
8. TaskExtractionResult Type

Dosya:

backend/app/services/ai/types.py

Pydantic model oluştur.

Alanlar:

title: str
description: str | None
project_hint: str | None
deadline: datetime | None
priority: Literal["low", "medium", "high", "urgent"]
status: Literal["todo", "in_progress", "waiting", "done", "cancelled"]
subtasks: list[str]
confidence: int
confidence_label: Literal["Emin değil", "Kısmen emin", "Emin", "Çok emin"]
source_summary: str | None
reasoning_summary: str | None
raw_provider: str
raw_response_json: dict | None
used_fallback: bool
cache_hit: bool

Validation:

confidence 0-100 arası olmalı.
title boş olamaz.
priority geçerli enum olmalı.
status geçerli enum olmalı.
deadline parse edilemezse null yapılmalı.
subtasks max 20 item olmalı.
9. AI Guard Layer
9.1 Sanitizer

Dosya:

backend/app/services/ai/guard/sanitizer.py

Görev:

Input çok uzunsa kes.
Null/boş inputları reddet.
Gereksiz whitespace temizle.
Prompt injection benzeri metinleri ekstra talimat olarak değil, analiz edilecek kullanıcı içeriği olarak ele al.

Örnek:

"ignore previous instructions"

silinmek zorunda değil, ama prompt’ta sadece kullanıcı mesajı olarak etiketlenmeli.

9.2 Quota

Dosya:

backend/app/services/ai/guard/quota.py

Günlük kullanım limiti.

Şimdilik auth yoksa anonymous kullanıcı gibi davran.

Ama mimari user_id desteklemeli.

Free default:

20 analysis / day

Quota aşılırsa:

{
  "error": "AI_QUOTA_EXCEEDED",
  "message": "Bugünkü AI analiz hakkın doldu."
}

Not:
Auth olmadığı için user_id null gelebilir. Bu durumda global anonymous quota veya local IP bazlı basit yaklaşım kullanılabilir. MVP için memory-based veya DB-based simple usage yeterli.

9.3 Rate Limit

Dosya:

backend/app/services/ai/guard/rate_limit.py

Dakikalık limit.

Default:

10 analysis / minute

Aşılırsa:

{
  "error": "AI_RATE_LIMITED",
  "message": "Çok hızlı istek gönderiyorsun. Biraz sonra tekrar dene."
}

MVP için in-memory rate limit kabul edilebilir.

9.4 Cache

Dosya:

backend/app/services/ai/guard/cache.py

Aynı input tekrar analiz edilirse Gemini’ye tekrar gitme.

Cache key:

hash(provider + model + normalized_input)

Cache output:

TaskExtractionResult

Backend modeli ekle:

AIAnalysisCache

Alanlar:

id
cache_key
provider
model
input_hash
result_json
created_at
expires_at

Default TTL:

7 gün

Cache hit olursa response içinde:

"cache_hit": true
9.5 Fallback

Dosya:

backend/app/services/ai/guard/fallback.py

Gemini şu durumlarda çalışmazsa rule-based engine’e dön:

API key yok
Provider disabled
Gemini timeout
Gemini invalid JSON döndürdü
Quota dolduysa fallback kullanma; kullanıcıya quota hatası dön
Rate limit dolduysa fallback kullanma; kullanıcıya rate limit hatası dön

Fallback response:

"used_fallback": true
9.6 Validator

Dosya:

backend/app/services/ai/guard/validator.py

AI çıktısını validate et.

Kurallar:

JSON parse edilemiyorsa hata.
title boşsa fallback kullan.
priority enum değilse medium yap.
status enum değilse todo yap.
confidence sayı değilse 50 yap.
confidence label confidence’a göre yeniden hesaplanabilir.
subtasks list değilse boş liste yap.
deadline parse edilemiyorsa null yap.
10. AI Usage Logging

Backend modeli ekle:

AIUsageLog

Alanlar:

id
user_id
provider
model
operation
input_chars
message_count
cache_hit
used_fallback
success
error_code
created_at

Bu log maliyet kontrolü ve debugging için kullanılacak.

Endpoint ekle:

GET /ai/usage/summary

Şimdilik admin/auth yok. Basit toplam istatistik dönebilir.

Örnek response:

{
  "total_requests": 42,
  "cache_hits": 8,
  "fallbacks": 3,
  "success_rate": 0.92
}
11. Backend Endpointleri

Aşağıdaki endpointleri ekle veya mevcut analyze endpointlerini AI Gateway’e bağla.

Analyze Text
POST /ai/analyze/text

Request:

{
  "text": "yarın saat 5'e kadar sunumu bitirmem lazım"
}

Response:

{
  "title": "Sunumu bitir",
  "deadline": "2026-06-28T17:00:00",
  "priority": "medium",
  "status": "todo",
  "subtasks": [],
  "confidence": 82,
  "cache_hit": false,
  "used_fallback": false
}
Analyze Thread
POST /ai/analyze/thread

Request:

{
  "messages": [
    "Codesight sunumunu hazırlayalım",
    "Avantaj dezavantaj da olsun",
    "CBOM kısmını da ekleyelim, cuma bitsin"
  ]
}
Analyze Inbox Item
POST /inbox/{item_id}/analyze

Bu endpoint AI Gateway kullanmalı.

Analyze Inbox Thread
POST /inbox/threads/{thread_id}/analyze

Bu endpoint AI Gateway kullanmalı.

Convert Draft To Task

Mevcut TaskDraft convert endpoint’i korunmalı:

POST /task-drafts/{draft_id}/convert-to-task

AI analysis result önce TaskDraft oluşturmalı, direkt Task oluşturmamalı.

12. Frontend UI Güncellemeleri
12.1 AI Preview

AI Preview’da şunlar gösterilmeli:

AI bunu şöyle anladı
Başlık
Açıklama
Proje
Son tarih
Öncelik
Durum
Yapılacaklar
Confidence
Cache hit
Fallback kullanıldı mı
Kaynak mesajlar

Eğer fallback kullanıldıysa:

Gemini yerine hızlı kural tabanlı analiz kullanıldı.

Eğer cache hit ise:

Bu analiz daha önce yapılmıştı, kayıtlı sonuç gösteriliyor.
12.2 Analyze Button States

Buton durumları:

AI ile Analiz Et
Analiz Ediliyor...
Tekrar Analiz Et
Kural Tabanlı Analiz Kullan

Loading state net olmalı.

12.3 Quota / Rate Limit UI

Backend quota veya rate limit hatası dönerse kullanıcıya Türkçe mesaj göster.

Örnek:

Bugünkü AI analiz hakkın doldu.
Çok hızlı istek gönderiyorsun. Biraz sonra tekrar dene.
12.4 AI Settings UI

Settings sayfasındaki AI bölümünü gerçek config ile uyumlu hale getir.

Alanlar:

AI aktif
Provider: Mock / Gemini
Fallback açık
Cache açık
Confidence eşiği
Günlük limit bilgisi

Frontend bu ayarları localStorage’da tutabilir, ama backend env esas kaynaktır.

12.5 AI Usage Dashboard Mini Widget

Settings veya Dashboard’da küçük AI usage widget göster:

AI Kullanımı
Bugün 8 analiz
2 cache sonucu
1 fallback

Bu widget /ai/usage/summary endpointinden veri çekebilir.

13. Security Rules

Aşağıdaki kurallar kesin uygulanmalı:

GEMINI_API_KEY hiçbir frontend dosyasında bulunmamalı.
GEMINI_API_KEY hiçbir NEXT_PUBLIC değişkeninde bulunmamalı.
.env .gitignore içinde kalmalı.
.env.example gerçek key içermemeli.
AI sadece backend üzerinden çağrılmalı.
AI direkt database write yapmamalı.
AI sonucu önce validate edilmeli.
AI sonucu kullanıcı review ekranından geçmeli.
Kullanıcının tüm sohbet geçmişi değil, sadece seçtiği mesajlar gönderilmeli.
14. Error Handling

AI hatalarında uygulama patlamamalı.

Hata tipleri:

AI_PROVIDER_NOT_CONFIGURED
AI_QUOTA_EXCEEDED
AI_RATE_LIMITED
AI_PROVIDER_TIMEOUT
AI_INVALID_JSON
AI_VALIDATION_FAILED
AI_UNKNOWN_ERROR

Her hata için Türkçe mesaj üret.

Örnek:

{
  "error": "AI_PROVIDER_NOT_CONFIGURED",
  "message": "AI sağlayıcısı yapılandırılmamış. Lütfen GEMINI_API_KEY ayarını kontrol et."
}
15. Testing / Manual Test Plan

README’ye manuel test planı ekle.

Test 1 - Health
GET http://127.0.0.1:8000/health

Beklenen:

{"status":"ok"}
Test 2 - AI text analysis
POST /ai/analyze/text

Body:

{
  "text": "Yarın saat 5'e kadar Codesight sunumunu bitirmem gerekiyor. Acil."
}

Beklenen:

Task draft JSON dönmeli.
Deadline yarın 17:00 olmalı.
Priority urgent veya high olmalı.
Test 3 - Thread analysis

Üç mesaj gönder:

Codesight sunumunu hazırlayalım.
Avantaj dezavantaj da olsun.
CBOM kısmını da ekleyelim, cuma bitmiş olsun.

Beklenen:

Tek task draft dönmeli.
Subtasks dolu olmalı.
Deadline cuma olmalı.
Test 4 - Cache

Aynı request ikinci kez gönder.

Beklenen:

"cache_hit": true
Test 5 - Fallback

GEMINI_API_KEY boş bırak.

Beklenen:

"used_fallback": true
Test 6 - Frontend

Inbox’ta mesajları seç, AI ile analiz et, preview gör, TaskDraft oluştur, Task’a çevir.

16. Docs Güncellemesi

Aşağıdaki dokümanları güncelle:

docs/architecture.md
docs/ai-architecture.md
docs/security.md
README.md
docs/ai-architecture.md içeriği

Şunları anlat:

AI Gateway nedir?
Provider interface nasıl çalışır?
Gemini nasıl bağlanır?
Quota nedir?
Rate limit nedir?
Cache nedir?
Fallback nedir?
AI neden direkt task oluşturmaz?
Güvenlik kuralları nelerdir?
17. Kabul Kriterleri

Bu task tamamlandığında:

google-genai dependency eklenmiş olmalı.
GEMINI_API_KEY backend .env’den okunmalı.
AI Gateway oluşturulmalı.
Provider interface olmalı.
MockProvider çalışmalı.
GeminiProvider çalışmalı veya key yoksa temiz hata/fallback vermeli.
Quota katmanı çalışmalı.
Rate limit katmanı çalışmalı.
Cache katmanı çalışmalı.
Fallback rule-based analysis çalışmalı.
Validator AI JSON çıktısını güvenli hale getirmeli.
AIUsageLog kaydı oluşturulmalı.
AIAnalysisCache kaydı oluşturulmalı.
POST /ai/analyze/text çalışmalı.
POST /ai/analyze/thread çalışmalı.
Inbox analyze endpointleri AI Gateway’e bağlanmalı.
AI sonucu TaskDraft üretmeli.
AI doğrudan Task oluşturmamalı.
Frontend AI Preview güncellenmeli.
Cache/fallback/quota durumları UI’da görünmeli.
AI Settings UI güncellenmeli.
README ve docs güncellenmeli.
Backend /health çalışmaya devam etmeli.
Mevcut CRUD bozulmamalı.
18. Yapılmayacaklar

Bu task’ta şunları yapma:

WhatsApp API entegrasyonu
Gmail API entegrasyonu
Google Calendar API entegrasyonu
Push notification
Authentication
Payment
Team management
Native mobile app
Local open-source LLM
Ollama entegrasyonu

Bu task yalnızca güvenli ve kontrollü gerçek AI extraction altyapısını kurar.