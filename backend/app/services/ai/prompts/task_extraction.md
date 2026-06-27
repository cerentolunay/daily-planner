Analyze the single provided message and return exactly one JSON object with this schema:

{
  "title": "string",
  "description": "string",
  "project_hint": "string | null",
  "deadline": "ISO datetime string | null",
  "priority": "low | medium | high | urgent",
  "status": "todo | in_progress | waiting | done | cancelled",
  "subtasks": ["string"],
  "confidence": 0,
  "confidence_label": "Emin değil | Kısmen emin | Emin | Çok emin",
  "source_summary": "string",
  "reasoning_summary": "string"
}

Rules:
- If deadline is uncertain, set deadline to null.
- If priority is uncertain, use medium.
- If project is uncertain, set project_hint to null.
- Subtasks should be concrete and actionable.
- Return only valid JSON and no markdown.
