# DailyPlanner - Codex Task 11

## Sprint Başlığı

Authentication + Real Backend Integration + Critical CRUD Fixes

## Ana Amaç

DailyPlanner UI görünüyor ama bazı butonlar backend’e gerçek kayıt atmıyor. Inbox ve Task formları hata veriyor veya kayıt oluşturamıyor. Ayrıca uygulamada kullanıcı hesabı sistemi yok.

Bu task’ın amacı:

1. Web frontend’de tüm form ve butonları gerçek backend API’ye bağlamak
2. Task oluşturma, Inbox kaydı, Project oluşturma akışlarını gerçekten çalıştırmak
3. Backend response/error handling’i düzeltmek
4. Basit kayıt ol / giriş yap sistemi eklemek
5. Kullanıcıya ait verilerin ayrılacağı temel auth altyapısını kurmak
6. UI’da loading, success ve error durumlarını net göstermek

---

## 1. Kritik Problem

Şu an UI üzerinde:

- “Görev Oluştur” butonu kayıt atmıyor veya hata veriyor.
- “Inbox’a Kaydet” butonu çalışmıyor.
- Formlar backend’e bağlı gibi görünse de gerçek veri oluşmuyor.
- Hata mesajları yetersiz.
- Kullanıcı hesabı yok.
- Herkes aynı task/project/inbox verisini kullanıyor gibi davranabilir.

Bu kabul edilemez. Öncelik gerçek CRUD akışlarını çalışır hale getirmektir.

---

## 2. Öncelik Sırası

Bu task’ta önce auth değil, önce gerçek kayıt akışları düzeltilecek.

Sıra:

