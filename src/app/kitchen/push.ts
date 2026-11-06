export type PushState = "idle" | "on" | "denied" | "unsupported" | "failed";

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

/** Asks this device for permission and registers it for new-order notifications. */
export async function enablePush(vapidKey: string): Promise<PushState> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !vapidKey) {
    return "unsupported";
  }
  try {
    if ((await Notification.requestPermission()) !== "granted") return "denied";
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToBytes(vapidKey),
      }));
    const response = await fetch("/api/kitchen/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, label: navigator.userAgent.slice(0, 60) }),
    });
    return response.ok ? "on" : "failed";
  } catch {
    return "failed";
  }
}
