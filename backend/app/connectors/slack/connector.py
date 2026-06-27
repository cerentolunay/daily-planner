from ..base import BaseConnector


class SlackConnector(BaseConnector):
    name = "Slack"
    source_type = "slack"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = payload.get("channel") or "Slack"
        return item
