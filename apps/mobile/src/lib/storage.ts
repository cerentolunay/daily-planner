import AsyncStorage from "@react-native-async-storage/async-storage";
import { CaptureQueueItem } from "../types";
import { DEFAULT_BACKEND_URL } from "./config";

const keys = {
  backendUrl: "dailyplanner.mobile.backendUrl",
  lastCaptureText: "dailyplanner.mobile.lastCaptureText",
  draftCaptureQueue: "dailyplanner.mobile.draftCaptureQueue",
  selectedTheme: "dailyplanner.mobile.selectedTheme",
  captureSourcePreference: "dailyplanner.mobile.captureSourcePreference",
};

export async function getBackendUrl() {
  return (await AsyncStorage.getItem(keys.backendUrl)) || DEFAULT_BACKEND_URL;
}

export async function setBackendUrl(url: string) {
  await AsyncStorage.setItem(keys.backendUrl, url.trim());
}

export async function setLastCaptureText(text: string) {
  await AsyncStorage.setItem(keys.lastCaptureText, text);
}

export async function getLastCaptureText() {
  return (await AsyncStorage.getItem(keys.lastCaptureText)) || "";
}

export async function getCaptureQueue(): Promise<CaptureQueueItem[]> {
  const raw = await AsyncStorage.getItem(keys.draftCaptureQueue);
  return raw ? JSON.parse(raw) : [];
}

export async function setCaptureQueue(queue: CaptureQueueItem[]) {
  await AsyncStorage.setItem(keys.draftCaptureQueue, JSON.stringify(queue));
}

export async function enqueueCapture(item: CaptureQueueItem) {
  const queue = await getCaptureQueue();
  await setCaptureQueue([item, ...queue]);
}

export async function removeQueuedCapture(id: string) {
  const queue = await getCaptureQueue();
  await setCaptureQueue(queue.filter((item) => item.id !== id));
}

export { keys as storageKeys };
