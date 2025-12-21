import React from "react";
import { Link } from "react-router-dom";

// Custom SVG Icon Components
const DashboardIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const UniversityIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const PaymentsIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const NotificationsIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ActivityIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const SettingsIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 18, color = "currentColor", style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

interface SidebarProps {
  activePage: string;
  logoSrc?: string;
  isOpen?: boolean;
  isMobile?: boolean;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  logoSrc,
  isOpen = false,
  isMobile = false,
  onLogout,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    { id: "university", label: "Universities", icon: UniversityIcon, path: "/university" },
    { id: "payments", label: "Payments", icon: PaymentsIcon, path: "/payments" },
    { id: "notifications", label: "Notifications", icon: NotificationsIcon, path: "/notifications" },
    { id: "activity-log", label: "Activity Log", icon: ActivityIcon, path: "/activity-log" },
    { id: "system-settings", label: "System Settings", icon: SettingsIcon, path: "/system-settings" },
  ];

  const sidebarWidth = isMobile ? "280px" : "256px";
  const isVisible = isMobile ? isOpen : true;

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          style={{
            width: sidebarWidth,
            backgroundColor: "white",
            height: "100vh",
            borderRight: "1px solid #f3f4f6",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 10,
            overflowY: "auto",
          }}
        >
          <SidebarContent
            logoSrc={logoSrc}
            menuItems={menuItems}
            activePage={activePage}
            onLogout={onLogout}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          style={{
            width: sidebarWidth,
            backgroundColor: "white",
            height: "100vh",
            borderRight: "1px solid #f3f4f6",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 15,
            transform: isVisible ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            overflowY: "auto",
          }}
        >
          <SidebarContent
            logoSrc={logoSrc}
            menuItems={menuItems}
            activePage={activePage}
            isMobile={isMobile}
            onLogout={onLogout}
          />
        </div>
      )}
    </>
  );
};

interface SidebarContentProps {
  logoSrc?: string;
  menuItems: Array<{ id: string; label: string; icon: React.FC<any>; path: string }>;
  activePage: string;
  isMobile?: boolean;
  onLogout?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  logoSrc,
  menuItems,
  activePage,
  isMobile = false,
  onLogout,
}) => {
  return (
    <>
      {/* Logo Section */}
      <div
        style={{
          padding: isMobile ? "20px 20px" : "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <img
          src="/assets/speedlink.png"
          alt="SPEEDLINK Logo"
          style={{
            height: "48px",
            width: "auto",
            objectFit: "contain",
          }}
          onError={(e) => {
            // Fallback to placeholder text if image fails to load
            (e.currentTarget.style.display as any) = "none";
            const fallback = document.createElement("div");
            fallback.style.position = "relative";
            fallback.style.width = "40px";
            fallback.style.height = "40px";
            fallback.style.borderRadius = "8px";
            fallback.style.background =
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
            fallback.style.display = "flex";
            fallback.style.alignItems = "center";
            fallback.style.justifyContent = "center";
            fallback.style.color = "white";
            fallback.style.fontSize = "20px";
            fallback.style.fontWeight = "bold";
            fallback.style.flexShrink = "0";
            fallback.textContent = "S";
            e.currentTarget.parentElement?.appendChild(fallback);
          }}
        />
         {/* <div style={{ minWidth: 0 }}>
          <h1 
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: 700,
              color: "#1e3a8a",
              lineHeight: 1,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            SPEEDLINK
          </h1>
          <p
            style={{
              fontSize: "10px",
              color: "#9ca3af",
              lineHeight: 1,
              margin: "4px 0 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Hi-Tech Solutions
          </p>
        </div> */}
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          paddingLeft: "16px",
          paddingRight: "16px",
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          minWidth: 0,
        }}
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: 500,
                borderRadius: "8px",
                backgroundColor: isActive ? "#f3f4f6" : "transparent",
                color: isActive ? "#1e3a8a" : "#6b7280",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                minWidth: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "#f9fafb";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#111827";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
                }
              }}
            >
              <IconComponent
                size={18}
                color={isActive ? "#1e3a8a" : "#d1d5db"}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #f3f4f6",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: 500,
            color: "#6b7280",
            backgroundColor: "transparent",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            minWidth: 0,
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "#dc2626";
            (e.target as HTMLButtonElement).style.backgroundColor = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "#6b7280";
            (e.target as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            color="#dc2626"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span
            style={{
              whiteSpace: "nowrap",
              color: "#dc2626",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Log Out
          </span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
