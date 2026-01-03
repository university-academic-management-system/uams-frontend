import React, { useState } from "react";
import { TrendingUp, CreditCard, Users, UserCheck } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Announcement, ChartDataItem, AuthData } from "../components/types";
import { AnnouncementList } from "../components/AnnouncementList";
import { StatCard } from "../components/StatCard";
import StatsContainer from "../components/StatsContainer";
import { useAuth } from "../context/AuthProvider";

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Session Setup Complete",
    description:
      "Academic session 2024/2025 has been successfully initialized for the department.",
    date: "2025-01-02",
  },
  {
    id: "2",
    title: "New Course Prerequisites",
    description:
      "Updated prerequisites for CSC 301. Please review the course catalog.",
    date: "2025-01-05",
  },
];

const REVENUE_DATA: ChartDataItem[] = [
  { year: "2024", value: 50 },
  { year: "2025", value: 25 },
  { year: "2026", value: 75 },
  { year: "2027", value: 85 },
  { year: "2028", value: 30 },
  { year: "2029", value: 70 },
];

const GROWTH_DATA: ChartDataItem[] = [
  { year: "2024", value: 500 },
  { year: "2025", value: 250 },
  { year: "2026", value: 750 },
  { year: "2027", value: 850 },
  { year: "2028", value: 300 },
  { year: "2029", value: 700 },
];

const Dashboard: React.FC = () => {
  const { authData } = useAuth();
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  if (!authData) return null;

  // Get user display name
  const currentUser = authData.email 
    ? authData.email.split("@")[0] 
    : authData.role === "UNIVERSITYADMIN" ? "Admin" : "User";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* User info banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back, {currentUser}!
            </h2>
            <p className="text-slate-500 mt-1">
              Logged in as{" "}
              <span className="font-semibold text-[#1d76d2]">
                {authData.role}
              </span>
              {authData.universityId && (
                <span className="ml-3">
                  University ID:{" "}
                  <span className="font-mono text-sm">
                    {authData.universityId.substring(0, 8)}...
                  </span>
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100">
              Tenant: {authData.tenantId.substring(0, 8)}...
            </div>
          </div>
        </div>
      </div>

      <StatsContainer />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-500" />{" "}
                Department Performance
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fee collection vs Projections
              </p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#22c55e",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-1">
          <AnnouncementList announcements={announcements} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-slate-800">
              Enrollment Growth
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Student registration trends
            </p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GROWTH_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
