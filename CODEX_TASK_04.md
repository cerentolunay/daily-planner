# DailyPlanner - Codex Task 04

## Amaç

Bu task’ın amacı DailyPlanner MVP’sini “çalışıyor” seviyesinden “kullanılabilir ve demo yapılabilir” seviyeye taşımaktır.

Mevcut hedef durum:

- Backend çalışıyor.
- PostgreSQL bağlantısı çalışıyor.
- Frontend açılıyor.
- Görevler ve projeler backend’e bağlanmaya başladı.
- UI açık Lilac temaya taşınıyor.

Bu task ile hedef:

1. Görev yönetimini kullanıcı açısından daha pratik hale getirmek
2. Arama, filtreleme, sıralama ve empty/loading/error state eklemek
3. Form validation eklemek
4. UI responsive davranışını iyileştirmek
5. Dashboard’u daha anlamlı hale getirmek
6. Inbox → Task dönüşüm akışını daha kullanılabilir yapmak
7. Kod kalitesini toparlamak
8. README ve docs dosyalarını güncellemek

---

## 1. UI Tema Korunacak

Dark tema kullanma.

Sadece şu ana renk paleti kullanılacak:

```txt
Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Tema karakteri:

Açık
Neşeli
Modern
Ferah
Günlük planner hissi veren
Admin paneli gibi olmayan

Ana arka plan:

#D2C7FF

Başlık/metin vurguları:

#5D5491

CTA:

#FFD230

Başarı/tamamlandı:

#E1FB62

Tüm görünür metinler Türkçe kalmalı.

2. Task UX İyileştirmeleri

/tasks sayfasına şu özellikleri ekle:

Arama

Kullanıcı görev başlığı, açıklaması veya proje adına göre arama yapabilmeli.

Placeholder:

Görevlerde ara...
Filtreler

Filtreler:

Tümü
Bugün
Yaklaşanlar
Gecikenler
Tamamlananlar
Acil

Aktif filtre Yellow ile vurgulansın.

Sıralama

Basit sıralama dropdown’u ekle:

Son tarihe göre
Önceliğe göre
Oluşturulma tarihine göre
Quick Status Update

Task card üzerinde hızlı durum değiştirme olsun:

Yapılacak
Devam Ediyor
Beklemede
Tamamlandı

Kullanıcı task detayına girmeden status değiştirebilmeli.

3. Task Form Validation

Yeni görev eklerken validation ekle.

Kurallar:

Başlık zorunlu
Başlık en az 3 karakter olmalı
Son tarih boş olabilir
Öncelik boşsa varsayılan: Orta
Durum boşsa varsayılan: Yapılacak

Hata mesajları Türkçe olmalı.

Örnek:

Başlık zorunludur.
Başlık en az 3 karakter olmalıdır.
4. Task Detail / Edit Akışı

Her task card üzerinde:

Düzenle
Sil
Tamamla

aksiyonları olmalı.

Düzenle butonu task formunu edit modunda açmalı.

Silme işleminde kullanıcıya confirmation göster:

Bu görevi silmek istediğine emin misin?
5. Dashboard İyileştirme

/ sayfası gerçek task verisine göre daha anlamlı olmalı.

Dashboard bölümleri:

Günlük Özet
Bugün seni bekleyen işler

Kartlar:

Bugünkü Görevler
Gecikenler
Acil İşler
Tamamlananlar
Bugünün Odağı

Mantık:

Önce deadline bugün olan ve tamamlanmamış görevlerden en yüksek öncelikli olanı seç
Yoksa geciken görevlerden en yüksek öncelikli olanı seç
Yoksa yaklaşan görevlerden ilkini seç
Hiç görev yoksa empty state göster

Empty state:

Bugünün odağı hazır değil. Yeni bir görev ekleyerek planlamaya başlayabilirsin.
Yaklaşan Deadline’lar

Önümüzdeki 7 gün içindeki görevleri göster.

6. Inbox UX İyileştirmesi

/inbox sayfasında mesajdan görev çıkarma deneyimini iyileştir.

Kullanıcı metin yapıştırınca:

“Göreve Dönüştür” butonu aktif olsun.
Boş metinde buton disabled olsun.
Çıkarılan alanlar düzenlenebilir olsun.
Kullanıcı “Görev Olarak Kaydet” dediğinde task backend’e kaydedilsin.
Kaydetme başarılı olursa başarı mesajı göster:
Görev başarıyla oluşturuldu.
Kaydetme sonrası form temizlensin.

Mock extraction kuralları:

"bugün" geçerse deadline bugün
"yarın" geçerse deadline yarın
"acil" geçerse priority urgent
"önemli" geçerse priority high
"beklemede" geçerse status waiting

UI’da bu alanlar Türkçe gösterilsin.

7. Projects UX İyileştirmesi

/projects sayfasında:

Proje arama ekle
Yeni proje ekleme formu ekle
Proje rengi seçme alanı olsun
Proje kartında şu bilgiler gösterilsin:
Toplam görev
Aktif görev
Tamamlanan görev
Geciken görev

Bir proje silinirken confirmation göster:

Bu projeyi silmek istediğine emin misin?
8. Calendar UX İyileştirmesi

/calendar sayfasında haftalık görünüm iyileştirilsin.

Özellikler:

Bu haftanın günleri gösterilsin.
Bugünün günü Yellow border ile vurgulansın.
Deadline’ı olmayan görevler takvimde gösterilmesin.
Geciken görevler ayrı küçük bir bölümde gösterilsin:
Takvime düşmeyen geciken işler
9. Loading / Error / Empty State

Tüm veri çeken sayfalarda loading ve error state olmalı.

Sayfalar:

/
 /tasks
 /projects
 /calendar
 /inbox

Loading örnek metni:

Veriler yükleniyor...

Error örnek metni:

Veriler alınırken bir sorun oluştu.

Empty state örnekleri:

Henüz görev yok.
Henüz proje yok.
Bu hafta planlanmış görev yok.
10. Responsive İyileştirme

UI şu ekranlarda düzgün görünmeli:

Desktop
Laptop
Tablet
Mobile width

Mobilde:

Sidebar collapse edilebilir veya üst menüye dönüşebilir.
Kartlar tek kolona düşmeli.
Formlar taşmamalı.
Butonlar rahat tıklanabilir olmalı.
11. Kod Kalitesi

Şunlara dikkat et:

TypeScript tipleri net olsun.
API response tipleri tanımlı olsun.
Aynı kod tekrar edilmesin.
Component’ler küçük ve okunabilir olsun.
Magic string’leri constants dosyasına taşı.
Türkçe label mapping’leri tek yerde toplansın.

Önerilen dosya:

apps/web/src/constants/labels.ts

İçerik örnekleri:

export const priorityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
};

export const statusLabels = {
  todo: "Yapılacak",
  in_progress: "Devam Ediyor",
  waiting: "Beklemede",
  done: "Tamamlandı",
  cancelled: "İptal Edildi",
};
12. Backend Küçük Düzeltmeler

Pydantic V2 uyarıları var.

Şu eski config kullanılıyorsa:

orm_mode = True

Bunu Pydantic V2 uyumlu hale getir:

from_attributes = True

Route response’larında hata varsa düzelt.

CORS ayarı doğrulansın:

http://localhost:3000
http://127.0.0.1:3000

adreslerinden gelen istekler kabul edilmeli.

13. Docker Compose Kontrolü

docker-compose.yml dosyası geçerli YAML olmalı.

Şu komut hata vermemeli:

docker compose config

PostgreSQL port mapping doğru kalmalı:

ports:
  - "5433:5432"

Gereksiz veya bozuk satırlar temizlenmeli.

Özellikle şu tarz bozuk satırlar olmamalı:

432:5432"
14. README Güncellemesi

README’ye şu bölümleri ekle veya güncelle:

Local Development
Docker Development
Environment Variables
Common Errors

Common Errors içinde şunlar olmalı:

5432 port is already allocated

Çözüm:

PostgreSQL Docker container localde 5433 portuna maplenmiştir.
backend/.env içinde localhost:5433 kullanılmalıdır.
Backend health check
http://127.0.0.1:8000/health
Frontend
http://localhost:3000
15. Kabul Kriterleri

Bu task tamamlandığında:

Frontend sorunsuz açılmalı.
Backend /health çalışmalı.
Görev oluşturma, listeleme, düzenleme, silme çalışmalı.
Proje oluşturma ve listeleme çalışmalı.
Dashboard gerçek task verisiyle çalışmalı.
Inbox’tan task oluşturma çalışmalı.
Arama ve filtreleme çalışmalı.
Loading/error/empty state’ler görünmeli.
UI açık, Lilac ağırlıklı ve neşeli olmalı.
Mobil görünüm bozulmamalı.
docker compose config hata vermemeli.
Pydantic V2 uyarıları giderilmeli.
16. Yapılmayacaklar

Bu task’ta şunları yapma:

Gerçek OpenAI API entegrasyonu
WhatsApp API entegrasyonu
Google Calendar API entegrasyonu
Push notification
Authentication
Payment
Team management
Native mobile app

Bu task sadece MVP UX, CRUD, responsive ve stabilite iyileştirmesidir.