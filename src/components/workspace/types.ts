export type Category = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type Priority = 'high' | 'medium' | 'low' | 'urgent';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  dueDate?: string;
  dueTime?: string;
  status: 'pending' | 'completed';
  completed: boolean;
  streak?: number;
  lastCompletedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreakData {
  count: number;
  lastDate: string;
}

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'daily',   label: 'Daily'   },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly',  label: 'Yearly'  },
];

export const PRIORITY_CFG: Record<Priority, { color: string; bg: string; border: string; label: string }> = {
  high:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   label: 'High'   },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  label: 'Medium' },
  low:    { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   label: 'Low'    },
  urgent: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)',  label: 'Urgent' },
};
