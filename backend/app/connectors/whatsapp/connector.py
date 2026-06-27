from ..base import BaseConnector


class WhatsAppConnector(BaseConnector):
    name = "WhatsApp"
    source_type = "whatsapp"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = payload.get("chat_name") or "WhatsApp"
        item["content_type"] = "text"
        return item
