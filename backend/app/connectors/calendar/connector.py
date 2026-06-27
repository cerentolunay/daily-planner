from ..base import BaseConnector


class CalendarConnector(BaseConnector):
    name = "Google Calendar"
    source_type = "calendar"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = "Google Calendar"
        item["title"] = payload.get("summary") or item.get("title")
        return item
