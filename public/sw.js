/* The kitchen's service worker: shows a notification for each new order,
   and opens (or focuses) the board when one is tapped. */

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "New order", body: "" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 120, 300, 120, 300],
      icon: "/icon.svg",
      data: { url: data.url || "/kitchen" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/kitchen", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => w.url.startsWith(url));
      return open ? open.focus() : self.clients.openWindow(url);
    }),
  );
});
