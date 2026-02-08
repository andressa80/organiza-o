
export type Category = 
  | 'Salário' 
  | 'Aluguel/Condomínio' 
  | 'Água/Luz/Gás' 
  | 'Internet/TV' 
  | 'Mercado' 
  | 'Transporte' 
  | 'Saúde' 
  | 'Lazer' 
  | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
  type: 'income' | 'expense';
}

export interface MonthlyData {
  month: string;
  spent: number;
  income: number;
}

export interface AIInsight {
  month: string;
  predictedExpense: number;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ForecastResponse {
  forecast: AIInsight[];
  generalAdvice: string;
}
