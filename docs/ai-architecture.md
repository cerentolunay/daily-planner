# AI Architecture

DailyPlanner AI katmanı backend içinde çalışır. API key frontend'e gitmez ve `NEXT_PUBLIC_*` değişkeni olarak tanımlanmaz.

## AI Gateway

`backend/app/services/ai/gateway.py` uygulamanın AI'a açılan tek kapısıdır. Gateway şu sırayı uygular:

1. Input validation ve sanitization
2. Cache kontrolü
3. Quota kontrolü
4. Rate limit kontrolü
5. Provider seçimi
6. Gemini veya Mock provider çağrısı
7. Safe JSON parsing ve validation
8. Rule-based fallback
9. Usage logging

## Provider Interface

Provider'lar `AIProvider` interface'ini uygular:

- `MockProvider`: rule-based analiz motorunu AI formatında döndürür.
- `GeminiProvider`: backend env içindeki `GEMINI_API_KEY` ile Gemini API çağrısı yapar.

Yerel Docker Compose varsayılanı `AI_PROVIDER=mock` olarak ayarlanmıştır. Gerçek Gemini çağrısı için `.env` içinde `AI_PROVIDER=gemini` ve geçerli `GEMINI_API_KEY` tanımlanmalıdır.

## Guard Layer

- Quota: günlük analiz limitini kontrol eder.
- Rate limit: dakikalık istek sayısını sınırlar.
- Cache: aynı input için Gemini'ye tekrar gitmez.
- Validator: AI JSON çıktısını enum, confidence, deadline ve subtask kurallarına göre normalize eder.
- Fallback: Gemini key yoksa, timeout olursa veya JSON bozuksa rule-based engine kullanılır.

Quota veya rate limit aşılırsa fallback kullanılmaz; kullanıcıya net hata döner.

## Neden AI Direkt Task Oluşturmaz?

AI yalnızca `TaskDraft` üretir. Kullanıcı AI Preview ekranında başlık, açıklama, proje, deadline, öncelik, durum ve subtasks alanlarını görür. Onay sonrası `TaskDraft -> Task + Subtasks` dönüşümü yapılır.

Bu tasarım yanlış çıkarım riskini azaltır ve kullanıcının kontrolünü korur.

## Güvenlik Kuralları

- `GEMINI_API_KEY` sadece backend environment içinde tutulur.
- Frontend AI provider'a direkt çağrı yapmaz.
- Seçili mesajlar dışında veri AI'a gönderilmez.
- AI çıktısı validate edilmeden DB'ye yazılmaz.
- Gerçek task oluşturma kullanıcı onayına bağlıdır.
