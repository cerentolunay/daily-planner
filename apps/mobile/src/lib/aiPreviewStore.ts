import { AIAnalysisResult } from "../types";

let _data: AIAnalysisResult | null = null;
let _rawText = "";

export function setAIPreview(data: AIAnalysisResult, rawText: string) {
  _data = data;
  _rawText = rawText;
}

export function getAIPreview(): { data: AIAnalysisResult; rawText: string } | null {
  if (!_data) return null;
  return { data: _data, rawText: _rawText };
}

export function clearAIPreview() {
  _data = null;
  _rawText = "";
}
