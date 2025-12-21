import React, { useState } from "react";

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  status: "success" | "pending" | "failed";
  module: string;
}

const ActivityLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("All");

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      timestamp: "2025-08-23 14:32:45",
      user: "Aisha Bello",
      action: "Login",
      description: "User logged in successfully",
      status: "success",
      module: "Authentication",
    },
    {
      id: "2",
      timestamp: "2025-08-23 14:30:12",
      user: "Michael Ali",
      action: "Created Payment",
      description: "Payment record created for School fees",
      status: "success",
      module: "Payments",
    },
    {
      id: "3",
      timestamp: "2025-08-23 14:28:00",
      user: "Frank Igyl",
      action: "Updated Settings",
      description: "System settings updated by admin",
      status: "success",
      module: "Settings",
    },
    {
      id: "4",
      timestamp: "2025-08-23 14:25:33",
      user: "Misa hope",
      action: "Failed Login",
      description: "Invalid credentials provided",
      status: "failed",
      module: "Authentication",
    },
    {
      id: "5",
      timestamp: "2025-08-23 14:23:19",
      user: "Noad Grace",
      action: "Exported Data",
      description: "Exported transaction history",
      status: "success",
      module: "Reports",
    },
    {
      id: "6",
      timestamp: "2025-08-23 14:20:45",
      user: "Sharah Pio",
      action: "Created University",
      description: "New university record added",
      status: "success",
      module: "University",
    },
    {
      id: "7",
      timestamp: "2025-08-23 14:18:22",
      user: "Lee Lee",
      action: "Deleted User",
      description: "User account permanently deleted",
      status: "pending",
      module: "Users",
    },
    {
      id: "8",
      timestamp: "2025-08-23 14:15:00",
      user: "Sharom Jay",
      action: "Updated Profile",
      description: "User profile information updated",
      status: "success",
      module: "Users",
    },
    {
      id: "9",
      timestamp: "2025-08-23 14:12:33",
      user: "Frank Herald",
      action: "Generated Report",
      description: "Monthly revenue report generated",
      status: "success",
      module: "Reports",
    },
    {
      id: "10",
      timestamp: "2025-08-23 14:10:15",
      user: "Admin User",
      action: "System Backup",
      description: "Database backup completed",
      status: "success",
      module: "System",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" };
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" };
      case "failed":
        return { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" };
      default:
        return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
    }
  };

  const modules = [
    "All",
    "Authentication",
    "Payments",
    "Settings",
    "University",
    "Users",
    "Reports",
    "System",
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = filterModule === "All" || log.module === filterModule;

    return matchesSearch && matchesModule;
  });

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 8px 0",
          }}
        >
          Activity Log
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: "0",
          }}
        >
          View system and user activities
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search by user, action or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3B82F6";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(59, 130, 246, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        {/* Export Button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>

        {/* Filter Button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter
        </button>
      </div>

      {/* Module Filter Tags */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {modules.map((module) => (
          <button
            key={module}
            onClick={() => setFilterModule(module)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border:
                filterModule === module
                  ? "2px solid #3B82F6"
                  : "1px solid #E5E7EB",
              backgroundColor: filterModule === module ? "#EFF6FF" : "white",
              color: filterModule === module ? "#3B82F6" : "#6B7280",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (filterModule !== module) {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
              }
            }}
            onMouseLeave={(e) => {
              if (filterModule !== module) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            {module}
          </button>
        ))}
      </div>

      {/* Activity Log Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Timestamp
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                User
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Action
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Module
              </th>
              <th
                style={{
                  padding: "16px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#6B7280",
                  fontSize: "13px",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const statusColor = getStatusColor(log.status);
              return (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <td
                    style={{
                      padding: "16px",
                      color: "#6B7280",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  >
                    {log.timestamp}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    {log.user}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  >
                    {log.action}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#6B7280",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {log.description}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#6B7280",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        backgroundColor: "#EFF6FF",
                        color: "#3B82F6",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {log.module}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: "12px",
                        fontWeight: "600",
                        border: `1px solid ${statusColor.border}`,
                      }}
                    >
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "#6B7280",
        }}
      >
        <span>
          Showing {filteredLogs.length} of {activityLogs.length} activities
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "14px",
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
            ← Previous
          </button>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #3B82F6",
              borderRadius: "6px",
              backgroundColor: "#EFF6FF",
              color: "#3B82F6",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            1
          </button>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "14px",
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
            2
          </button>
          <button
            style={{
              padding: "8px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "14px",
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
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
