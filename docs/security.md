# Security

## AI Key Safety

Gemini API key backend environment değişkeni olarak saklanır:

```env
GEMINI_API_KEY=your_api_key_here
```

Bu key frontend'e gönderilmez ve `NEXT_PUBLIC_` prefix'i ile tanımlanmaz.

## AI Request Scope

AI analizi yalnızca kullanıcının seçtiği metin veya thread mesajları üzerinden yapılır. Uygulama tüm sohbet geçmişini veya ilgisiz verileri provider'a göndermez.

## AI Output Safety

AI çıktısı önce validator katmanından geçer:

- JSON parse edilir.
- Priority ve status enum değerleri normalize edilir.
- Deadline parse edilemiyorsa `null` yapılır.
- Subtask listesi sınırlandırılır.
- Confidence değeri 0-100 arasına çekilir.

## Task Creation Safety

AI doğrudan task oluşturmaz. Önce `TaskDraft` oluşturulur. Kullanıcı AI Preview ekranında onay verirse task ve subtasks kaydedilir.

## Rate Limit ve Quota

MVP'de in-memory quota ve rate limit uygulanır. Üretim ortamında bu sayaçlar kullanıcı bazlı ve kalıcı bir store üzerinden yönetilmelidir.
