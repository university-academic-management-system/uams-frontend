import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { StudentServices } from "@services/student.service";
import { toaster } from "@components/ui/toaster";

import type { Student } from "@type/student.type";

interface StudentDetailsSidebarProps {
    student: Student;
    onClose: () => void;
}

const BioItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ color: "#94a3b8" }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</p>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
        </div>
    </div>
);

const StudentDetailsSidebar = ({ student, onClose }: StudentDetailsSidebarProps) => {
    const [selectedRole, setSelectedRole] = useState<"CLASS_REP" | "ASSISTANT_CLASS_REP" | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await StudentServices.getStudentProfile(student.id);
                setProfile(data);
                const roles = data?.user?.Roles?.map((r: any) => r.name) || [];
                if (roles.includes("CLASS_REP")) setSelectedRole("CLASS_REP");
                else if (roles.includes("ASSISTANT_CLASS_REP")) setSelectedRole("ASSISTANT_CLASS_REP");
                else setSelectedRole(null);
            } catch (err) {
                console.error("Failed to fetch student profile:", err);
            } finally {
                setLoading(false);
            }
        };
        if (student.id) fetchProfile();
    }, [student.id]);

    const handleRoleChange = (role: "CLASS_REP" | "ASSISTANT_CLASS_REP") => {
        setSelectedRole((prev) => (prev === role ? null : role));
        setSaveError(null);
    };

    // Fixed: Use the actual user ID from the profile, not the student ID
    const handleSaveRole = async () => {
        if (!selectedRole) return;
        
        // Extract user ID from the fetched profile
        const userId = profile?.user?.id || profile?.userId;
        if (!userId) {
            setSaveError("Unable to identify user. Please refresh and try again.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            await StudentServices.assignClassRepRole(userId, selectedRole);
            toaster.success({ title: "Role assigned successfully" });
            onClose();
        } catch (err: any) {
            console.error("Failed to assign role:", err);
            setSaveError(err.response?.data?.message || "Failed to assign role. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{
            position: "fixed", top: "64px", right: 0, width: "380px", height: "calc(100vh - 64px)",
            background: "white", borderLeft: "1px solid #f1f5f9", boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
            zIndex: 40, display: "flex", flexDirection: "column",
            animation: "slideInRight 0.3s ease-out",
        }}>
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

            {/* Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>Student Bio</h3>
                <button onClick={onClose} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", color: "#94a3b8" }}>
                    <X size={20} />
                </button>
            </div>

            {loading ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#2563eb" }} />
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>Loading profile...</p>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : profile ? (
                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                    {/* Avatar & Name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "32px" }}>
                        <div style={{ width: "96px", height: "96px", background: "#eff6ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", marginBottom: "16px", border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                            {profile.user?.avatar ? (
                                <img src={profile.user.avatar.startsWith("data:") ? profile.user.avatar : `data:image/jpeg;base64,${profile.user.avatar}`} alt={profile.user.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{profile.user?.fullName || student.fullName}</h4>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>{profile.studentId || ""}</p>
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                            <span style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, background: profile?.status === "ACTIVE" ? "#dcfce7" : "#fee2e2", color: profile?.status === "ACTIVE" ? "#15803d" : "#b91c1c" }}>
                                {profile?.status === "ACTIVE" ? "Active" : "Inactive"}
                            </span>
                            {selectedRole && (
                                <span style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, background: selectedRole === "CLASS_REP" ? "#f3e8ff" : "#fef3c7", color: selectedRole === "CLASS_REP" ? "#7c3aed" : "#b45309" }}>
                                    {selectedRole === "CLASS_REP" ? "Class Rep" : "Asst. Rep"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Bio Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <BioItem icon={<Mail size={14} />} label="Email Address" value={profile.user?.email || student.email} />
                        <BioItem icon={<Phone size={14} />} label="Phone Number" value={profile.user?.phone || "N/A"} />
                        <BioItem icon={<Calendar size={14} />} label="Session" value={profile.session?.name || "N/A"} />
                        <BioItem icon={<ShieldCheck size={14} />} label="Department" value={profile.Department?.name || "N/A"} />
                        <BioItem icon={<ShieldCheck size={14} />} label="Program" value={profile.Program?.name || "N/A"} />
                        <BioItem icon={<ShieldCheck size={14} />} label="Level" value={(profile.level || student.level)?.replace(/^L/i, '') || "N/A"} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>CGPA</p>
                                <p style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{profile.currentGPA || "0.00"}</p>
                            </div>
                            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Credits</p>
                                <p style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: 0 }}>{profile.totalCreditsEarned || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Roles */}
                    <div style={{ paddingTop: "24px", marginTop: "24px", borderTop: "1px solid #f8fafc" }}>
                        <h5 style={{ fontSize: "12px", fontWeight: 700, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <ShieldCheck size={16} color="#2563eb" /> Academic Roles
                        </h5>
                        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#334155" }}>Assign as Class Rep</span>
                                <input type="checkbox" checked={selectedRole === "CLASS_REP"} onChange={() => handleRoleChange("CLASS_REP")} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2563eb" }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#334155" }}>Assign as Asst. Class Rep</span>
                                <input type="checkbox" checked={selectedRole === "ASSISTANT_CLASS_REP"} onChange={() => handleRoleChange("ASSISTANT_CLASS_REP")} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#2563eb" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Class Rep Permissions</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                                    <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, background: "#2563eb", color: "white", border: "1px solid #2563eb" }}>Post Updates</span>
                                    <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, background: "white", color: "#94a3b8", border: "1px solid #e2e8f0" }}>View Results</span>
                                    <span style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700, background: "#2563eb", color: "white", border: "1px solid #2563eb" }}>Manage Attendance</span>
                                </div>
                            </div>
                            {saveError && <p style={{ fontSize: "12px", color: "#ef4444", fontWeight: 500 }}>{saveError}</p>}
                            <div style={{ paddingTop: "8px" }}>
                                <button onClick={handleSaveRole} disabled={!selectedRole || isSaving} style={{
                                    width: "100%", padding: "8px", borderRadius: "12px", fontSize: "12px", fontWeight: 700,
                                    border: "none", cursor: selectedRole && !isSaving ? "pointer" : "not-allowed",
                                    background: selectedRole && !isSaving ? "#1D7AD9" : "#e2e8f0",
                                    color: selectedRole && !isSaving ? "white" : "#94a3b8",
                                    boxShadow: selectedRole && !isSaving ? "0 4px 12px rgba(29,122,217,0.1)" : "none",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                }}>
                                    {isSaving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                                    {isSaving ? "Saving..." : "Save Role Settings"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default StudentDetailsSidebar;