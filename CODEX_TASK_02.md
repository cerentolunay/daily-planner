# DailyPlanner - Codex Task 02

## Amaç

Mevcut DailyPlanner projesinde iki ana problem var:

1. Frontend UI çok tek renkli ve zayıf görünüyor.
2. Backend local çalıştırmada dependency ve Docker yapılandırma problemleri var.

Bu task’ın amacı:

* UI’ı modern, premium ve renk paletine uygun hale getirmek
* Backend’i hatasız local çalışacak hale getirmek
* Docker Compose yapılandırmasını düzeltmek
* Projeyi geliştirilebilir, temiz ve stabil bir MVP seviyesine taşımak

---

## 1. UI Revizyonu

Mevcut arayüz çok düz ve tek renkli duruyor. DailyPlanner bir admin paneli gibi değil, her gün açılacak modern bir planner gibi görünmeli.

### Kullanılacak Renk Paleti

```txt
Burnt Orange: #FE7E3C
Lust Red:     #E4201B
Copper:       #6D413C
Blue Lagoon:  #0E6873
Black Pearl:  #1A2C30
White:        #FFFFFF
```

### UI Kuralları

* Ana arka plan Black Pearl olmalı.
* CTA butonları Burnt Orange olmalı.
* İkincil butonlar Blue Lagoon olmalı.
* Geciken, acil ve riskli görevlerde Lust Red kullanılmalı.
* Sıcak nötr kart aksanlarında Copper kullanılmalı.
* Beyaz metin kullanılmalı ama her yerde saf beyaz kullanılmasın; açıklama metinleri daha soluk olabilir.
* Tek renk hissi kırılmalı.
* Kartlarda border, hafif gölge ve renkli aksan çizgileri kullanılmalı.
* UI modern, sade, premium ve mobil uyumlu olmalı.

---

## 2. Sidebar İyileştirmesi

Mevcut sidebar çok boş duruyor.

Sidebar içinde şunlar olmalı:

```txt
DAILYPLANNER
Planla, takip et, unutma.

Bugünkü Durum
- 5 görev
- 2 geciken
- 1 acil

Navigasyon
- Bugün
- Görevler
- Gelen Kutusu
- Takvim
- Projeler
- Ayarlar

Alt bölüm
- Hızlı Görev Ekle
```

Aktif menü item’ı Burnt Orange ile vurgulansın.

---

## 3. Dashboard / Bugün Sayfası

Ana sayfa daha ürün hissi vermeli.

Route:

```txt
/
```

Dashboard şu bölümleri içermeli:

### Üst Hero Alanı

```txt
Günaydın, Mathis
Bugün 5 görevin var. 2 görev gecikmiş.
```

Sağ tarafta küçük bir tarih kartı olabilir.

### Özet Kartları

4 adet özet kartı oluştur:

```txt
Bugünkü Görevler
Gecikenler
Acil İşler
Tamamlananlar
```

Her kart farklı aksan rengi kullansın:

* Bugünkü Görevler → Blue Lagoon
* Gecikenler → Lust Red
* Acil İşler → Burnt Orange
* Tamamlananlar → Copper

### Bugünün Odağı

Büyük bir focus card:

```txt
Bugünün Odağı
Codesight sunumunu hazırla
Cyber-Quanta
Son tarih: Bugün
```

### Görev Listesi

Task card’lar daha güçlü görünmeli:

* Sol tarafta renkli priority çizgisi
* Başlık
* Proje adı
* Son tarih
* Durum
* Priority badge

Priority renkleri:

```txt
Düşük   → Blue Lagoon
Orta    → Copper
Yüksek  → Burnt Orange
Acil    → Lust Red
```

---

## 4. Görevler Sayfası

Route:

```txt
/tasks
```

Filtreler daha iyi tasarlanmalı:

```txt
Bugün
Yaklaşanlar
Gecikenler
Tamamlananlar
```

Aktif filtre Burnt Orange olmalı.

