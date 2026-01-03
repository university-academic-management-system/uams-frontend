import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthData } from "../components/types";

// Constants
const SESSION_KEY = "uniedu_session";

interface AuthContextType {
  authData: AuthData | null;
  isLoading: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted session on app startup
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);

        // Check if we have a valid token in localStorage
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        if (session?.authData && token && role) {
          setAuthData(session.authData);
        } else {
          // Clear invalid session
          clearAuthStorage();
        }
      } else {
        // Also check for individual localStorage items (legacy support)
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        const tenantId = localStorage.getItem("tenantId");

        if (token && role && tenantId) {
          const loadedAuthData: AuthData = {
            token,
            role,
            tenantId,
            universityId: localStorage.getItem("universityId") || "",
            facultyId: localStorage.getItem("facultyId") || null,
            departmentId: localStorage.getItem("departmentId") || null,
            email: localStorage.getItem("userEmail") || undefined,
          };

          setAuthData(loadedAuthData);
          
          // Store in session storage for consistency
          const sessionData = { authData: loadedAuthData };
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        }
      }
    } catch (e) {
      console.error("Error loading session:", e);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("universityId");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("departmentId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginEmail");
  };

  const login = (data: AuthData) => {
    // Store all data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("tenantId", data.tenantId);
    localStorage.setItem("universityId", data.universityId);

    if (data.facultyId) localStorage.setItem("facultyId", data.facultyId);
    if (data.departmentId) localStorage.setItem("departmentId", data.departmentId);
    
    if (data.email) {
      localStorage.setItem("userEmail", data.email);
    } else {
      // Store the email from login form if not in response
      const email = localStorage.getItem("loginEmail");
      if (email) {
        localStorage.setItem("userEmail", email);
        localStorage.removeItem("loginEmail");
      }
    }

    // Create session object
    const sessionData = { authData: data };

    // Store in session storage
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setAuthData(data);
  };

  const logout = () => {
    clearAuthStorage();
    setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ 
      authData, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!authData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
