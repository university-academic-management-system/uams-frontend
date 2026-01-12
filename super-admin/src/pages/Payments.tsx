import React, { useState, useEffect } from "react";
import { paymentService, Payment } from "../services/paymentService";

const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await paymentService.getAll();
        setPayments(data.payments || []);
        setTotalRevenue(data.totalRevenue || 0);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments. Please try again.");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return { bg: "#D1FAE5", text: "#059669", label: "Succeeded" };
      case "pending":
        return { bg: "#FEF3C7", text: "#D97706", label: "Pending" };
      case "declined":
        return { bg: "#FEE2E2", text: "#DC2626", label: "Declined" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", label: status };
    }
  };

  const getPaymentMethodIcon = (method: string | null | undefined) => {
    if (!method) return null;
    if (method.toLowerCase().includes("visa")) {
      return "/super-admin/assets/visa logo.png";
    } else if (method.toLowerCase().includes("mastercard")) {
      return "/super-admin/assets/master.png";
    }
    return null;
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return `₦${num.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
  };

  const filteredPayments = payments.filter(
    (p) =>
      (p.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.university_name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ color: "#6B7280", fontSize: "16px" }}>Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ color: "#DC2626", fontSize: "16px" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <img
          src="/super-admin/assets/payment.png"
          alt="Payment Icon"
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
          Transaction History
        </h1>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "32px",
          flexWrap: "wrap",
        }}
      >
        {/* Total Revenue Card */}
        <div
          style={{
            backgroundColor: "#EDE9FE",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "1",
            minWidth: "280px",
          }}
        >
          <img
            src="/super-admin/assets/transaction.png"
            alt="Payment"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderRadius: "10px",
              padding: "6px",
              boxSizing: "border-box",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                margin: "0 0 4px 0",
                fontWeight: "500",
              }}
            >
              Total Revenue Generated
            </p>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                margin: "0",
              }}
            >
              ₦{totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div
          style={{
            backgroundColor: "#DBEAFE",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "1",
            minWidth: "280px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#6B7280",
                margin: "0 0 4px 0",
                fontWeight: "500",
              }}
            >
              Total Transactions
            </p>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                margin: "0",
              }}
            >
              {totalCount.toLocaleString()}
            </h2>
          </div>
        </div>
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
        <div
          style={{
            flex: 1,
            minWidth: "250px",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
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
              color: "#9CA3AF",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
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
        </div>

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
          onClick={() => setFilterOpen(!filterOpen)}
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

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3B82F6";
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
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #E5E7EB",
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
                <input
                  type="checkbox"
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#3B82F6",
                  }}
                />
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
                Transaction Id
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
                Payment from
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
                Payment for
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
                Amount
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
                Payment method
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
                Date
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
            {paginatedPayments.map((payment, index) => {
              const statusColor = getStatusColor(payment.status);
              const paymentMethodDisplay = payment.payment_method + (payment.card_last_four ? ` ••••${payment.card_last_four}` : '');
              return (
                <tr
                  key={payment.id || index}
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
                  <td style={{ padding: "16px", textAlign: "left" }}>
                    <input
                      type="checkbox"
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        accentColor: "#3B82F6",
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#6B7280",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                  >
                    {payment.transaction_id}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    {payment.student_name} - {payment.university_name}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#6B7280",
                    }}
                  >
                    {payment.payment_for}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  >
                    {formatAmount(payment.amount)}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#6B7280",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {getPaymentMethodIcon(payment.payment_method) && (
                        <img
                          src={getPaymentMethodIcon(payment.payment_method)!}
                          alt={payment.payment_method}
                          style={{
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      <span>{paymentMethodDisplay}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      color: "#6B7280",
                    }}
                  >
                    {formatDate(payment.payment_date)}
                  </td>
                  <td style={{ padding: "16px", textAlign: "left" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {statusColor.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "24px",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} payments
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
                color: currentPage === 1 ? "#D1D5DB" : "#6B7280",
                transition: "all 0.2s",
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
                    transition: "all 0.2s",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                padding: "8px 12px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                color: currentPage === totalPages || totalPages === 0 ? "#D1D5DB" : "#6B7280",
                transition: "all 0.2s",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
