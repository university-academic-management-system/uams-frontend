import React, { useState, useEffect } from "react";
import { BellIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

interface TopbarProps {
  isMobile?: boolean;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  onLogout?: () => void;
}

interface UserData {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

const Topbar: React.FC<TopbarProps> = ({
  isMobile = false,
  sidebarOpen = false,
  setSidebarOpen,
  onLogout,
}) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() || 'A';
  const userName = user?.full_name || 'Super Admin';
  const userEmail = user?.email || 'admin@example.com';

  return (
    <header
      style={{
        height: isMobile ? "56px" : "64px",
        backgroundColor: "white",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: isMobile ? "16px" : "32px",
        paddingRight: isMobile ? "16px" : "32px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        gap: isMobile ? "12px" : "24px",
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            transition: "all 0.2s ease-in-out",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          }}
        >
          {sidebarOpen ? (
            <CloseIcon w={6} h={6} />
          ) : (
            <HamburgerIcon w={6} h={6} />
          )}
        </button>
      )}

      {/* Spacer to push content to the right */}
      <div style={{ flex: 1 }} />

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "12px" : "16px",
          flexShrink: 0,
        }}
      >
        {/* Notification Bell Icon */}
        <button
          style={{
            position: "relative",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <svg
            width={isMobile ? "18" : "20"}
            height={isMobile ? "18" : "20"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>

        {/* History/Activity Icon */}
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <svg
            width={isMobile ? "18" : "20"}
            height={isMobile ? "18" : "20"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v5h5"></path>
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
            <path d="M12 7v5l4 2"></path>
          </svg>
        </button>

        {/* Divider - Hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "#e5e7eb",
              margin: "0",
            }}
          />
        )}

        {/* User Profile Section - Responsive */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "12px",
            paddingLeft: isMobile ? "0" : "24px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: isMobile ? "28px" : "32px",
              height: isMobile ? "28px" : "32px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 500,
              flexShrink: 0,
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            {userInitial}
          </div>
          {!isMobile && (
            <button
              onClick={onLogout}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                minWidth: 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111827",
                    lineHeight: 1.2,
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userName}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    lineHeight: 1.2,
                    margin: "4px 0 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
