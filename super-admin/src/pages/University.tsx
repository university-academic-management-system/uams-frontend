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
  
  // Action dropdown and modal states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Action handlers for dropdown menu
  const handleViewClick = (uni: University) => {
    setSelectedUniversity(uni);
    setShowViewModal(true);
    setOpenDropdown(null);
  };

  const handleEditClick = (uni: University) => {
    setSelectedUniversity(uni);
    setEditFormData({
      name: uni.name,
      contactPerson: uni.contact_person,
      email: uni.email,
      phone: uni.phone,
      address: uni.address || "",
      status: uni.status,
    });
    setShowEditModal(true);
    setOpenDropdown(null);
  };

  const handleDeleteClick = (uni: University) => {
    setSelectedUniversity(uni);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const handleToggleStatus = async (uni: University) => {
    setOpenDropdown(null);
    try {
      if (uni.status === "active") {
        await universityService.suspend(uni.id);
      } else {
        await universityService.activate(uni.id);
      }
      // Refresh universities list
      const updatedList = await universityService.getAll();
      setUniversities(Array.isArray(updatedList) ? updatedList : []);
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedUniversity) return;
    setIsUpdating(true);
    try {
      await universityService.update(selectedUniversity.id, {
        name: editFormData.name,
        contact_person: editFormData.contactPerson,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
        status: editFormData.status as 'active' | 'pending' | 'suspended',
      });
      // Refresh universities list
      const updatedList = await universityService.getAll();
      setUniversities(Array.isArray(updatedList) ? updatedList : []);
      setShowEditModal(false);
      setSelectedUniversity(null);
    } catch (err) {
      console.error("Error updating university:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUniversity) return;
    setIsDeleting(true);
    try {
      await universityService.delete(selectedUniversity.id);
      // Refresh universities list
      const updatedList = await universityService.getAll();
      setUniversities(Array.isArray(updatedList) ? updatedList : []);
      setShowDeleteModal(false);
      setSelectedUniversity(null);
    } catch (err) {
      console.error("Error deleting university:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

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
                  <td style={{ padding: "16px", textAlign: "center", position: "relative" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === uni.id ? null : uni.id);
                      }}
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
                    
                    {/* Dropdown Menu */}
                    {openDropdown === uni.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: "16px",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          border: "1px solid #e5e7eb",
                          zIndex: 50,
                          minWidth: "160px",
                          overflow: "hidden",
                        }}
                      >
                        <button
                          onClick={() => handleViewClick(uni)}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            backgroundColor: "white",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14px",
                            color: "#374151",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(uni)}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            backgroundColor: "white",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14px",
                            color: "#374151",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(uni)}
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            backgroundColor: "white",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "14px",
                            color: uni.status === "active" ? "#f59e0b" : "#22c55e",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            {uni.status === "active" ? (
                              <path d="M4.93 4.93l14.14 14.14"></path>
                            ) : (
                              <path d="M9 12l2 2 4-4"></path>
                            )}
                          </svg>
                          {uni.status === "active" ? "Suspend" : "Activate"}
                        </button>
                        {uni.status !== "active" && (
                          <>
                            <div style={{ height: "1px", backgroundColor: "#e5e7eb" }}></div>
                            <button
                              onClick={() => handleDeleteClick(uni)}
                              style={{
                                width: "100%",
                                padding: "10px 16px",
                                backgroundColor: "white",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                fontSize: "14px",
                                color: "#ef4444",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "white";
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
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

      {/* View Modal */}
      {showViewModal && selectedUniversity && (
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
          onClick={() => setShowViewModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px" : "32px",
              width: "100%",
              maxWidth: "512px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1273D4", margin: 0 }}>University Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                style={{
                  padding: isMobile ? "6px 8px" : "3px 7px",
                  borderRadius: "6px",
                  backgroundColor: "#1273D4",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  color: "white"
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
                <CloseIcon w={12} h={12} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "University Name", value: selectedUniversity.name },
                { label: "Code", value: selectedUniversity.code },
                { label: "Contact Person", value: selectedUniversity.contact_person },
                { label: "Email", value: selectedUniversity.email },
                { label: "Phone", value: selectedUniversity.phone },
                { label: "Address", value: selectedUniversity.address || "N/A" },
                { label: "Status", value: selectedUniversity.status, isStatus: true }
              ].map((item, index) => (
                <div key={index} style={{ borderBottom: index < 6 ? "1px solid #f3f4f6" : "none", paddingBottom: index < 6 ? "12px" : "0" }}>
                  <p style={{ color: "#6b7280", fontSize: "12px", marginBottom: "4px", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</p>
                  {item.isStatus ? (
                     <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "white",
                        backgroundColor: item.value === "active" ? "#22c55e" : item.value === "pending" ? "#f59e0b" : "#9ca3af",
                        display: "inline-block",
                        textTransform: "capitalize"
                      }}
                    >
                      {item.value}
                    </span>
                  ) : (
                    <p style={{ color: "#111827", fontWeight: 500, fontSize: "15px", margin: 0 }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUniversity && (
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
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px" : "32px",
              width: "100%",
              maxWidth: "512px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1273D4", margin: 0 }}>Edit University</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: isMobile ? "6px 8px" : "2px 7px",
                  borderRadius: "6px",
                  backgroundColor: "#1273D4",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  color: "white"
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
                <CloseIcon w={12} h={12} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  University Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  value={editFormData.contactPerson}
                  onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  Phone
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  Address
                </label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", backgroundColor: "white" }}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isUpdating}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    backgroundColor: "#2563eb",
                    border: "none",
                    color: "white",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    opacity: isUpdating ? 0.7 : 1,
                  }}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUniversity && (
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
            padding: "16px",
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              width: "48px", 
              height: "48px", 
              backgroundColor: "#fee2e2", 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>Delete University</h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
              Are you sure you want to delete <strong>{selectedUniversity.name}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                  cursor: "pointer",
                  width: "100%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  backgroundColor: "#ef4444",
                  border: "none",
                  color: "white",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                  width: "100%",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                  }
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPage;
