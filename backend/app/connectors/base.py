from abc import ABC, abstractmethod


class BaseConnector(ABC):
    name: str = "Base"
    source_type: str = "unknown"

    def normalize(self, payload: dict) -> dict:
        return {
            "title": payload.get("title"),
            "raw_text": payload.get("raw_text") or payload.get("text") or "",
            "source_url": payload.get("source_url") or payload.get("url"),
            "metadata_json": payload,
        }

    @abstractmethod
    def to_inbox_item(self, payload: dict) -> dict:
        normalized = self.normalize(payload)
        return {
            "source_type": self.source_type,
            "content_type": "text",
            "raw_text": normalized["raw_text"],
            "title": normalized.get("title"),
            "source_url": normalized.get("source_url"),
            "metadata_json": normalized.get("metadata_json"),
        }
