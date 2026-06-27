export const priorityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  urgent: "Acil",
} as const;

export const statusLabels = {
  todo: "Yapılacak",
  in_progress: "Devam Ediyor",
  waiting: "Beklemede",
  done: "Tamamlandı",
  cancelled: "İptal Edildi",
} as const;

export const priorityValues = {
  Düşük: "low",
  Orta: "medium",
  Yüksek: "high",
  Acil: "urgent",
} as const;

export const statusValues = {
  Yapılacak: "todo",
  "Devam Ediyor": "in_progress",
  Beklemede: "waiting",
  Tamamlandı: "done",
  "İptal Edildi": "cancelled",
} as const;

export const taskFilterLabels = ["Tümü", "Bugün", "Yaklaşanlar", "Gecikenler", "Tamamlananlar", "Acil"] as const;

export const sortLabels = {
  deadline: "Son tarihe göre",
  priority: "Önceliğe göre",
  created: "Oluşturulma tarihine göre",
} as const;