Task card’lar dashboard ile aynı tasarım sistemini kullanmalı.

Geciken task’larda kırmızı uyarı border’ı olsun.

---

## 5. Gelen Kutusu Sayfası

Route:

```txt
/inbox
```

Bu sayfa WhatsApp mesajından task üretme hissini vermeli.

Textarea placeholder:

```txt
WhatsApp, e-posta veya mesajdan gelen işi buraya yapıştır...
```

Buton:

```txt
Göreve Dönüştür
```

Mock detection card:

```txt
Algılanan Görev
Başlık: Codesight sunumunu hazırla
Proje: Cyber-Quanta
Son tarih: Cuma
Öncelik: Yüksek
```

Bu kartta Burnt Orange ve Blue Lagoon aksanları kullanılsın.

---

## 6. Takvim Sayfası

Route:

```txt
/calendar
```

Basit haftalık görünüm oluştur.

Günler:

```txt
Pazartesi
Salı
Çarşamba
Perşembe
Cuma
Cumartesi
Pazar
```

Her günün altında küçük task kartları olsun.

Bugünün günü Burnt Orange border ile vurgulansın.

Geciken görev varsa Lust Red badge gösterilsin.

---

## 7. Projeler Sayfası

Route:

```txt
/projects
```

Project card’lar renkli ve daha dolu olmalı.

Mock projeler:

```txt
Heptapus
Cyber-Quanta
Üniversite
Kişisel
```

Her kartta:

```txt
Aktif görev
Geciken görev
Sıradaki son tarih
```

Her proje farklı aksan rengi kullansın.

---

## 8. Backend Düzeltmeleri

Backend şu anda dependency hatası veriyor.

`requirements.txt` içinde şu yanlış versiyon varsa düzelt:

```txt
uvicorn==0.24.1
```

Doğru değer:

```txt
uvicorn==0.24.0
```

Ayrıca backend şu komutla çalışmalı:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

Health endpoint kesin çalışmalı:

```txt
GET /health
```

Beklenen çıktı:

```json
{
  "status": "ok"
}
```

---

## 9. Docker Düzeltmeleri

Docker Compose şu servisleri içermeli:

```txt
postgres
backend
web
```

Web için Dockerfile eksikse oluştur.

Dosya yolu:

```txt
apps/web/Dockerfile
```

İçerik:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

Backend Dockerfile kontrol edilsin.

Backend servisinin portu:

```txt
8000:8000
```

Web servisinin portu:

```txt
3000:3000
```

Docker Compose şu komutla çalışmalı:

```powershell
docker compose up --build
```

---

## 10. Local Çalıştırma Dokümantasyonu

README içine Windows PowerShell için net komutlar ekle.

### Frontend local

```powershell
cd apps\web
npm install
npm run dev
```

### Backend local

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Docker

```powershell
docker compose up --build
```

### Test adresleri

```txt
Frontend: http://localhost:3000
Backend:  http://localhost:8000/health
```

---

## 11. Kabul Kriterleri

Bu task tamamlandığında:

* Frontend `http://localhost:3000` üzerinde çalışmalı.
* Backend `http://localhost:8000/health` üzerinde çalışmalı.
* UI artık tek renkli görünmemeli.
* Verilen renk paleti aktif şekilde kullanılmalı.
* Tüm görünür frontend metinleri Türkçe olmalı.
* Sidebar daha dolu ve kullanışlı olmalı.
* Dashboard gerçek planner hissi vermeli.
* Docker Compose çalışır durumda olmalı.
* README local ve docker çalıştırma adımlarını net anlatmalı.

---

## 12. Yapılmayacaklar

Bu task’ta şunları yapma:

```txt
Gerçek AI entegrasyonu
WhatsApp API
Google Calendar API
Authentication
Push notification
Payment
Team management
```

Sadece UI iyileştirme, backend düzeltme, Docker düzeltme ve dokümantasyon yapılacak.
