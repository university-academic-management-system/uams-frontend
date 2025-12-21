import React, { useState } from "react";

type TabType =
  | "general"
  | "notification"
  | "security"
  | "email"
  | "database"
  | "api";

interface FormData {
  platformName: string;
  platformUrl: string;
  supportEmail: string;
  timeZone: string;
  enableEmailNotification: boolean;
  criticalAlert: boolean;
  maintenanceNotice: boolean;
  weeklyReport: boolean;
  enableTwoStepVerification: boolean;
  minimumPasswordLength: string;
  forcePasswordChange: boolean;
  smtpServer: string;
  smtpPort: string;
  emailFrom: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  apiKey: string;
  apiEndpoint: string;
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [formData, setFormData] = useState<FormData>({
    platformName: "SPEEDLINK",
    platformUrl: "https://speedlink.com",
    supportEmail: "support@speedlink.com",
    timeZone: "UTC+1",
    enableEmailNotification: true,
    criticalAlert: true,
    maintenanceNotice: true,
    weeklyReport: true,
    enableTwoStepVerification: true,
    minimumPasswordLength: "8",
    forcePasswordChange: false,
    smtpServer: "smtp.speedlink.com",
    smtpPort: "587",
    emailFrom: "noreply@speedlink.com",
    dbHost: "localhost",
    dbPort: "5432",
    dbName: "speedlink_db",
    dbUser: "admin",
    apiKey: "sk_live_xxxxxxxxxxxxxx",
    apiEndpoint: "https://api.speedlink.com/v1",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      platformName: "SPEEDLINK",
      platformUrl: "https://speedlink.com",
      supportEmail: "support@speedlink.com",
      timeZone: "UTC+1",
      enableEmailNotification: true,
      criticalAlert: true,
      maintenanceNotice: true,
      weeklyReport: true,
      enableTwoStepVerification: true,
      minimumPasswordLength: "8",
      forcePasswordChange: false,
      smtpServer: "smtp.speedlink.com",
      smtpPort: "587",
      emailFrom: "noreply@speedlink.com",
      dbHost: "localhost",
      dbPort: "5432",
      dbName: "speedlink_db",
      dbUser: "admin",
      apiKey: "sk_live_xxxxxxxxxxxxxx",
      apiEndpoint: "https://api.speedlink.com/v1",
    });
  };

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: "12px 24px",
        borderBottom: activeTab === tab ? "3px solid #3B82F6" : "none",
        backgroundColor: activeTab === tab ? "#F9FAFB" : "white",
        color: activeTab === tab ? "#3B82F6" : "#6B7280",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: activeTab === tab ? "600" : "500",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "#F9FAFB";
        }
      }}
      onMouseLeave={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.backgroundColor = "white";
        }
      }}
    >
      {label}
    </button>
  );

  const FormField = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <div style={{ marginBottom: "24px" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "600",
          color: "#111827",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "inherit",
          boxSizing: "border-box",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#3B82F6";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );

  const CheckboxField = ({
    label,
    checked,
    onChange,
    description,
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "20px",
          height: "20px",
          cursor: "pointer",
          marginTop: "2px",
          accentColor: "#3B82F6",
        }}
      />
      <div>
        <label
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          {label}
        </label>
        {description && (
          <p
            style={{
              fontSize: "12px",
              color: "#6B7280",
              marginTop: "4px",
              margin: "4px 0 0 0",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <img
            src="/assets/settings.png"
            alt="Settings Icon"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827",
              margin: "0",
            }}
          >
            System Settings
          </h1>
        </div>
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: "0",
          }}
        >
          Configure platform settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "32px",
          backgroundColor: "white",
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
        }}
      >
        <TabButton tab="general" label="General" />
        <TabButton tab="notification" label="Notification" />
        <TabButton tab="security" label="Security" />
        <TabButton tab="email" label="Email" />
        <TabButton tab="database" label="Data base" />
        <TabButton tab="api" label="Api" />
      </div>

      {/* Tab Content */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0 0 12px 12px",
          padding: "32px",
          border: "1px solid #E5E7EB",
          borderTop: "none",
        }}
      >
        {/* General Tab */}
        {activeTab === "general" && (
          <div>
            <FormField
              label="Platform Name"
              value={formData.platformName}
              onChange={(value) => handleInputChange("platformName", value)}
              placeholder="Enter platform name"
            />
            <FormField
              label="Platform URL"
              value={formData.platformUrl}
              onChange={(value) => handleInputChange("platformUrl", value)}
              placeholder="https://example.com"
            />
            <FormField
              label="Support Email"
              type="email"
              value={formData.supportEmail}
              onChange={(value) => handleInputChange("supportEmail", value)}
              placeholder="support@example.com"
            />
            <FormField
              label="Time Zone"
              value={formData.timeZone}
              onChange={(value) => handleInputChange("timeZone", value)}
              placeholder="UTC+1"
            />
          </div>
        )}

        {/* Notification Tab */}
        {activeTab === "notification" && (
          <div>
            <CheckboxField
              label="Enable Email Notification"
              checked={formData.enableEmailNotification}
              onChange={(checked) =>
                handleInputChange("enableEmailNotification", checked)
              }
            />
            <CheckboxField
              label="Critical Alert"
              checked={formData.criticalAlert}
              onChange={(checked) =>
                handleInputChange("criticalAlert", checked)
              }
            />
            <CheckboxField
              label="Maintenace Notice"
              checked={formData.maintenanceNotice}
              onChange={(checked) =>
                handleInputChange("maintenanceNotice", checked)
              }
            />
            <CheckboxField
              label="Weekly Report"
              checked={formData.weeklyReport}
              onChange={(checked) => handleInputChange("weeklyReport", checked)}
            />
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div>
            <CheckboxField
              label="Enable two-Step Verification"
              checked={formData.enableTwoStepVerification}
              onChange={(checked) =>
                handleInputChange("enableTwoStepVerification", checked)
              }
              description="Maximum Time set per second"
            />
            <FormField
              label="Minimum Password Per Length"
              type="number"
              value={formData.minimumPasswordLength}
              onChange={(value) =>
                handleInputChange("minimumPasswordLength", value)
              }
              placeholder="8"
            />
            <CheckboxField
              label="Force Password Change at login"
              checked={formData.forcePasswordChange}
              onChange={(checked) =>
                handleInputChange("forcePasswordChange", checked)
              }
            />
          </div>
        )}

        {/* Email Tab */}
        {activeTab === "email" && (
          <div>
            <FormField
              label="SMTP Server"
              value={formData.smtpServer}
              onChange={(value) => handleInputChange("smtpServer", value)}
              placeholder="smtp.example.com"
            />
            <FormField
              label="SMTP Port"
              type="number"
              value={formData.smtpPort}
              onChange={(value) => handleInputChange("smtpPort", value)}
              placeholder="587"
            />
            <FormField
              label="Email From"
              type="email"
              value={formData.emailFrom}
              onChange={(value) => handleInputChange("emailFrom", value)}
              placeholder="noreply@example.com"
            />
          </div>
        )}

        {/* Database Tab */}
        {activeTab === "database" && (
          <div>
            <FormField
              label="Database Host"
              value={formData.dbHost}
              onChange={(value) => handleInputChange("dbHost", value)}
              placeholder="localhost"
            />
            <FormField
              label="Database Port"
              type="number"
              value={formData.dbPort}
              onChange={(value) => handleInputChange("dbPort", value)}
              placeholder="5432"
            />
            <FormField
              label="Database Name"
              value={formData.dbName}
              onChange={(value) => handleInputChange("dbName", value)}
              placeholder="speedlink_db"
            />
            <FormField
              label="Database User"
              value={formData.dbUser}
              onChange={(value) => handleInputChange("dbUser", value)}
              placeholder="admin"
            />
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div>
            <FormField
              label="API Key"
              value={formData.apiKey}
              onChange={(value) => handleInputChange("apiKey", value)}
              placeholder="sk_live_..."
            />
            <FormField
              label="API Endpoint"
              value={formData.apiEndpoint}
              onChange={(value) => handleInputChange("apiEndpoint", value)}
              placeholder="https://api.example.com/v1"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          justifyContent: "flex-start",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
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
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2-8.83"></path>
          </svg>
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            backgroundColor: isSaving ? "#93C5FD" : "#3B82F6",
            border: "none",
            borderRadius: "8px",
            cursor: isSaving ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
            color: "white",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.backgroundColor = "#2563EB";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.backgroundColor = "#3B82F6";
            }
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
