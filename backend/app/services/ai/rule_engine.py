import re
from datetime import datetime, timedelta


WEEKDAYS = {
    "pazartesi": 0,
    "salı": 1,
    "çarşamba": 2,
    "perşembe": 3,
    "cuma": 4,
    "cumartesi": 5,
    "pazar": 6,
}

PROJECT_HINTS = {
    "heptapus": "Heptapus",
    "heptacert": "HeptaCert",
    "cyber-quanta": "Cyber-Quanta",
    "cyber quanta": "Cyber-Quanta",
    "codesight": "Cyber-Quanta",
    "üniversite": "Üniversite",
    "okul": "Üniversite",
    "ders": "Üniversite",
    "kişisel": "Kişisel",
}


class RuleEngine:
    def find_deadline(self, text: str, now: datetime | None = None) -> tuple[datetime | None, list[str]]:
        now = now or datetime.now()
        lower = text.lower()
        signals: list[str] = []
        target = None

        if "bugün" in lower:
            target = now
            signals.append("bugün")
        elif "yarın" in lower:
            target = now + timedelta(days=1)
            signals.append("yarın")
        elif "bu hafta" in lower:
            target = now + timedelta(days=(4 - now.weekday()) % 7 or 7)
            signals.append("bu hafta")
        elif "haftaya" in lower:
            target = now + timedelta(days=7)
            signals.append("haftaya")

        for label, weekday in WEEKDAYS.items():
            if label in lower:
                diff = (weekday - now.weekday()) % 7 or 7
                target = now + timedelta(days=diff)
                signals.append(label)
                break

        if "akşama" in lower:
            target = target or now
            target = target.replace(hour=19, minute=0, second=0, microsecond=0)
            signals.append("akşama")
        elif "öğlene" in lower:
            target = target or now
            target = target.replace(hour=12, minute=0, second=0, microsecond=0)
            signals.append("öğlene")
        else:
            time_match = re.search(r"(?:saat\s*)?(\d{1,2})(?::|\.)(\d{2})", lower) or re.search(r"saat\s*(\d{1,2})", lower)
            if time_match:
                hour = int(time_match.group(1))
                minute = int(time_match.group(2)) if time_match.lastindex and time_match.lastindex >= 2 and time_match.group(2) else 0
                target = target or now
                target = target.replace(hour=hour, minute=minute, second=0, microsecond=0)
                signals.append(time_match.group(0))

        if target and not any(signal in signals for signal in ["akşama", "öğlene"]) and target.hour == now.hour:
            target = target.replace(hour=17, minute=0, second=0, microsecond=0)

        return target, signals

    def find_priority(self, text: str) -> tuple[str, list[str]]:
        lower = text.lower()
        rules = [
            ("urgent", ["çok önemli", "acil", "kritik"]),
            ("high", ["yüksek öncelik", "önemli"]),
            ("medium", ["normal"]),
            ("low", ["müsait olunca", "sonra", "ufak", "basit"]),
        ]
        for value, keywords in rules:
            matches = [keyword for keyword in keywords if keyword in lower]
            if matches:
                return value, matches
        return "medium", []

    def find_status(self, text: str) -> tuple[str, list[str]]:
        lower = text.lower()
        rules = [
            ("in_progress", ["başladım", "devam ediyor"]),
            ("waiting", ["beklemede"]),
            ("done", ["bitti", "tamamlandı"]),
            ("cancelled", ["iptal"]),
        ]
        for value, keywords in rules:
            matches = [keyword for keyword in keywords if keyword in lower]
            if matches:
                return value, matches
        return "todo", []

    def find_project(self, text: str) -> tuple[str | None, list[str]]:
        lower = text.lower()
        for keyword, project in PROJECT_HINTS.items():
            if keyword in lower:
                return project, [keyword]
        return None, []

    def find_subtasks(self, text: str) -> tuple[list[str], list[str]]:
        signals: list[str] = []
        subtasks: list[str] = []
        patterns = [
            r"içinde\s+(.+?)\s+olsun",
            r"şunu da\s+(.+?)(?:\.|,|$)",
            r"bunu da\s+(.+?)(?:\.|,|$)",
            r"bir de\s+(.+?)(?:\.|,|$)",
            r"ayrıca\s+(.+?)(?:\.|,|$)",
            r"unutma\s+(.+?)(?:\.|,|$)",
        ]
        lower = text.lower()
        for pattern in patterns:
            for match in re.finditer(pattern, lower):
                value = match.group(1).strip()
                if len(value) > 2:
                    subtasks.append(value.capitalize())
                    signals.append(match.group(0))

        if "," in text:
            parts = [part.strip(" .") for part in text.split(",")]
            if len(parts) >= 3:
                subtasks.extend(part.capitalize() for part in parts[1:] if len(part) > 3)
                signals.append("virgülle ayrılmış liste")

        deduped = list(dict.fromkeys(subtasks))
        return deduped[:8], signals

    def suggest_title(self, text: str) -> tuple[str, list[str]]:
        first_sentence = re.split(r"[.!?\n]", text.strip())[0].strip()
        title = first_sentence.replace("Abi ", "").replace("abi ", "")
        if len(title) > 72:
            title = title[:69].rstrip() + "..."
        return title or "Yeni görev taslağı", ["ilk cümle"]
