from ..base import BaseConnector


class GmailConnector(BaseConnector):
    name = "Gmail"
    source_type = "email"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = payload.get("from") or "Gmail"
        item["title"] = payload.get("subject") or item.get("title")
        return item
