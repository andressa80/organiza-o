
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, Wallet } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 flex flex-col shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-emerald-600 p-2 rounded-lg text-white">
          <Wallet size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Finanza AI</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span>Sair da conta</span>
        </button>
      </div>
    </div>
  );
};
