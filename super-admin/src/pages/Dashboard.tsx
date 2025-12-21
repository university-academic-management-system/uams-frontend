import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { dashboardService, DashboardStats, TransactionChartData, UserGrowthData } from "../services/dashboardService";

const StatCard: React.FC<{
  title: string;
  value: number;
  displayValue?: string; // Optional formatted display value
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  isMobile?: boolean;
  loading?: boolean;
}> = ({ title, value, displayValue, icon, bgColor, isMobile, loading }) => (
  <div
    style={{
      padding: isMobile ? "16px" : "24px",
      borderRadius: "12px",
      backgroundColor: bgColor,
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "12px" : "16px",
    }}
  >
    <div
      style={{
        padding: isMobile ? "8px" : "12px",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        backdropFilter: "blur(4px)",
        color: "#1f2937",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          fontSize: isMobile ? "12px" : "14px",
          fontWeight: 500,
          color: "#4b5563",
          marginBottom: "4px",
          margin: 0,
        }}
      >
        {title}
      </p>
      <h3
        style={{
          fontSize: isMobile ? "24px" : "30px",
          fontWeight: 700,
          color: "#111827",
          margin: 0,
        }}
      >
        {loading ? "..." : (displayValue ?? value)}
      </h3>
    </div>
  </div>
);

// Transaction chart component
const TransactionChart: React.FC<{
  data: TransactionChartData[];
  isMobile: boolean;
  chartHeight: number;
}> = ({ data, isMobile, chartHeight }) => {
  // Only render chart if we have valid array data with items
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: chartHeight, color: "#9ca3af" }}>
        No transaction data available
      </div>
    );
  }

  // Format date for display (e.g., "Dec 21")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format amount for tooltip
  const formatAmount = (value: number) => `₦${value.toLocaleString()}`;

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? -20 : 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6B7280",
            }}
            tickFormatter={formatDate}
            dy={10}
            interval={isMobile ? 6 : 4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6B7280",
            }}
            width={isMobile ? 50 : 70}
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
            formatter={(value: number) => [formatAmount(value), "Amount"]}
            labelFormatter={formatDate}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#4ADE80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: isMobile ? 3 : 4, fill: "#22C55E" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// User growth chart component
