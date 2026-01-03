// Utility to extract data from JWT token
export const decodeToken = (): any | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Decode JWT token (middle part is the payload)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get auth data from token
export const getAuthData = () => {
  const payload = decodeToken();
  if (!payload) return null;

  return {
    departmentId: payload.departmentId,
    universityId: payload.universityId,
    tenantId: payload.tenantId,
    userId: payload.id,
    role: payload.role,
    facultyId: payload.facultyId,
  };
};

// Get current department ID from token
export const getCurrentDepartmentId = (): string => {
  const payload = decodeToken();
  return payload?.departmentId || "";
};

// Get current university ID from token
export const getCurrentUniversityId = (): string => {
  const payload = decodeToken();
  return payload?.universityId || "";
};

// Get current tenant ID from token
export const getCurrentTenantId = (): string => {
  const payload = decodeToken();
  return payload?.tenantId || "";
};
