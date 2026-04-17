// 🔥 GET ALL NOTIFICATIONS
export function getNotifications() {
  return JSON.parse(localStorage.getItem("notificationsList")) || [];
}

// 🔥 SAVE NOTIFICATIONS
function saveNotifications(data) {
  localStorage.setItem("notificationsList", JSON.stringify(data));
}

// 🔥 ADD NOTIFICATION
export function addNotification(message, type = "info") {
  const notifications = getNotifications();

  const newNotif = {
    id: Date.now(),
    message,
    type, // "order" | "product" | "security" | "info"
    time: new Date().toLocaleString(),
    read: false,
  };

  const updated = [newNotif, ...notifications];

  saveNotifications(updated);
}

// 🔥 MARK ALL AS READ
export function markAllAsRead() {
  const notifications = getNotifications();

  const updated = notifications.map((n) => ({
    ...n,
    read: true,
  }));

  saveNotifications(updated);
}

// 🔥 DELETE NOTIFICATION
export function deleteNotification(id) {
  const notifications = getNotifications();

  const updated = notifications.filter((n) => n.id !== id);

  saveNotifications(updated);
}

// 🔥 CLEAR ALL
export function clearNotifications() {
  localStorage.removeItem("notificationsList");
}

// 🔥 COUNT UNREAD
export function getUnreadCount() {
  const notifications = getNotifications();
  return notifications.filter((n) => !n.read).length;
}

// 🔥 FILTER BY TYPE (optional advanced)
export function getNotificationsByType(type) {
  const notifications = getNotifications();
  return notifications.filter((n) => n.type === type);
}