const UserGrowthChart: React.FC<{
  data: UserGrowthData[];
  isMobile: boolean;
  chartHeight: number;
}> = ({ data, isMobile, chartHeight }) => {
  // Only render chart if we have valid array data with items
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: chartHeight, color: "#9ca3af" }}>
        No user growth data available
      </div>
    );
  }

  // Format date for display (e.g., "Dec 21")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? -20 : 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6B7280",
            }}
            tickFormatter={formatDate}
            dy={10}
            interval={isMobile ? 6 : 4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: isMobile ? 10 : 12,
              fill: "#6B7280",
            }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
            formatter={(value: number) => [value, "Registrations"]}
            labelFormatter={formatDate}
          />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: isMobile ? 3 : 4, fill: "#2563EB" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionChartData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [userGrowthLoading, setUserGrowthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionDays, setTransactionDays] = useState(30);
  const [userGrowthDays, setUserGrowthDays] = useState(30);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial load - fetch stats and initial chart data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats - required
        const statsData = await dashboardService.getStats();
        setStats(statsData);
        
        // Fetch initial chart data
        try {
          const txData = await dashboardService.getTransactionGrowth(transactionDays);
          setTransactionData(Array.isArray(txData) ? txData : []);
        } catch (chartErr) {
          console.warn("Transaction growth data not available:", chartErr);
          setTransactionData([]);
        }
        
        try {
          const userData = await dashboardService.getUserGrowth(userGrowthDays);
          setUserGrowthData(Array.isArray(userData) ? userData : []);
        } catch (chartErr) {
          console.warn("User growth data not available:", chartErr);
          setUserGrowthData([]);
        }
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error("Error fetching dashboard data:", err);
        setTransactionData([]);
        setUserGrowthData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch transaction data when days change
  useEffect(() => {
    if (loading) return; // Skip during initial load
    
    const fetchTransactionData = async () => {
      setTransactionLoading(true);
      try {
        const txData = await dashboardService.getTransactionGrowth(transactionDays);
        setTransactionData(Array.isArray(txData) ? txData : []);
      } catch (err) {
        console.warn("Transaction growth data not available:", err);
        setTransactionData([]);
      } finally {
        setTransactionLoading(false);
      }
    };

    fetchTransactionData();
  }, [transactionDays, loading]);

  // Refetch user growth data when days change
  useEffect(() => {
    if (loading) return; // Skip during initial load
    
    const fetchUserGrowthData = async () => {
      setUserGrowthLoading(true);
      try {
        const userData = await dashboardService.getUserGrowth(userGrowthDays);
        setUserGrowthData(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.warn("User growth data not available:", err);
        setUserGrowthData([]);
      } finally {
        setUserGrowthLoading(false);
      }
    };

    fetchUserGrowthData();
  }, [userGrowthDays, loading]);

  const padding = isMobile ? "16px" : "32px";
  const chartHeight = isMobile ? 200 : 256;

  if (error) {
    return (
      <div
        style={{
          padding: padding,
          backgroundColor: "#f9fafb",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
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
    );
  }

  return (
    <div
      style={{
        padding: padding,
        backgroundColor: "#f9fafb",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "16px" : "32px",
        }}
      >
        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
            gap: isMobile ? "12px" : "24px",
            width: "100%",
          }}
        >
          <StatCard
            title="Total Number of Universities"
            value={stats?.totalUniversities ?? 0}
            loading={loading}
            icon={
              <img
                src="/assets/university.png"
                alt="University"
                style={{
                  width: isMobile ? "24px" : "28px",
                  height: isMobile ? "24px" : "28px",
                  objectFit: "contain",
                }}
              />
            }
            bgColor="#fed7aa"
            iconColor="#ea580c"
            isMobile={isMobile}
          />
          <StatCard
            title="Total Transactions"
            value={stats?.totalTransactions ?? 0}
            displayValue={`₦${(stats?.totalTransactions ?? 0).toLocaleString()}`}
            loading={loading}
            icon={
              <img
                src="/assets/payment.png"
                alt="Payment"
                style={{
                  width: isMobile ? "24px" : "28px",
                  height: isMobile ? "24px" : "28px",
                  objectFit: "contain",
                }}
              />
            }
            bgColor="#dcfce7"
            iconColor="#16a34a"
            isMobile={isMobile}
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            loading={loading}
            icon={
              <img
                src="/assets/users.jpg"
                alt="Users"
                style={{
                  width: isMobile ? "24px" : "28px",
                  height: isMobile ? "24px" : "28px",
                  objectFit: "contain",
                }}
              />
            }
            bgColor="#fee2e2"
            iconColor="#dc2626"
            isMobile={isMobile}
          />
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "16px" : "24px",
            width: "100%",
          }}
        >
          {/* Chart 1 */}
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f3f4f6",
              padding: isMobile ? "16px" : "24px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isMobile ? "16px" : "24px",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Transaction Growth
              </h3>
              <select
                value={transactionDays}
                onChange={(e) => setTransactionDays(Number(e.target.value))}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            {loading || transactionLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: chartHeight, color: "#6b7280" }}>
                Loading chart data...
              </div>
            ) : (
              <TransactionChart data={transactionData} isMobile={isMobile} chartHeight={chartHeight} />
            )}
          </div>

          {/* Chart 2 */}
          <div
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f3f4f6",
              padding: isMobile ? "16px" : "24px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: isMobile ? "16px" : "24px",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                User Growth
              </h3>
              <select
                value={userGrowthDays}
                onChange={(e) => setUserGrowthDays(Number(e.target.value))}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            {loading || userGrowthLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: chartHeight, color: "#6b7280" }}>
                Loading chart data...
              </div>
            ) : (
              <UserGrowthChart data={userGrowthData} isMobile={isMobile} chartHeight={chartHeight} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
