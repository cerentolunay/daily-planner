import AsyncStorage from "@react-native-async-storage/async-storage";
import { CaptureQueueItem } from "../types";
import { DEFAULT_BACKEND_URL } from "./config";

const keys = {
  backendUrl: "dailyplanner.mobile.backendUrl",
  lastCaptureText: "dailyplanner.mobile.lastCaptureText",
  draftCaptureQueue: "dailyplanner.mobile.draftCaptureQueue",
  selectedTheme: "dailyplanner.mobile.selectedTheme",
  captureSourcePreference: "dailyplanner.mobile.captureSourcePreference",
  accessToken: "dailyplanner.mobile.accessToken",
  refreshToken: "dailyplanner.mobile.refreshToken",
};

const authListeners = new Set<() => void>();

export function subscribeAuthChange(listener: () => void) {
  authListeners.add(listener);
  return () => {
    authListeners.delete(listener);
  };
}

function notifyAuthChange() {
  authListeners.forEach((listener) => listener());
}

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

export async function getAccessToken() {
  return AsyncStorage.getItem(keys.accessToken);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(keys.refreshToken);
}

export async function setAuthTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    [keys.accessToken, accessToken],
    [keys.refreshToken, refreshToken],
  ]);
  notifyAuthChange();
}

export async function clearAuthTokens() {
  await AsyncStorage.multiRemove([keys.accessToken, keys.refreshToken]);
  notifyAuthChange();
}

export { keys as storageKeys };
