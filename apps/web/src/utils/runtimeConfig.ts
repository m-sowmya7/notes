const fallbackApiBaseUrl = "http://localhost:5000/api";
const fallbackLiveWebSocketUrl = "ws://localhost:1234";

export const apiBaseUrl =
  import.meta.env.VITE_BACKEND_URL || fallbackApiBaseUrl;

export const liveWebSocketUrl =
  import.meta.env.VITE_HOCUSPOCUS_URL || fallbackLiveWebSocketUrl;