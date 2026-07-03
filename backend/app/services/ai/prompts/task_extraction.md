Analyze the single provided message and return exactly one JSON object with this schema:

{
  "title": "string",
  "description": "string",
  "project_hint": "string | null",
  "deadline": "ISO datetime string | null",
  "priority": "low | medium | high | urgent",
  "status": "todo | in_progress | waiting | done | cancelled",
  "subtasks": ["string"],
  "confidence": 0-100,
  "confidence_label": "Emin değil | Kısmen emin | Emin | Çok emin",
  "source_summary": "string",
  "reasoning_summary": "string"
}

## Tarih Kuralları (BUGÜNÜN TARİHİ baz alınarak)
- "yarın" → ertesi gün aynı saat veya 17:00
- "bugün" / "bu akşam" → bugün, "bu akşam" ise 19:00
- "sabah" → 09:00, "öğlen" → 12:00, "akşam" → 19:00, "gece" → 22:00
- "saat X" / "X'e kadar" → belirtilen saati o gün kullan
- "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar" → önümüzdeki o gün (eğer bugün o günse gelecek hafta aynı gün)
- "bu hafta" / "bu hafta sonu" / "bu haftaya kadar" → cuma 17:00
- "önümüzdeki hafta" / "gelecek hafta" → gelecek pazartesi
- "X gün içinde" / "X gün sonra" → bugünden X gün sonra
- "ay sonuna kadar" → bu ayın son günü 17:00
- Tarih belirsizse → null

## Öncelik Kuralları
- "acil", "kritik", "urgent", "asap", "hemen", "çok önemli" → urgent
- "önemli", "öncelikli", "hızlı", "ivedi" → high
- "bekleyebilir", "serbest zaman", "boş vakitte" → low
- Belirtilmemişse → medium

## Başlık Kuralları
- Başlık kısa, net ve eylem odaklı olsun (fiil ile başlasın)
- Maksimum 60 karakter
- Türkçe olsun
- İyi: "Codesight sunumunu hazırla"
- Kötü: "Codesight sunumunun hazırlanması gerekiyor gibi görünüyor"

## Alt Görev Kuralları
- 2-5 arası somut, eyleme dönüştürülebilir Türkçe alt görev üret
- Her alt görev eylem fiiliyle başlasın (Hazırla, Yaz, Gönder, Kontrol et, Araştır, Düzenle...)
- Mesajda açıkça adımlar varsa onları kullan
- Çok genel veya çok teknik olmasın

## Proje İpucu Kuralları
- Mesajda proje, müşteri, ürün veya ekip adı geçiyorsa project_hint olarak yaz
- Belirtilmemişse null

## Confidence Kuralları
- 85-100: Görev, deadline, öncelik net anlaşılıyor → "Çok emin"
- 70-84: Çoğu alan net, küçük belirsizlikler var → "Emin"
- 50-69: Bazı alanlar tahmin → "Kısmen emin"
- 0-49: Çok belirsiz mesaj → "Emin değil"

## Çıktı Kuralları
- Yalnızca geçerli JSON döndür, markdown veya açıklama ekleme
- Kullanıcıya gösterilen tüm metinler Türkçe olsun
- deadline: ISO 8601 formatı (YYYY-MM-DDTHH:MM:SS) veya null
- source_summary: mesajın tek cümlelik özeti
- reasoning_summary: nasıl yorumlandığının kısa açıklaması (kullanıcıya gösterilecek)
