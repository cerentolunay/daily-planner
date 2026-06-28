# Play Store Release Preparation

## MVP Release Checklist

- App adı, ikon, splash screen ve paket adı kesinleştir.
- Privacy Policy URL hazırlanır.
- Data Safety formunda toplanan veri türleri belirtilir:
  - E-posta adresi
  - Kullanıcı tarafından girilen görev ve inbox metinleri
  - Uygulama içi ayarlar
- Hesap silme ve veri silme politikası belgelenir.
- Production backend URL mobile config üzerinden netleştirilir.
- AI key, SMTP key ve database credential mobile bundle içine konmaz.
- Android share intent gerçek cihazda test edilir.
- Release build Expo/EAS üzerinden alınır.
- Internal testing track ile ilk kapalı test yapılır.

## Security Checks

- `GEMINI_API_KEY`, SMTP password ve JWT secret repo içinde gerçek değerle bulunmaz.
- `.env.example` yalnızca placeholder/default değer içerir.
- Login, register, verify, reset password ve refresh akışları manuel test edilir.
- Yanlış kod 5 kez denendiğinde geçici kilit doğrulanır.
- Aynı e-postaya 60 saniye içinde tekrar kod gönderimi engellenir.

## Not in This MVP

- Native secure storage entegrasyonu
- Production push notification
- Gerçek WhatsApp Business API
- Payment veya subscription
