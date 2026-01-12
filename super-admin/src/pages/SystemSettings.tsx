import React, { useState } from "react";

type TabType = "profile" | "notification" | "global-settings";

interface ProfileData {
  firstName: string;
  lastName: string;
  officialEmail: string;
  phoneNumber: string;
  userAddress: string;
  slug: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationData {
  changesPassword: boolean;
  makesPayment: boolean;
  sendsDirectMessage: boolean;
  editsProfile: boolean;
  uploadsData: boolean;
  createsNewProfile: boolean;
  onboardsNewMember: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

interface GlobalSettingsData {
  language: string;
  timeZone: string;
  theme: string;
  themeSecondary: string;
  fontSize: string;
  pageZoom: string;
  rememberPassword: boolean;
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    officialEmail: "",
    phoneNumber: "",
    userAddress: "",
    slug: "super-admin-001",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification state
  const [notificationData, setNotificationData] = useState<NotificationData>({
    changesPassword: false,
    makesPayment: false,
    sendsDirectMessage: false,
    editsProfile: false,
    uploadsData: false,
    createsNewProfile: false,
    onboardsNewMember: false,
    pushNotifications: true,
    emailNotifications: true,
  });

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsData>({
    language: "English",
    timeZone: "17:30 GMT (Lagos)",
    theme: "Light",
    themeSecondary: "Light",
    fontSize: "Recommended",
    pageZoom: "100%",
    rememberPassword: true,
  });

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user data from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Split full_name into firstName and lastName
        const nameParts = (userData.full_name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        setProfileData(prev => ({
          ...prev,
          firstName,
          lastName,
          officialEmail: userData.email || "",
        }));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveChanges = async () => {
    if (activeTab === "profile") {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      try {
        const { authService } = await import("../services/authService");
        await authService.updateProfile({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.officialEmail,
          phone: profileData.phoneNumber,
          address: profileData.userAddress,
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err: any) {
        console.error("Error updating profile:", err);
        setSaveError(err.response?.data?.message || "Failed to update profile");
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("Saving changes for tab:", activeTab);
      // TODO: Implement API calls for other tabs
    }
  };

  const handleReset = () => {
    if (activeTab === "profile") {
      setProfileData({
        firstName: "",
        lastName: "",
        officialEmail: "",
        phoneNumber: "",
        userAddress: "",
        slug: "super-admin-001",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else if (activeTab === "notification") {
      setNotificationData({
        changesPassword: false,
        makesPayment: false,
        sendsDirectMessage: false,
        editsProfile: false,
        uploadsData: false,
        createsNewProfile: false,
        onboardsNewMember: false,
        pushNotifications: true,
        emailNotifications: true,
      });
    } else {
      setGlobalSettings({
        language: "English",
        timeZone: "17:30 GMT (Lagos)",
        theme: "Light",
        themeSecondary: "Light",
        fontSize: "Recommended",
        pageZoom: "100%",
        rememberPassword: true,
      });
    }
  };

  // Tab button component
  const TabButton: React.FC<{ tab: TabType; label: string }> = ({ tab, label }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        style={{
          padding: isMobile ? "8px 16px" : "10px 24px",
          fontSize: isMobile ? "13px" : "14px",
          fontWeight: 500,
          backgroundColor: isActive ? "#2563eb" : "transparent",
          color: isActive ? "white" : "#6b7280",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </button>
    );
  };


  // Toggle switch component
  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: checked ? "#2563eb" : "#d1d5db",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "white",
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );

  // Select dropdown component
  const SelectField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
  }> = ({ label, value, onChange, options }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "white",
          color: "#374151",
          cursor: "pointer",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "16px",
          paddingRight: "40px",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  // Input field component
  const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
  }> = ({ label, value, onChange, placeholder, type = "text", disabled = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: disabled ? "#f9fafb" : "white",
          color: disabled ? "#9ca3af" : "#374151",
          outline: "none",
        }}
      />
    </div>
  );

  // Checkbox component
  const CheckboxItem: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, checked, onChange }) => (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        fontSize: "14px",
        color: "#374151",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "18px",
          height: "18px",
          accentColor: "#2563eb",
          cursor: "pointer",
        }}
      />
      {label}
    </label>
  );

  // Profile Tab Content
  const ProfileTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Profile Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: isMobile ? "20px" : "32px",
          border: "1px solid #f3f4f6",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "24px", margin: 0 }}>
          Profile
        </h2>

        {/* Avatar and Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "28px",
                height: "28px",
                backgroundColor: "white",
                borderRadius: "50%",
                border: "2px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Edit</span>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", margin: 0 }}>
              {profileData.firstName} {profileData.lastName}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              {profileData.officialEmail}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "20px",
          }}
        >
          <InputField
            label="First Name"
            value={profileData.firstName}
            onChange={(v) => setProfileData({ ...profileData, firstName: v })}
            placeholder="Enter first name"
          />
          <InputField
            label="Last Name"
            value={profileData.lastName}
            onChange={(v) => setProfileData({ ...profileData, lastName: v })}
            placeholder="Enter last name"
          />
          <InputField
            label="Email Address"
            value={profileData.officialEmail}
            onChange={() => {}}
            placeholder="Enter email address"
            disabled={true}
          />
          <InputField
            label="Phone Number"
            value={profileData.phoneNumber}
            onChange={(v) => setProfileData({ ...profileData, phoneNumber: v })}
            placeholder="Enter phone number"
          />
          <InputField
            label="User Address"
            value={profileData.userAddress}
            onChange={(v) => setProfileData({ ...profileData, userAddress: v })}
            placeholder="Enter user address"
          />
          <InputField
            label="Slug"
            value={profileData.slug}
            onChange={() => {}}
            placeholder="Cannot be changed"
            disabled={true}
          />
        </div>
      </div>

      {/* Change Password Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: isMobile ? "20px" : "32px",
          border: "1px solid #f3f4f6",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "24px", margin: 0 }}>
          Change Password
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
          <div style={{ width: isMobile ? "100%" : "calc(50% - 10px)" }}>
            <InputField
              label="Current Password"
              value={profileData.currentPassword}
              onChange={(v) => setProfileData({ ...profileData, currentPassword: v })}
              type="password"
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "20px",
            }}
          >

            <InputField
              label="New Password"
              value={profileData.newPassword}
              onChange={(v) => setProfileData({ ...profileData, newPassword: v })}
              type="password"
            />
            <InputField
              label="Confirm Password"
              value={profileData.confirmPassword}
              onChange={(v) => setProfileData({ ...profileData, confirmPassword: v })}
              type="password"
            />
          </div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, textTransform: "uppercase" }}>
            * You will be asked to log in again with your new password after you save your changes.
          </p>
        </div>
      </div>
    </div>
  );

  // Notification Tab Content
  const NotificationTab = () => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: isMobile ? "20px" : "32px",
        border: "1px solid #f3f4f6",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "24px", margin: 0 }}>
        Notification
      </h2>

      {/* Actionable Email Notifications */}
      <div style={{ marginTop: "24px" }}>
        <p style={{ fontSize: "14px", color: "#111827", margin: 0 }}>
          <strong>Actionable Email Notifications</strong>{" "}
          <span style={{ color: "#6b7280", fontStyle: "italic" }}>Email me immediately when someone:</span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          <CheckboxItem
            label="Changes their password"
            checked={notificationData.changesPassword}
            onChange={(v) => setNotificationData({ ...notificationData, changesPassword: v })}
          />
          <CheckboxItem
            label="Makes a payment"
            checked={notificationData.makesPayment}
            onChange={(v) => setNotificationData({ ...notificationData, makesPayment: v })}
          />
          <CheckboxItem
            label="Sends me a direct message"
            checked={notificationData.sendsDirectMessage}
            onChange={(v) => setNotificationData({ ...notificationData, sendsDirectMessage: v })}
          />
          <CheckboxItem
            label="Edits their profile"
            checked={notificationData.editsProfile}
            onChange={(v) => setNotificationData({ ...notificationData, editsProfile: v })}
          />
          <CheckboxItem
            label="Uploads a data"
            checked={notificationData.uploadsData}
            onChange={(v) => setNotificationData({ ...notificationData, uploadsData: v })}
          />
          <CheckboxItem
            label="Creates a new profile"
            checked={notificationData.createsNewProfile}
            onChange={(v) => setNotificationData({ ...notificationData, createsNewProfile: v })}
          />
          <CheckboxItem
            label="Onboards a new member"
            checked={notificationData.onboardsNewMember}
            onChange={(v) => setNotificationData({ ...notificationData, onboardsNewMember: v })}
          />
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "32px 0" }} />

      {/* Toggle Settings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>Push Notifications</span>
          <ToggleSwitch
            checked={notificationData.pushNotifications}
            onChange={(v) => setNotificationData({ ...notificationData, pushNotifications: v })}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>Email Notifications</span>
          <ToggleSwitch
            checked={notificationData.emailNotifications}
            onChange={(v) => setNotificationData({ ...notificationData, emailNotifications: v })}
          />
        </div>
      </div>
    </div>
  );

  // Global Settings Tab Content
  const GlobalSettingsTab = () => (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        padding: isMobile ? "20px" : "32px",
        border: "1px solid #f3f4f6",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "24px", margin: 0 }}>
        Global Settings
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px" }}>
        {/* Row 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "20px",
          }}
        >
          <SelectField
            label="Language"
            value={globalSettings.language}
            onChange={(v) => setGlobalSettings({ ...globalSettings, language: v })}
            options={["English", "French", "Spanish", "German", "Portuguese"]}
          />
          <SelectField
            label="Time Zone"
            value={globalSettings.timeZone}
            onChange={(v) => setGlobalSettings({ ...globalSettings, timeZone: v })}
            options={["17:30 GMT (Lagos)", "00:00 GMT (London)", "-05:00 EST (New York)", "+08:00 SGT (Singapore)"]}
          />
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "20px",
          }}
        >
          <SelectField
            label="Theme"
            value={globalSettings.theme}
            onChange={(v) => setGlobalSettings({ ...globalSettings, theme: v })}
            options={["Light", "Dark", "System"]}
          />
          <SelectField
            label="Theme"
            value={globalSettings.themeSecondary}
            onChange={(v) => setGlobalSettings({ ...globalSettings, themeSecondary: v })}
            options={["Light", "Dark", "System"]}
          />
        </div>

        {/* Row 3 */}
        <SelectField
          label="Font Size"
          value={globalSettings.fontSize}
          onChange={(v) => setGlobalSettings({ ...globalSettings, fontSize: v })}
          options={["Small", "Recommended", "Large", "Extra Large"]}
        />

        {/* Row 4 */}
        <SelectField
          label="Page Zoom"
          value={globalSettings.pageZoom}
          onChange={(v) => setGlobalSettings({ ...globalSettings, pageZoom: v })}
          options={["75%", "90%", "100%", "110%", "125%", "150%"]}
        />

        {/* Remember Password Toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>Remember Password</span>
          <ToggleSwitch
            checked={globalSettings.rememberPassword}
            onChange={(v) => setGlobalSettings({ ...globalSettings, rememberPassword: v })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "#f9fafb",
        minHeight: "100%",
      }}
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "4px",
            gap: "4px",
          }}
        >
          <TabButton tab="profile" label="Profile" />
          <TabButton tab="notification" label="Notification" />
          <TabButton tab="global-settings" label="Global Settings" />
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: "100%" }}>
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "notification" && <NotificationTab />}
        {activeTab === "global-settings" && <GlobalSettingsTab />}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "16px",
          marginTop: "32px",
        }}
      >
        <button
          onClick={handleReset}
          style={{
            padding: "12px 32px",
            fontSize: "14px",
            fontWeight: 500,
            backgroundColor: "white",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          Reset
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          style={{
            padding: "12px 32px",
            fontSize: "14px",
            fontWeight: 500,
            backgroundColor: isSaving ? "#93c5fd" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: isSaving ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSaving) e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            if (!isSaving) e.currentTarget.style.backgroundColor = "#2563eb";
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
