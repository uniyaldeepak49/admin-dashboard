export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface DashboardStats {
  totalUsers: number;
  revenue: number;
}
