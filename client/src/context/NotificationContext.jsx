import { createContext, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

const initialNotifications = [
  {
    id: 1,
    title: "Welcome to Sunshine",
    message: "Your bakery notifications will appear here.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };

    setNotifications((currentNotifications) => [
      newNotification,
      ...currentNotifications,
    ]);
  };

  const markAsRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }

  return context;
}