import apiClient from './api';

export interface Payment {
  id: string;
  transaction_id: string;
  student_name: string;
  university_name: string;
  payment_for: string;
  amount: string;
  payment_method: string;
  card_last_four: string | null;
  payment_date: string;
  status: 'succeeded' | 'pending' | 'declined';
}

export interface PaymentsResponse {
  totalRevenue: number;
  count: number;
  payments: Payment[];
}

export const paymentService = {
  getAll: async (): Promise<PaymentsResponse> => {
    const response = await apiClient.get<PaymentsResponse>('/super-admin/payments');
    return response.data;
  },
};
