# DailyPlanner - Codex Task 06

## Sprint Başlığı

Product Polish + Delightful UX + Living App Experience

## Amaç

Bu task’ın amacı DailyPlanner’ı yalnızca çalışan bir görev uygulaması olmaktan çıkarıp, kullanması keyifli, hızlı, canlı ve günlük kullanıma uygun bir planner deneyimine dönüştürmektir.

Bu task yeni büyük backend özellikleri eklemekten çok, ürün hissini güçlendirmeye odaklanır.

Hedef:

- Uygulama daha canlı hissettirmeli.
- Dashboard her açıldığında günün durumuna göre konuşmalı.
- Kullanıcı hızlıca görev ekleyebilmeli.
- Görev tamamlamak tatmin edici hissettirmeli.
- Boş ekranlar cansız kalmamalı.
- Navigasyon daha hızlı olmalı.
- Uygulama admin paneli gibi değil, yaşayan bir günlük planlayıcı gibi görünmeli.

---

## 1. Tema Korunacak

Dark tema kullanma.

Ana renk paleti:

```txt
Yellow: #FFD230
Lilac:  #D2C7FF
Purple: #5D5491
Neon:   #E1FB62

Tema karakteri:

Açık
Neşeli
Yumuşak
Modern
Canlı
Kullanması keyifli

Ana arka plan:

#D2C7FF

Başlık ve ana metin:

#5D5491

CTA:

#FFD230

Pozitif / tamamlandı:

#E1FB62

Kurallar:

Siyah/dark arka plan kullanma.
UI tek renk görünmesin.
Kartlarda yumuşak gölgeler kullan.
Hover/focus/active state’ler belirgin olsun.
Görünür tüm metinler Türkçe olsun.
2. Dynamic Greeting / Yaşayan Karşılama

Dashboard üst kısmında saat bazlı dinamik karşılama oluştur.

Mantık:

05:00 - 11:59 → Günaydın
12:00 - 17:59 → İyi çalışmalar
18:00 - 22:59 → İyi akşamlar
23:00 - 04:59 → Gece modu

Örnek metinler:

Günaydın 👋
Bugün neler başaracağız?

İyi çalışmalar ☀️
Günün ritmini yakaladın mı?

İyi akşamlar 🌙
Bugünü toparlayalım mı?

Gece modu ✨
Yarın için küçük bir plan iyi gelebilir.

Alt açıklama gerçek task verisine göre değişsin:

Bugün 5 görevin var, 2 tanesi gecikmiş.
Bugün için planlanmış görev yok. Rahat bir gün olabilir.
Acil 1 iş seni bekliyor.
Bugünkü görevlerinin %60’ı tamamlandı.
3. Animated Hero Card

Dashboard üstünde canlı bir hero card oluştur.

İçerik:

Bugünün ritmi
Planını netleştir, küçük adımlarla ilerle.

Hero içinde:

Bugünkü tamamlanma oranı
Bugünün odağı
Hızlı “Yeni Görev” butonu
Küçük dekoratif şekiller veya soft gradient alanları

Animasyonlar:

Hafif fade-in
Hover’da yumuşak yükselme
Progress bar dolum animasyonu

Gereksiz ağır animasyon kullanma.

4. Floating Quick Add Button

Tüm ana sayfalarda sağ altta floating action button ekle.

Buton:

+

Tıklanınca küçük quick menu açılsın:

Yeni Görev
Yeni Proje
Gelen Kutusuna Ekle
Bugüne Not Bırak

Aksiyonlar:

Yeni Görev → task form/modal açar
Yeni Proje → project form/modal açar
Gelen Kutusuna Ekle → inbox sayfasına veya inbox modalına yönlendirir
Bugüne Not Bırak → basit note-like inbox item oluşturabilir veya şimdilik inbox formuna yönlendirebilir

Mobilde buton rahat tıklanabilir olmalı.

5. Command Palette

Klavye kısayolu ile açılan command palette ekle.

Kısayol:

Ctrl + K

Mac için:

Cmd + K

Palette içinde arama input’u olsun.

Örnek komutlar:

Yeni görev oluştur
Yeni proje oluştur
Bugün sayfasına git
Görevler sayfasına git
Takvime git
Gelen kutusuna git
Odak modunu aç
Ayarları aç

Komut seçilince ilgili aksiyon gerçekleşmeli.

Basit implementasyon yeterli. Yeni library zorunlu değil.

6. Keyboard Shortcuts

Basit klavye kısayolları ekle.

Kısayollar:

N → Yeni görev oluştur
/ → Görevlerde ara
G sonra T → Görevler sayfası
G sonra C → Takvim sayfası
G sonra I → Gelen Kutusu
G sonra P → Projeler
Ctrl/Cmd + K → Command Palette
Esc → Açık modal/palette kapat

Eğer kısayol input veya textarea içinde tetikleniyorsa çalışmasın.

7. Celebration Feedback

Görev tamamlandığında küçük bir kutlama feedback’i göster.

Örnek:

Harika! Bir görev daha tamamlandı 🎉

Görsel davranış:

Küçük toast
Neon aksan
Kısa süreli confetti efekti veya emoji patlaması
Çok abartılı olmasın

Gerçek confetti library eklemek zorunda değilsin. CSS/emoji/toast yeterli.

8. Activity Timeline

Dashboard’a “Son Hareketler” bölümü ekle.

Başlık:

Son Hareketler

Gösterilecek olaylar:

Görev oluşturuldu
Görev tamamlandı
Görev güncellendi
Proje oluşturuldu
Inbox’tan görev çıkarıldı

Bu task’ta backend event log tablosu ekleme.

Frontend tarafında:

Mevcut session içinde gerçekleşen aksiyonları local state veya localStorage ile tutabilirsin.
En fazla 10 hareket göster.
Sayfa yenilenince localStorage’dan okunabilir.

Örnek timeline:

10:12 - Codesight sunumu tamamlandı
09:45 - Yeni görev oluşturuldu
09:20 - Cyber-Quanta projesi oluşturuldu
9. Better Empty States

Boş ekranları daha canlı hale getir.

Görev yoksa
Bugün tertemiz görünüyor 🎈
İstersen küçük bir görev ekleyerek günü planlamaya başlayabilirsin.
Proje yoksa
Henüz proje yok.
İşlerini şirket, okul veya kişisel alanlara ayırarak daha rahat takip edebilirsin.
Inbox boşsa
Gelen kutun boş.
WhatsApp, e-posta veya notlardan gelen işleri buraya bırakabilirsin.
Takvim boşsa
Bu hafta sakin görünüyor.
Deadline eklediğin görevler burada belirecek.

Empty state’lerde küçük emoji veya basit illustration hissi veren şekiller kullanılabilir.

10. Better Cards

Task card, project card ve dashboard card tasarımlarını daha canlı hale getir.

Task card içeriği:

Başlık
Proje
Öncelik
Durum
Son tarih
Kalan süre
Hızlı aksiyonlar

Kalan süre örnekleri:

Bugün bitmeli
Yarın
3 gün kaldı
Gecikti
Son tarih yok

Kartlarda:

Renkli üst çizgi veya sol aksan
Hover efekti
Rounded tasarım
Daha iyi spacing
Priority’ye göre görsel fark
11. Weekly Momentum Widget

Dashboard’a haftalık momentum widget’ı ekle.

Başlık:

Haftalık Momentum

İçerik:

Bu hafta 12 görev
8 tamamlandı
%67 ilerleme

Progress bar göster.

Eğer veri yoksa:

Bu hafta için henüz veri yok.
12. Streak Mock

Basit streak hissi ekle.

Başlık:

Planlama Serisi

Mantık:

localStorage’da uygulamanın açıldığı günleri tut.
Ardışık gün sayısını hesapla.
Kullanıcı aynı gün birden fazla açarsa tek gün say.

Örnek metin:

 🔥

Eğer ilk günse:

Bugün ilk planlama günün. Güzel başlangıç!
13. Sidebar Progress

Sidebar altına günlük ilerleme kartı ekle.

İçerik:

Bugünkü ilerleme
%60

Progress bar:

Arka plan soft Lilac
Dolan kısım Neon
Metin Purple
14. Microcopy İyileştirmeleri

UI metinleri kuru ve teknik olmasın.

Kötü örnek:

No tasks found

İyi örnek:

Henüz görev yok. İlk görevini ekleyerek planına başlayabilirsin.

Kötü örnek:

Error fetching data

İyi örnek:

Verileri alırken bir sorun oluştu. Birazdan tekrar deneyebilirsin.

Tüm metinler doğal Türkçe olmalı.

15. Responsive ve Mobil Hissi

Mobil görünüm güçlendirilsin.

Mobilde:

Sidebar ya collapse olsun ya da bottom navigation benzeri görünsün.
Floating Quick Add butonu kullanılabilir kalsın.
Kartlar tek kolona düşsün.
Hero çok yer kaplamasın.
Command palette ekranı taşmasın.
Formlar rahat kullanılmalı.
16. Performance / Hız Hissi

Uygulama hızlı hissettirmeli.

Yapılacaklar:

Büyük gereksiz re-renderlardan kaçın.
Loading state kısa ve temiz olsun.
Optimistic UI kullanılabilecek yerlerde kullan.
Görev tamamlanınca UI hemen güncellensin.
API hata verirse kullanıcıya geri bildirim gösterilsin.
17. Frontend LocalStorage Utilities

Şu tür kullanıcıya özel UI bilgileri localStorage’da tutulabilir:

streak days
sidebar collapsed
notification mock settings
recent activity
last selected filter

Bunları merkezi bir helper ile yönet.

Önerilen dosya:

apps/web/src/lib/local-storage.ts
18. Kabul Kriterleri

Bu task tamamlandığında:

Dashboard saat bazlı dinamik karşılama göstermeli.
Hero card daha canlı ve animasyonlu olmalı.
Floating Quick Add çalışmalı.
Ctrl/Cmd + K command palette açmalı.
N kısayolu yeni görev açmalı.
Görev tamamlandığında kutlama feedback’i görünmeli.
Son Hareketler timeline çalışmalı.
Empty state’ler daha canlı olmalı.
Task/project/dashboard kartları daha modern görünmeli.
Weekly Momentum widget çalışmalı.
Streak mock localStorage ile çalışmalı.
Sidebar günlük ilerleme göstermeli.
Mobil görünüm bozulmamalı.
Backend CRUD ve /health çalışmaya devam etmeli.
UI açık Lilac temalı, neşeli ve yaşayan bir uygulama hissi vermeli.
19. Yapılmayacaklar

Bu task’ta şunları yapma:

Gerçek OpenAI API
WhatsApp API
Google Calendar API
Push notification
Authentication
Payment
Team management
Native mobile app
Yeni backend event log tablosu

Bu task’ın amacı yeni büyük entegrasyon değil, ürün deneyimini canlandırmaktır.