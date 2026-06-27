from ..base import BaseConnector


class DiscordConnector(BaseConnector):
    name = "Discord"
    source_type = "discord"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = payload.get("server") or "Discord"
        return item
