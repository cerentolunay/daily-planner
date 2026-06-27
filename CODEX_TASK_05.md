# DailyPlanner - Codex Task 05

## Amaç

Bu task’ın amacı DailyPlanner MVP’sini basit CRUD uygulamasından gerçek bir günlük planlama asistanına yaklaştırmaktır.

Bu task’ta gerçek AI entegrasyonu yapılmayacak. Ancak uygulama, mevcut görev verilerini kullanarak akıllı öneriler ve günlük planlama deneyimi sunacak.

Hedefler:

1. Günlük plan oluşturma deneyimi
2. Akıllı önceliklendirme mantığı
3. Görevleri sürüklemeden ama kolayca güne atama
4. Takvim ve görev listesi arasındaki bağlantıyı güçlendirme
5. Inbox’tan çıkarılan görevleri daha doğru yorumlama
6. Kullanıcıya “bugün ne yapmalıyım?” cevabı verebilen bir dashboard
7. UI polish ve küçük animasyonlar
8. Daha iyi hata/başarı bildirimleri

---

## 1. Tema Korunacak

Açık ve neşeli tema korunmalı.

Renkler:

```txt
Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Ana arka plan:

#D2C7FF

Uygulama karanlık, kurumsal veya admin paneli gibi görünmemeli.

2. Daily Plan Özelliği

Dashboard’a yeni bir bölüm ekle:

Bugünkü Planın

Bu bölüm kullanıcının bugünkü işleri için önerilen sırayı göstermeli.

Sıralama mantığı:

Geciken ve tamamlanmamış görevler
Bugün deadline’ı olan acil/yüksek görevler
Bugün deadline’ı olan normal görevler
Deadline’ı yaklaşan yüksek öncelikli görevler
Deadline’ı olmayan ama devam eden görevler

Her önerilen görevde şu bilgiler olmalı:

Sıra numarası
Görev başlığı
Proje
Öncelik
Son tarih
Tahmini önem etiketi

Tahmini önem etiketleri:

Hemen ilgilen
Bugün bitmeli
Yakında önemli
Boşlukta yapılabilir
3. Focus Mode Mock

Gerçek focus timer şart değil ama basit bir “Odak Modu” ekranı/alanı ekle.

Route:

/focus

İçerik:

Kullanıcı bugünkü plandan bir görev seçebilmeli.
Seçili görev büyük kart olarak gösterilmeli.
Basit butonlar:
Odaklanmaya Başla
Tamamlandı Olarak İşaretle
Sonra Devam Et

Timer çalıştırmak zorunda değilsin. İstersen 25:00 statik Pomodoro görseli koyabilirsin.

Amaç, ileride gerçek timer eklenecek alanı hazırlamak.

4. Navigation Güncellemesi

Sidebar’a yeni menü ekle:

Odak

Sıralama:

Bugün
Görevler
Gelen Kutusu
Takvim
Projeler
Odak
Ayarlar

Aktif menü görünür olmalı.

5. Task Scheduling UX

Task card üzerinde yeni hızlı aksiyonlar ekle:

Bugüne Al
Yarına Al
Bu Hafta
Son Tarihi Temizle

Bu aksiyonlar task’ın deadline alanını güncellemeli.

Kurallar:

Bugüne Al → deadline bugün saat 18:00
Yarına Al → deadline yarın saat 18:00
Bu Hafta → bu haftanın cuma günü saat 18:00
Son Tarihi Temizle → deadline null

Bu aksiyonlar UI’da küçük buton veya dropdown olarak gösterilebilir.

6. Smart Inbox Geliştirme

Inbox mock extraction biraz daha akıllı hale gelsin.

Metinden şu bilgileri çıkarmaya çalış:

Deadline kelimeleri
bugün
yarın
bu hafta
haftaya
cuma
pazartesi
salı
çarşamba
perşembe
cumartesi
pazar
Priority kelimeleri
acil → urgent
önemli → high
kritik → urgent
ufak → low
basit → low
sonra → low
Status kelimeleri
beklemede → waiting
başladım → in_progress
devam ediyor → in_progress
bitti → done
tamamlandı → done
Project tahmini

Eğer metin içinde şu kelimeler geçerse proje adı öner:

heptapus → Heptapus
cyber-quanta → Cyber-Quanta
cyber quanta → Cyber-Quanta
üniversite → Üniversite
okul → Üniversite
kişisel → Kişisel

Eğer ilgili proje veritabanında yoksa sadece öneri olarak göster, otomatik oluşturma.

7. Dashboard Insight Kartları

Dashboard’a küçük insight kartları ekle.

Örnekler:

Bugün en yoğun projen: Cyber-Quanta
Bu hafta 8 görevin var
2 görev gecikmiş durumda
Tamamlanan görev oranın %42

Bunlar gerçek task verisinden hesaplanmalı.

Eğer veri yoksa empty state göster:

Henüz analiz yapacak kadar görev yok.
8. Progress ve Completion

Task listesinde progress hissi ver.

Dashboard’da:

Bugünkü tamamlanma oranı

hesapla:

completed_today / total_today

Progress bar göster.

Eğer bugünkü görev yoksa:

Bugün için planlanmış görev yok.
9. Notifications Mock UI

Gerçek push notification yapma.

Ama Ayarlar sayfasında notification tercihleri için UI hazırla.

Route:

/settings

Alanlar:

Deadline yaklaşınca hatırlat
Geciken görevleri göster
Günlük plan özeti
Haftalık özet

Bu ayarlar frontend state veya localStorage’da tutulabilir.

Backend’e bağlamak zorunda değilsin.

10. LocalStorage User Preferences

Frontend’de basit kullanıcı tercihlerini localStorage’da sakla.

Saklanacak alanlar:

sidebar collapsed state
notification mock settings
default task priority
default deadline hour

Bunlar backend’e yazılmayacak.

11. Backend Değişiklikleri

Backend’de büyük değişiklik yapma.

Sadece gerekiyorsa:

Task deadline null kabul etmeli.
PATCH task endpoint’i partial update desteklemeli.
CORS çalışmaya devam etmeli.
Pydantic V2 uyumluluğu korunmalı.

Yeni tablo ekleme.

12. UI Polish

Aşağıdaki küçük UI iyileştirmelerini yap:

Buton hover state
Kart hover state
Form focus state
Başarı mesajları
Hata mesajları
Boş durumlarda küçük açıklama metinleri
Mobilde daha iyi spacing
Sayfalar arası görsel tutarlılık

Animasyon istersen çok hafif olmalı. Gereksiz animasyon ekleme.

13. Kabul Kriterleri

Bu task tamamlandığında:

Dashboard’da “Bugünkü Planın” bölümü çalışmalı.
Günlük plan gerçek task verisinden hesaplanmalı.
Focus route /focus açılmalı.
Sidebar’da Odak menüsü görünmeli.
Task card üzerinden hızlı deadline aksiyonları çalışmalı.
Inbox daha akıllı deadline/priority/status/project tahmini yapmalı.
Dashboard insight kartları gerçek veriden hesaplanmalı.
Progress bar çalışmalı.
Settings sayfasında notification mock ayarları olmalı.
localStorage tercihleri çalışmalı.
Backend /health çalışmaya devam etmeli.
CRUD akışları bozulmamalı.
UI açık, neşeli ve Lilac temalı kalmalı.
14. Yapılmayacaklar

Bu task’ta şunları yapma:

Gerçek AI API entegrasyonu
WhatsApp API entegrasyonu
Google Calendar API entegrasyonu
Push notification
Authentication
Payment
Team management
Native mobile app

Bu task’ın amacı AI’sız akıllı planner deneyimini güçlendirmektir.