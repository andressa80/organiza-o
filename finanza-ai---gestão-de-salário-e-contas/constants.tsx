
import React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Wallet, 
  BrainCircuit,
  History
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Meu Orçamento', icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: 'Lista de Gastos', icon: <History size={20} /> },
  { id: 'ai-forecast', label: 'Previsões IA', icon: <BrainCircuit size={20} /> },
];

export const CATEGORIES = [
  'Salário', 
  'Aluguel/Condomínio', 
  'Água/Luz/Gás', 
  'Internet/TV', 
  'Mercado', 
  'Transporte', 
  'Saúde', 
  'Lazer', 
  'Outros'
];

export const MOCK_TRANSACTIONS = [
  { id: '1', description: 'Salário Base', amount: 4500, date: '2024-05-01', category: 'Salário', type: 'income' },
  { id: '2', description: 'Aluguel Mensal', amount: 1200, date: '2024-05-05', category: 'Aluguel/Condomínio', type: 'expense' },
  { id: '3', description: 'Conta de Luz (Enel)', amount: 180, date: '2024-05-07', category: 'Água/Luz/Gás', type: 'expense' },
  { id: '4', description: 'Conta de Água', amount: 65, date: '2024-05-08', category: 'Água/Luz/Gás', type: 'expense' },
  { id: '5', description: 'Internet Fibra', amount: 110, date: '2024-05-10', category: 'Internet/TV', type: 'expense' },
  { id: '6', description: 'Compras do Mês', amount: 950, date: '2024-05-12', category: 'Mercado', type: 'expense' },
  { id: '7', description: 'Combustível', amount: 300, date: '2024-05-15', category: 'Transporte', type: 'expense' },
  { id: '8', description: 'Freelance Design', amount: 800, date: '2024-05-20', category: 'Outros', type: 'income' },
] as const;
