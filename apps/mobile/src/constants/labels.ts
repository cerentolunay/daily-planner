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
