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

## Security

- Gemini API key mobil uygulamada bulunmaz.
- Mobil app yalnızca backend endpointlerini çağırır.
- Kullanıcı paylaşmadan hiçbir WhatsApp mesajı okunmaz.
- Bekleyen local captures cihazda AsyncStorage ile tutulur.
