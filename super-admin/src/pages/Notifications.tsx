import React, { useState } from "react";
import { BellIcon, CloseIcon } from "@chakra-ui/icons";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "account" | "update" | "alert" | "system";
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Account password change",
      description: "Your password has been changed successfully",
      timestamp: "10mins ago",
      read: false,
      type: "account",
    },
    {
      id: "2",
      title: "University Request Update",
      description: "New update alert",
      timestamp: "5h ago",
      read: false,
      type: "update",
    },
    {
      id: "3",
      title: "Account creation",
      description: "Your account has been created successfully",
      timestamp: "1 week ago",
      read: true,
      type: "account",
    },
    {
      id: "4",
      title: "Account Update",
      description:
        "New update out now!Discover improve productivity tools and more",
      timestamp: "Jul 23,2025",
      read: true,
      type: "update",
    },
  ]);

  const [showEmpty, setShowEmpty] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter((notif) => notif.id !== id);
    setNotifications(updated);
    if (updated.length === 0) {
      setShowEmpty(true);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "account":
        return "👤";
      case "update":
        return "📢";
      case "alert":
        return "⚠️";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  if (showEmpty && notifications.length === 0) {
    return (
      <div style={{ padding: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 8px 0",
          }}
        >
          Notifications
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              marginBottom: "24px",
            }}
          >
            💬
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              margin: "0 0 8px 0",
            }}
          >
            No Notifications
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#6B7280",
              margin: "0",
              maxWidth: "300px",
            }}
          >
            We'll let you know when there would be something to update you
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0",
            }}
          >
            Notifications
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          {/* Do not disturb toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              <input
                type="checkbox"
                checked={doNotDisturb}
                onChange={(e) => setDoNotDisturb(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#3B82F6",
                }}
              />
              <span>Do not disturb</span>
            </label>
          </div>

          {/* Mark as read button */}
          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                padding: "8px 16px",
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#6B7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              display: "flex",
              gap: "16px",
              padding: "20px",
              backgroundColor: notification.read ? "white" : "#F0F9FF",
              border: notification.read
                ? "1px solid #E5E7EB"
                : "1px solid #BFDBFE",
              borderRadius: "12px",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              {!notification.read && (
                <div
                  style={{
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#3B82F6",
                    borderRadius: "50%",
                    marginLeft: "-16px",
                    marginTop: "-16px",
                  }}
                />
              )}
              {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: "0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111827",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {notification.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {notification.description}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      margin: "0",
                    }}
                  >
                    {notification.timestamp}
                  </p>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#3B82F6",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "white",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#2563EB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#3B82F6";
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    style={{
                      padding: "6px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#F3F4F6";
                      e.currentTarget.style.color = "#6B7280";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#9CA3AF";
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
