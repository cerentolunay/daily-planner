from ..base import BaseConnector


class GithubConnector(BaseConnector):
    name = "GitHub"
    source_type = "github"

    def to_inbox_item(self, payload: dict) -> dict:
        item = super().to_inbox_item(payload)
        item["source_name"] = payload.get("repo") or "GitHub"
        item["title"] = payload.get("title") or item.get("title")
        item["content_type"] = "url" if item.get("source_url") else "text"
        return item
