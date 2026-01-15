import React, { useState, useEffect } from "react";
import { Users, CreditCard, UserCheck } from "lucide-react";
import { StatCard } from "./StatCard";
import api from "../api/axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  Student: any;
  Lecturer: any;
  DepartmentAdmin: any;
  FacultyAdmin: any;
  UniversityAdmin: any;
}

interface UsersResponse {
  message: string;
  count: number;
  users: User[];
}

const StatsContainer: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    academicStaff: 0,
    isLoading: true,
    error: null as string | null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get<UsersResponse>(
        "/university-admin/users"
      );
      const users = response.data.users;

      // Calculate statistics
      const studentCount = users.filter(
        (user) => user.role === "STUDENT"
      ).length;

      // Academic staff includes: LECTURER, FACULTY_ADMIN, DEPARTMENT_ADMIN, UNIVERSITYADMIN
      const academicStaffCount = users.filter(
        (user) =>
          user.role === "LECTURER" ||
          user.role === "FACULTY_ADMIN" ||
          user.role === "DEPARTMENT_ADMIN" ||
          user.role === "UNIVERSITYADMIN"
      ).length;

      // For now, using mock revenue - you can replace this with actual API call
      const revenuePerStudent = 76000; // Example: ₦76,000 per student
      const totalRevenue = studentCount * revenuePerStudent;

      setStats({
        totalStudents: studentCount,
        totalRevenue,
        academicStaff: academicStaffCount,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || "Failed to load statistics",
      }));
    }
  };

  // Format currency with Nigerian Naira symbol
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (stats.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">{stats.error}</p>
        <button
          onClick={fetchUsers}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="Total Students"
        value={stats.totalStudents.toLocaleString()}
        icon={<Users size={24} />}
        bgColor="bg-orange-50"
        description={`${stats.totalStudents} registered students`}
      />
      <StatCard
        label="Total Revenue (Dept)"
        value={formatCurrency(stats.totalRevenue)}
        icon={<CreditCard size={24} />}
        bgColor="bg-emerald-50"
        description="Estimated annual revenue"
      />
      <StatCard
        label="Academic Staff"
        value={stats.academicStaff.toString()}
        icon={<UserCheck size={24} />}
        bgColor="bg-sky-50"
        description={`${stats.academicStaff} academic personnel`}
      />
    </div>
  );
};

export default StatsContainer;
