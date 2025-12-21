import React, { useState, useEffect } from "react";
import { universityService } from "../services/universityService";
import { University } from "../../types";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const UniversityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Form fields state
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(null); // Clear errors when user types
  };

  const validateForm = (): boolean => {
    if (!formData.slug.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    if (!formData.name.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    if (!formData.email.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    if (!formData.phone.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    if (!formData.address.trim()) {
      setFormErrors("Please fill in all required fields");
      return false;
    }
    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormErrors("Please enter a valid email address");
      return false;
    }
    setFormErrors(null);
    return true;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Map form data to API format
        const universityData = {
          slug: formData.slug,
          name: formData.name,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          status: formData.status as 'active' | 'pending' | 'suspended',
        };
        
        await universityService.create(universityData);
        
        // Refresh the universities list
        const updatedList = await universityService.getAll();
        setUniversities(Array.isArray(updatedList) ? updatedList : []);
        
        setShowModal(false);
        // Reset form
        setFormData({
          slug: "",
          name: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          status: "active",
        });
        setFormErrors(null);
      } catch (err: any) {
        console.error("Error creating university:", err);
        setFormErrors(err.response?.data?.message || "Failed to create university. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await universityService.getAll();
        console.log("Universities API response:", data);
        // Ensure data is always an array
        setUniversities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch universities. Please try again.");
        console.error("Error fetching universities:", err);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px", minHeight: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading universities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px", minHeight: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#ef4444", fontSize: "16px" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "16px" : "32px", minHeight: "100%" }}>
      {/* Header with Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <img
          src="/assets/university.png"
          alt="University Icon"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
          }}
        />
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            margin: "0",
          }}
        >
          Universities
        </h1>
      </div>

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "stretch" : "center",
          marginBottom: isMobile ? "16px" : "24px",
          gap: isMobile ? "12px" : "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flex: isMobile ? "1" : "0",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <input
            type="text"
            placeholder="Search by name, email or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: isMobile ? "10px 12px" : "8px 16px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: isMobile ? "13px" : "14px",
              width: isMobile ? "100%" : "280px",
              outline: "none",
              transition: "all 0.2s ease-in-out",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(59, 130, 246, 0.1)";
              e.currentTarget.style.borderColor = "#93c5fd";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          />
          {/* Filter Button */}
          <button
            onClick={() => {
              // TODO: Implement filter dropdown
              console.log("Open filter");
            }}
            style={{
              backgroundColor: "white",
              color: "#5c626b",
              padding: isMobile ? "10px 12px" : "8px 14px",
              borderRadius: "8px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#9CA3AF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "white";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#e5e7eb";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filter</span>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {/* Export Button */}
          <button
            onClick={() => {
              console.log("Export universities");
            }}
            style={{
              backgroundColor: "white",
              color: "#5c626bff",
              padding: isMobile ? "10px 12px" : "8px 16px",
              borderRadius: "8px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "6px" : "8px",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#F9FAFB";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#9CA3AF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "white";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#D1D5DB";
            }}
          >
            <svg
              width={isMobile ? "14" : "16"}
              height={isMobile ? "14" : "16"}
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
            <span>{isMobile ? "Export" : "Export"}</span>
          </button>

          {/* Onboard University Button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: isMobile ? "10px 12px" : "8px 16px",
              borderRadius: "8px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "6px" : "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#2563eb";
            }}
          >
            <AddIcon
              w={isMobile ? 4.5 : 10}
              h={isMobile ? 4.5 : 10}
              color="white"
            />
            <span>{isMobile ? "Add" : "Onboard University"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {filteredUniversities.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "#9ca3af",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #f3f4f6",
              }}
            >
              No universities found.
            </div>
          ) : (
            filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #f3f4f6",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {uni.code}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {uni.name}
                    </p>
                  </div>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#d1d5db",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#6b7280";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#d1d5db";
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>⋯</span>
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "12px",
                    paddingTop: "8px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 2px 0", color: "#6b7280" }}>
                      Contact Person
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#111827",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {uni.contact_person}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px 0", color: "#6b7280" }}>
                      Email
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#4b5563",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {uni.email}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px 0", color: "#6b7280" }}>
                      Phone
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "#4b5563",
                        fontFamily: "monospace",
                        fontSize: "11px",
                      }}
                    >
                      {uni.phone}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "8px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "white",
                      backgroundColor:
                        uni.status === "active" ? "#22c55e" : uni.status === "pending" ? "#f59e0b" : "#9ca3af",
                    }}
                  >
                    {uni.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #f3f4f6",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              minWidth: "800px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "40px",
                  }}
                >
                  <input type="checkbox" />
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Code
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Contact Person
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Phone No
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#6b7280",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUniversities.map((uni) => (
                <tr
                  key={uni.id}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    <input type="checkbox" />
                  </td>
                  <td style={{ padding: "16px", color: "#6b7280" }}>
                    {uni.code}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#111827",
                      fontWeight: 500,
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {uni.name}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#4b5563",
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {uni.contact_person}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#4b5563",
                      maxWidth: "180px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {uni.email}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#4b5563",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  >
                    {uni.phone}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "white",
                        backgroundColor:
                          uni.status === "active" ? "#22c55e" : uni.status === "pending" ? "#f59e0b" : "#9ca3af",
                        display: "inline-block",
                      }}
                    >
                      {uni.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        borderRadius: "6px",
                        fontWeight: 9000,
                        border: "none",
                        cursor: "pointer",
                        color: "#676a6dff",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#01040bff";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#676a6dff";
                      }}
                    >
                      <span style={{ fontSize: "20px" }}>⋯</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUniversities.length === 0 && (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              No universities found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isMobile && filteredUniversities.length > 0 && (
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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUniversities.length)} of {filteredUniversities.length} universities
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "14px",
                color: currentPage === 1 ? "#D1D5DB" : "#6B7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              ← Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: "8px 12px",
                    border: currentPage === pageNum ? "1px solid #3B82F6" : "1px solid #E5E7EB",
                    borderRadius: "6px",
                    backgroundColor: currentPage === pageNum ? "#EFF6FF" : "white",
                    color: currentPage === pageNum ? "#3B82F6" : "#6B7280",
                    fontWeight: currentPage === pageNum ? "600" : "400",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNum) {
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNum) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: "14px",
                color: currentPage === totalPages ? "#D1D5DB" : "#6B7280",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: isMobile ? "16px" : "0",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px" : "32px",
              width: "100%",
              maxWidth: isMobile ? "100%" : "512px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f3f4f6",
              position: "relative",
              maxHeight: isMobile ? "90vh" : "auto",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isMobile ? "16px" : "24px",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: 700,
                  color: "#1273D4",
                  margin: 0,
                }}
              >
                Onboard University
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: isMobile ? "6px 8px" : "7px 9px",
                  borderRadius: "6px",
                  backgroundColor: "#1273D4",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#2563eb";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#1273D4";
                }}
              >
                <CloseIcon w={10} h={10} />
              </button>
            </div>

            {/* Form Fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "12px" : "16px",
                marginBottom: isMobile ? "16px" : "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  University Slug <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g uniport"
                  value={formData.slug}
                  onChange={(e) => handleFormChange("slug", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  University Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter university name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  Contact Person <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) => handleFormChange("contactPerson", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  Official Email <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@university.edu.ng"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  Phone Number <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  University Address <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter university address"
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  Status <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    padding: isMobile ? "8px 12px" : "8px 16px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease-in-out",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {formErrors && (
              <div
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#991B1B",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "14px",
                  border: "1px solid #FECACA",
                }}
              >
                {formErrors}
              </div>
            )}

            {/* Required fields message */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 650,
                fontStyle: "bold",
                fontSize: "10px",
                lineHeight: "100%",
                textAlign: "left",
                color: "#5f6470ff",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "#EF4444" }}>*</span> Required fields. A temporary password and welcome email will be sent automatically.
            </p>

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: isMobile ? "8px 16px" : "8px 20px",
                  borderRadius: "8px",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 500,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "white";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: isMobile ? "8px 16px" : "8px 20px",
                  borderRadius: "8px",
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 500,
                  backgroundColor: isSubmitting ? "#93C5FD" : "#2563eb",
                  border: "none",
                  color: "white",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#2563eb";
                  }
                }}
              >
                {isSubmitting ? "Adding..." : "Add University"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPage;
