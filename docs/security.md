# Security

## AI Key Safety

Gemini API key backend environment değişkeni olarak saklanır:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=real_key_here
```

Bu key frontend'e gönderilmez ve `NEXT_PUBLIC_` prefix'i ile tanımlanmaz.

Docker Compose varsayılanı `AI_PROVIDER=mock` ve boş `GEMINI_API_KEY` ile gelir. Böylece yerel MVP çalıştırması gerçek provider key'i olmadan fallback/mock akışla güvenli şekilde açılır.

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

## Auth ve Veri İzolasyonu

Backend `POST /auth/register`, `POST /auth/login` ve `GET /auth/me` endpointlerini sağlar. Task, Project, Inbox, TaskDraft ve AI endpointleri bearer token ister.

Kayıt akışı e-posta doğrulama kodu gerektirir. `POST /auth/register` kod gönderir, `POST /auth/verify-email` hesabı aktif eder. Şifre sıfırlama `POST /auth/forgot-password` ve `POST /auth/reset-password` üzerinden 6 haneli kodla yapılır.

Task, Project, InboxItem, InboxThread, TaskDraft ve Subtask kayıtları `user_id` ile kullanıcıya bağlanır. Listeleme, okuma, güncelleme ve silme işlemleri sadece oturumdaki kullanıcının kayıtlarını döndürür.

Şifreler düz metin saklanmaz; PBKDF2-SHA256 ile salt'lı hash olarak tutulur. JWT imzası `JWT_SECRET_KEY` environment değişkeninden üretilir.

Access token kısa sürelidir; refresh token `/auth/refresh` ile yeni token pair almak için kullanılır. Logout client tarafında tokenları temizler.

## Rate Limit ve Quota

MVP'de in-memory quota ve rate limit uygulanır. Üretim ortamında bu sayaçlar kullanıcı bazlı ve kalıcı bir store üzerinden yönetilmelidir.
