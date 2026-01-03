import React, { useState, useEffect } from "react";
import { subscriptionService } from "../services/subscriptionService";
import { Subscription } from "../../types";

const SubscriptionPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await subscriptionService.getAll();
        setSubscriptions(data);
      } catch (err) {
        setError("Failed to fetch subscriptions. Please try again.");
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: isMobile ? "16px" : "32px" }}>
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
    <div style={{ padding: isMobile ? "16px" : "32px" }}>
      {/* Summary */}
      <div style={{ marginBottom: isMobile ? "16px" : "32px" }}>
        <h2
          style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "8px",
            margin: 0,
          }}
        >
          Your Subscription
        </h2>
        <div
          style={{
            display: "flex",
            gap: isMobile ? "16px" : "32px",
            fontSize: isMobile ? "12px" : "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#6b7280" }}>Monthly</span>
            <span style={{ fontWeight: 600, color: "#2563eb" }}>$234.4</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "#6b7280" }}>Yearly</span>
            <span style={{ fontWeight: 600, color: "#2563eb" }}>$2343</span>
          </div>
        </div>
      </div>

      {/* Sections based on subscription status */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "16px" : "32px",
        }}
      >
        {subscriptions.length === 0 ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              color: "#9ca3af",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
            }}
          >
            No subscriptions found.
          </div>
        ) : (
          ["Recent Ended", "Ending soon", "Active"].map((sectionTitle) => {
            // Filter subscriptions based on section title mapping logic
            const statusFilter =
              sectionTitle === "Recent Ended"
                ? "Inactive"
                : sectionTitle === "Ending soon"
                ? "Ending Soon"
                : "Active";

            const items = subscriptions.filter((s) => s.status === statusFilter);

            if (items.length === 0) return null;

            return (
              <div key={sectionTitle}>
                <h3
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: "#6b7280",
                    marginBottom: isMobile ? "12px" : "16px",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {sectionTitle}
                </h3>

                {/* Mobile Card View */}
                {isMobile ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {items.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          backgroundColor: "white",
                          borderRadius: "12px",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #f3f4f6",
                          padding: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "12px",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1f2937",
                                margin: 0,
                                marginBottom: "4px",
                              }}
                            >
                              {sub.universityName}
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                margin: 0,
                              }}
                            >
                              ${sub.planPrice}
                            </p>
                          </div>
                          <button
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "#d1d5db",
                              cursor: "pointer",
                              padding: "4px",
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
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "12px",
                            paddingBottom: "12px",
                            borderBottom: "1px solid #f3f4f6",
                          }}
                        >
                          <div>
                            {sub.status === "Inactive" ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  color: "#ef4444",
                                  fontSize: "11px",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                <span>Inactive</span>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  color: "#16a34a",
                                  fontSize: "11px",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                  <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span>Active</span>
                              </div>
                            )}
                          </div>
                          <div>
                            {sub.status === "Inactive" ? (
                              <span
                                style={{
                                  color: "#111827",
                                  fontWeight: 500,
                                  fontSize: "11px",
                                }}
                              >
                                Not valid
                              </span>
                            ) : (
                              <div
                                style={{
                                  textAlign: "right",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#9ca3af",
                                    fontSize: "9px",
                                  }}
                                >
                                  {sub.daysRemaining} days ago
                                </div>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    color: "#4b5563",
                                    fontSize: "11px",
                                  }}
                                >
                                  {sub.dueDate}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              fontSize: "11px",
                              fontWeight: 500,
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "#1d4ed8";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "#2563eb";
                            }}
                          >
                            {sub.status === "Inactive" ? "Renew" : "Pay"}
                          </button>
                        </div>
                      </div>
                    ))}
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
                        minWidth: "600px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "rgba(249, 250, 251, 0.5)",
                          }}
                        >
                          <th
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "24px",
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              width: "33%",
                              color: "#9ca3af",
                              fontSize: "12px",
                              fontWeight: 500,
                              textAlign: "left",
                              textTransform: "none",
                            }}
                          >
                            Plan
                          </th>
                          <th
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "24px",
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              color: "#9ca3af",
                              fontSize: "12px",
                              fontWeight: 500,
                              textAlign: "left",
                              textTransform: "none",
                            }}
                          >
                            Price
                          </th>
                          <th
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "24px",
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              color: "#9ca3af",
                              fontSize: "12px",
                              fontWeight: 500,
                              textAlign: "left",
                              textTransform: "none",
                            }}
                          >
                            Payment due
                          </th>
                          <th
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "24px",
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              color: "#9ca3af",
                              fontSize: "12px",
                              fontWeight: 500,
                              textAlign: "left",
                              textTransform: "none",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              paddingLeft: "24px",
                              paddingRight: "24px",
                              paddingTop: "16px",
                              paddingBottom: "16px",
                              color: "#9ca3af",
                              fontSize: "12px",
                              fontWeight: 500,
                              textAlign: "right",
                              textTransform: "none",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((sub) => (
                          <tr
                            key={sub.id}
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.backgroundColor =
                                "rgba(249, 250, 251, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.backgroundColor = "transparent";
                            }}
                          >
                            <td
                              style={{
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                paddingTop: "20px",
                                paddingBottom: "20px",
                                fontWeight: 500,
                                color: "#1f2937",
                              }}
                            >
                              {sub.universityName}
                            </td>
                            <td
                              style={{
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                paddingTop: "20px",
                                paddingBottom: "20px",
                                color: "#4b5563",
                              }}
                            >
                              ${sub.planPrice}
                            </td>
                            <td
                              style={{
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                paddingTop: "20px",
                                paddingBottom: "20px",
                              }}
                            >
                              <div style={{ display: "flex", gap: "8px" }}>
                                {sub.status === "Inactive" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "4px",
                                      color: "#ef4444",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <line x1="15" y1="9" x2="9" y2="15" />
                                      <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    <span>Inactive</span>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "4px",
                                      color: "#16a34a",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                      <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <span>Active</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td
                              style={{
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                paddingTop: "20px",
                                paddingBottom: "20px",
                                fontSize: "12px",
                              }}
                            >
                              {sub.status === "Inactive" ? (
                                <span
                                  style={{
                                    color: "#111827",
                                    fontWeight: 500,
                                  }}
                                >
                                  Not valid
                                </span>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#9ca3af",
                                      fontSize: "10px",
                                    }}
                                  >
                                    {sub.daysRemaining} days ago
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 500,
                                      color: "#4b5563",
                                    }}
                                  >
                                    {sub.dueDate}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td
                              style={{
                                paddingLeft: "24px",
                                paddingRight: "24px",
                                paddingTop: "20px",
                                paddingBottom: "20px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "16px",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: "#2563eb",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#1d4ed8";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#2563eb";
                                  }}
                                >
                                  {sub.status === "Inactive" ? "Renew" : "Pay"}
                                </button>
                                <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: "#d1d5db",
                                    cursor: "pointer",
                                    transition: "color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#6b7280";
                                  }}
                                  onMouseLeave={(e) => {
                                    (
                                      e.currentTarget as HTMLButtonElement
                                    ).style.color = "#d1d5db";
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
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
