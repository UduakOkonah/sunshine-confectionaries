import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full bg-yellow-100 p-3 text-yellow-700 transition hover:bg-yellow-200"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-16 z-50 w-[360px] rounded-[28px] border border-yellow-100 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Notifications
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="rounded-full bg-green-50 p-2 text-green-600"
              >
                <CheckCheck size={16} />
              </button>

              <button
                onClick={clearNotifications}
                className="rounded-full bg-red-50 p-2 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[400px] space-y-3 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="rounded-[24px] bg-yellow-50 p-6 text-center">
                <p className="text-sm font-bold text-slate-500">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    notification.read
                      ? "border-slate-100 bg-slate-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {notification.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.read && (
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;