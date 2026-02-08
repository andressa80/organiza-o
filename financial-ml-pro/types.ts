
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
}

export interface FinancialInsight {
  summary: string;
  tips: string[];
  prediction: string;
  status: 'good' | 'warning' | 'critical';
}

export enum StorageKeys {
  AUTH = 'fin_v3_auth',
  DATA = 'fin_v3_data',
  CATEGORIES = 'fin_v3_cats'
}
