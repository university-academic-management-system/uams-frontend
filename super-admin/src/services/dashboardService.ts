import apiClient from './api';

export interface DashboardSummaryResponse {
  universities: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    deleted: number;
  };
  users: {
    total: number;
    byRole: {
      SUPER_ADMIN: number;
      TENANT_ADMIN: number;
    };
  };
  transactions: {
    total: number;
  };
  systemStatus: {
    database: string;
    api: string;
    timestamp: string;
  };
}

// Mapped stats for the dashboard cards
export interface DashboardStats {
  totalUniversities: number;
  totalTransactions: number;
  totalUsers: number;
}

// Transaction growth response
export interface TransactionGrowthResponse {
  range: {
    start: string;
    end: string;
    days: number;
  };
  totals: {
    count: number;
    amount: number;
  };
  points: TransactionGrowthPoint[];
}

export interface TransactionGrowthPoint {
  date: string;
  count: number;
  amount: number;
}

// User growth response
export interface UserGrowthResponse {
  range: {
    start: string;
    end: string;
  };
  points: UserGrowthPoint[];
}

export interface UserGrowthPoint {
  date: string;
  registrations: number;
}

// Chart data format for transaction display
export interface TransactionChartData {
  date: string;
  amount: number;
  count: number;
}

// Chart data format for user growth display
export interface UserGrowthData {
  date: string;
  registrations: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardSummaryResponse>('/super-admin/dashboard/summary');
    const data = response.data;
    
    // Map API response to dashboard stats
    return {
      totalUniversities: data.universities?.total ?? 0,
      totalTransactions: data.transactions?.total ?? 0,
      totalUsers: data.users?.total ?? 0,
    };
  },

  getTransactionGrowth: async (days: number = 30): Promise<TransactionChartData[]> => {
    const response = await apiClient.get<TransactionGrowthResponse>(`/super-admin/dashboard/transaction-growth?days=${days}`);
    const data = response.data;
    
    // Map points to chart data format
    return (data.points || []).map(point => ({
      date: point.date,
      amount: point.amount,
      count: point.count,
    }));
  },

  getUserGrowth: async (days: number = 30): Promise<UserGrowthData[]> => {
    const response = await apiClient.get<UserGrowthResponse>(`/super-admin/dashboard/user-growth?days=${days}`);
    const data = response.data;
    
    // Map points to chart data format
    return (data.points || []).map(point => ({
      date: point.date,
      registrations: point.registrations,
    }));
  },
};
