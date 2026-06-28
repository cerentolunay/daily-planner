# Privacy and Security

## Auth Flow

- Kayıt sonrası hesap hemen aktif olmaz.
- Backend 6 haneli e-posta doğrulama kodu üretir.
- Kod 10 dakika geçerlidir.
- Aynı e-postaya 60 saniyede bir yeni kod gönderilebilir.
- 5 hatalı kod denemesinden sonra geçici kilit uygulanır.
- Giriş yalnızca `is_email_verified=true` hesaplarda çalışır.

## Password Reset

- Kullanıcı e-posta adresini girer.
- Backend 6 haneli şifre sıfırlama kodu gönderir.
- Kod doğrulanınca yeni şifre hashlenerek kaydedilir.
- Şifreler düz metin saklanmaz; PBKDF2-SHA256 ve salt kullanılır.

## Session Handling

- Access token kısa sürelidir.
- Refresh token daha uzun sürelidir ve access token yenilemek için kullanılır.
- Web tokenları localStorage içinde saklar.
- Mobile tokenları AsyncStorage içinde saklar.
- Logout client tarafında tokenları temizler.

## Email and SMTP

- SMTP bilgileri sadece backend `.env` içinde tutulur.
- SMTP yapılandırılmamışsa development ortamında kod console log olarak yazılır.
- Frontend ve mobile uygulamaya SMTP bilgisi veya AI key verilmez.

## Data Isolation

- Task, Project, Inbox, Thread, TaskDraft ve Subtask kayıtları `user_id` ile ayrılır.
- Korunan endpointler bearer token ister.
- Kullanıcılar başka kullanıcıların kayıtlarını listeleyemez, okuyamaz, güncelleyemez veya silemez.

## Mobile Privacy

- WhatsApp mesajları otomatik okunmaz.
- Kullanıcı manuel paste/share yapmadan içerik backend'e gönderilmez.
- Offline capture queue cihazda AsyncStorage ile tutulur.
- Gemini API key mobil uygulamada bulunmaz.
