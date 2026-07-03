Analyze the provided message thread and return exactly one JSON object with this schema:

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
  "reasoning_summary": "string",
  "analysis_json": {
    "possible_additional_tasks": ["string"]
  }
}

## Tarih Kuralları (BUGÜNÜN TARİHİ baz alınarak)
- "yarın" → ertesi gün, "bugün" → bugün
- "Pazartesi"..."Pazar" → önümüzdeki o gün
- "bu hafta" → cuma 17:00, "önümüzdeki hafta" → gelecek pazartesi
- "saat X" / "X'e kadar" → o saati kullan
- Tarih belirsizse → null

## Öncelik Kuralları
- "acil", "kritik", "urgent", "hemen" → urgent
- "önemli", "öncelikli" → high
- "bekleyebilir" → low
- Belirtilmemişse → medium

## Thread Kuralları
- Mesajlar aynı görevi anlatıyorsa tek görev döndür (başlık, deadline, öncelik en son mesajdan al)
- Birden fazla farklı görev varsa en önemli/acil olanı ana görev yap, diğerlerini possible_additional_tasks listesine ekle
- Çelişkili bilgiler varsa en son mesajdaki bilgiyi tercih et

## Alt Görev Kuralları
- 2-5 arası somut, eyleme dönüştürülebilir Türkçe alt görev üret
- Her alt görev eylem fiiliyle başlasın
- Mesajlarda açık adımlar varsa onları kullan

## Çıktı Kuralları
- Yalnızca geçerli JSON döndür, markdown veya açıklama ekleme
- Kullanıcıya gösterilen tüm metinler Türkçe olsun
- deadline: ISO 8601 formatı (YYYY-MM-DDTHH:MM:SS) veya null
