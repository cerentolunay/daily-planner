# DailyPlanner Mobile

Expo React Native Mobile MVP.

## Setup

```bash
cd apps/mobile
npm install
npx expo start
```

Android emulator:

```bash
npx expo start --android
```

## Backend URL

Default development URL:

```txt
http://localhost:8000
```

Android Emulator genellikle host makineye şu URL ile erişir:

```txt
http://10.0.2.2:8000
```

Gerçek telefon kullanırken bilgisayarın local IP adresini kullan:

```txt
http://192.168.x.x:8000
```

Bu değer mobil uygulamada Ayarlar ekranından değiştirilebilir.

## Capture Flow

1. WhatsApp mesajını kopyala.
2. DailyPlanner mobil uygulamasını aç.
3. Inbox ekranında Yapıştır alanına bırak.
4. Inbox'a Kaydet.
5. AI ile Analiz Et.
6. AI Preview üzerinden TaskDraft gör.
7. Görev Olarak Kaydet.

## Offline Queue

Backend erişilemezse capture kaybolmaz. Uygulama capture içeriğini AsyncStorage içinde bekleyen kuyruğa alır.

## Android Share Intent

app.json içinde ACTION_SEND için text/plain ve text/* intent filter hazırlığı vardır.

Expo managed workflow'da Android share target davranışı sınırlı olabilir. Tam production share-to-app deneyimi için Expo prebuild veya custom native module gerekebilir.

Manual paste fallback akışı V1 için ana ve güvenli akıştır.

## Auth Flow

Mobil uygulama backend auth endpointlerini kullanır:

1. Kayıt ol.
2. E-postaya gönderilen 6 haneli kodu doğrula.
3. Giriş yap.
4. Access token süresi dolarsa refresh token ile oturum yenilenir.
5. Ayarlar ekranından çıkış yapılınca tokenlar cihazdan temizlenir.

Şifre sıfırlama akışı mobil giriş ekranında bulunur:

1. Şifremi Unuttum.
2. E-posta gir.
3. 6 haneli kodu gir.
4. Yeni şifre belirle.

Play Store hazırlık checklist'i için `docs/play-store-release.md` dosyasına bak.

## Security

- Gemini API key mobil uygulamada bulunmaz.
- Mobil app yalnızca backend endpointlerini çağırır.
- Kullanıcı paylaşmadan hiçbir WhatsApp mesajı okunmaz.
- Bekleyen local captures cihazda AsyncStorage ile tutulur.
- Auth tokenları AsyncStorage içinde tutulur; production sürümde native secure storage değerlendirilmelidir.