```txt
1. Backend endpointleri test et
2. Frontend API helperlarını düzelt
3. Task create/list/update/delete çalıştır
4. Inbox create/list/analyze çalıştır
5. Project create/list çalıştır
6. UI loading/success/error state ekle
7. Auth backend ekle
8. Auth frontend ekranları ekle
9. Verileri user_id ile ilişkilendir
10. README test adımlarını güncelle
3. Backend CRUD Kontrolü

Aşağıdaki endpointler gerçekten çalışmalı:

GET    /health

GET    /tasks
POST   /tasks
PATCH  /tasks/{task_id}
DELETE /tasks/{task_id}

GET    /projects
POST   /projects
PATCH  /projects/{project_id}
DELETE /projects/{project_id}

GET    /inbox
POST   /inbox
POST   /inbox/{item_id}/analyze

Her endpoint Postman/curl veya FastAPI docs üzerinden test edilmeli.

FastAPI docs şu adreste çalışmalı:

http://127.0.0.1:8000/docs
4. CORS Kontrolü

Frontend şu adreslerden backend’e istek atabilmeli:

http://localhost:3000
http://127.0.0.1:3000

CORS yoksa veya eksikse ekle.

5. Frontend API Helper

Dosya:

apps/web/src/lib/api.ts

Bu dosya merkezi API katmanı olmalı.

Aşağıdaki fonksiyonlar kesin çalışmalı:

getTasks()
createTask(payload)
updateTask(id, payload)
deleteTask(id)

getProjects()
createProject(payload)
updateProject(id, payload)
deleteProject(id)

getInboxItems()
createInboxItem(payload)
analyzeInboxItem(id)

analyzeText(text)
analyzeThread(messages)

API base URL:

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

Tüm isteklerde:

headers: {
  "Content-Type": "application/json"
}

kullanılmalı.

Auth eklendikten sonra token varsa:

Authorization: Bearer <token>

header’ı eklenmeli.

6. Task Create Fix

/tasks sayfasındaki “Görev Oluştur” formu gerçek backend’e kayıt atmalı.

Form alanları:

title
description
project_id
deadline
priority
status

Backend’e gönderilecek örnek payload:

{
  "title": "Codesight sunumunu hazırla",
  "description": "Cyber-Quanta için sunum hazırlanacak.",
  "project_id": null,
  "deadline": "2026-07-03T18:00:00",
  "priority": "medium",
  "status": "todo"
}

Kurallar:

Başlık zorunlu
Başlık en az 3 karakter
Priority default: medium
Status default: todo
Deadline boşsa null gönder
Project yoksa null gönder

Başarılı kayıt sonrası:

Görev başarıyla oluşturuldu.

mesajı göster.

Sonra task listesi refresh edilmeli veya optimistic olarak eklenmeli.

7. Inbox Create Fix

Inbox capture alanında “Inbox’a Kaydet” gerçek backend’e kayıt atmalı.

Text capture payload:

{
  "source_type": "manual",
  "content_type": "text",
  "raw_text": "WhatsApp mesajı buraya gelecek",
  "title": "Manuel capture",
  "metadata_json": {
    "platform": "web",
    "capture_method": "manual"
  }
}

Link capture payload:

{
  "source_type": "web",
  "content_type": "url",
  "raw_text": "https://example.com",
  "title": "Link capture",
  "source_url": "https://example.com",
  "metadata_json": {
    "platform": "web",
    "capture_method": "link"
  }
}

Başarılı kayıt sonrası:

Inbox kaydı oluşturuldu.

Hata varsa:

Inbox kaydı oluşturulamadı.

Ama hata console’da detaylı loglanmalı.

8. Project Create Fix

Project formu gerçek backend’e kayıt atmalı.

Payload:

{
  "name": "Cyber-Quanta",
  "description": "Cyber-Quanta işleri",
  "color": "#5D5491"
}

Başarılı kayıt sonrası:

Proje başarıyla oluşturuldu.
9. Backend Schema Uyumluluğu

Frontend payload ile backend Pydantic schema birebir uyumlu olmalı.

Eğer backend şu alanları bekliyorsa:

content_type
source_type
raw_text
metadata_json

frontend de aynı isimleri göndermeli.

Sorun çıkarmaması için backend schemas dosyalarında optional alanları doğru tanımla.

Örnek:

metadata_json: dict | None = None
source_url: str | None = None
title: str | None = None
10. Error Debugging

API helper hata durumunda sadece generic hata göstermemeli.

Backend response body’yi okumalı.

Örnek:

const errorText = await response.text();
console.error("API Error:", response.status, errorText);

UI’da sade Türkçe mesaj gösterilmeli:

Kayıt sırasında bir sorun oluştu.
AUTHENTICATION
11. Basit Auth Sistemi

Bu task’ta production-grade auth değil, MVP auth yapılacak.

Backend tarafında:

User
Register
Login
JWT access token
Current user endpoint
12. User Model

Yeni model:

User
- id
- email
- full_name
- hashed_password
- created_at
- updated_at

Email unique olmalı.

13. Auth Endpointleri

Backend endpointleri:

POST /auth/register
POST /auth/login
GET  /auth/me
Register Request
{
  "email": "mathis@example.com",
  "full_name": "Mathis",
  "password": "12345678"
}

Validation:

Email zorunlu
Password en az 8 karakter
Full name opsiyonel olabilir
Register Response
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "email": "mathis@example.com",
    "full_name": "Mathis"
  }
}
Login Request
{
  "email": "mathis@example.com",
  "password": "12345678"
}
Login Response

Register ile aynı.

14. Password Hashing

Plain password saklama.

Kullan:

passlib[bcrypt]
python-jose[cryptography]

requirements.txt güncellensin.

.env.example içine:

JWT_SECRET_KEY=change-me-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

ekle.

15. Auth Dependency

Backend’de dependency oluştur:

get_current_user()

JWT token doğrulasın.

16. User ID İlişkisi

Aşağıdaki modellere user_id ekle:

Task
Project
InboxItem
InboxThread
TaskDraft

Auth yokken migration problemi çıkmaması için development DB reset notu ekle.

Yeni oluşturulan kayıtlar current user’a bağlanmalı.

GET endpointleri sadece current user verisini döndürmeli.

17. Development Fallback

Auth eklendikten sonra geliştirme zorlaşmasın.

Ama güvenlik için varsayılan olarak endpointler auth gerektirsin.

İstersen .env ile dev mode desteklenebilir:

AUTH_REQUIRED=true

Ama frontend login ekranı ekleneceği için normal akış auth ile çalışmalı.

FRONTEND AUTH
18. Auth Sayfaları

Web app’e şu sayfaları ekle:

/login
/register

Login ekranı:

DailyPlanner
Tekrar hoş geldin
Email
Şifre
Giriş Yap
Hesabın yok mu? Kayıt ol

Register ekranı:

DailyPlanner’a hoş geldin
Ad Soyad
Email
Şifre
Kayıt Ol
Zaten hesabın var mı? Giriş yap

Tema mevcut Lilac/Purple/Yellow tema ile uyumlu olmalı.

19. Auth State

Frontend’de auth state yönetimi basit olabilir.

Kullan:

localStorage

Saklanacaklar:

access_token
current_user

Dosyalar:

apps/web/src/lib/auth.ts
apps/web/src/components/AuthGuard.tsx
20. Protected Routes

Aşağıdaki sayfalar login olmadan açılmamalı:

/
 /tasks
 /inbox
 /calendar
 /projects
 /focus
 /settings
 /integrations
 /review/daily
 /review/weekly

Login değilse /login sayfasına yönlendir.

21. Logout

Sidebar veya settings içine çıkış butonu ekle:

Çıkış Yap

Çıkış yapınca:

access_token silinir
current_user silinir
/login sayfasına yönlenir
22. Auth Header

API helper token varsa her isteğe eklemeli:

Authorization: `Bearer ${token}`

Token yoksa protected endpointlerde kullanıcı login’e yönlendirilmeli.

23. Mobile Auth Placeholder

Bu task’ta mobile auth tam yapılmak zorunda değil.

Ama apps/mobile README’ye not ekle:

Mobile auth ileriki taskta web auth ile uyumlu hale getirilecek.
Şimdilik backend URL ve manual capture test edilebilir.

Eğer kolay ise mobile login/register basit ekranları da eklenebilir ama web auth öncelikli.

24. Demo Kullanıcı

Seed script varsa demo user oluşturabilir:

Email: demo@dailyplanner.local
Password: demo12345

Ama README’de bunun sadece development için olduğu belirtilmeli.

25. README Güncellemesi

README’ye şu bölümleri ekle:

Register / Login
JWT auth
Demo user
Protected routes
Common auth errors

Common errors:

401 Unauthorized
Login olman gerekiyor. /login sayfasından giriş yap.
Invalid token
LocalStorage’daki access_token silinip tekrar giriş yapılmalı.
Database model changed
docker compose down -v
docker compose up -d postgres
26. Manual Test Plan

Şu testler geçmeli:

[ ] Register çalışıyor
[ ] Login çalışıyor
[ ] /auth/me çalışıyor
[ ] Login olmadan /tasks açılmıyor
[ ] Login sonrası /tasks açılıyor
[ ] Görev oluşturuluyor
[ ] Görev listede görünüyor
[ ] Inbox kaydı oluşturuluyor
[ ] Inbox listede görünüyor
[ ] Proje oluşturuluyor
[ ] Çıkış yapılıyor
[ ] Çıkış sonrası protected route login’e atıyor
[ ] Token API header’a ekleniyor
27. Kabul Kriterleri

Bu task tamamlandığında:

Görev Oluştur butonu gerçek backend’e kayıt atmalı.
Inbox’a Kaydet butonu gerçek backend’e kayıt atmalı.
Proje oluşturma gerçek backend’e kayıt atmalı.
API error handling düzelmiş olmalı.
Backend auth register/login/me çalışmalı.
Password hashlenmeli.
JWT token üretilmeli.
Frontend login/register ekranları olmalı.
Protected route sistemi çalışmalı.
Logout çalışmalı.
Task/Project/Inbox user_id ile ilişkilendirilmeli.
Kullanıcı sadece kendi verisini görmeli.
README güncellenmeli.
Manual test plan geçmeli.
28. Yapılmayacaklar

Bu task’ta şunları yapma:

OAuth
Google login
Magic link
Password reset email
Email verification
Role based access control
Team workspace
Payment
Production deployment

Bu task’ın amacı basit ama çalışan MVP auth ve gerçek CRUD bağlantılarını düzeltmektir.