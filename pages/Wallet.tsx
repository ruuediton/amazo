
import React from 'react';
import { Transaction } from '../types';

const transactions: Transaction[] = [
  { id: '1', title: 'Sony Headphones', subtitle: 'Amazon Marketplace', amount: -33500, date: 'Hoje, 14:30', type: 'outgoing', icon: 'shopping_bag' },
  { id: '2', title: 'Transferência Recebida', subtitle: 'De: João Silva', amount: 5000, date: 'Hoje, 10:15', type: 'incoming', icon: 'arrow_downward' },
  { id: '3', title: 'Amazon Prime Video', subtitle: 'Assinatura Mensal', amount: -2490, date: 'Ontem, 09:00', type: 'outgoing', icon: 'smart_display' },
  { id: '4', title: 'Pagamento de Fatura', subtitle: 'Cartão Amazon Prime', amount: -80000, date: 'Ontem', type: 'outgoing', icon: 'receipt_long' },
];

interface WalletProps {
  onNavigate: (page: any) => void;
}

const Wallet: React.FC<WalletProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col pb-24">
      <header className="flex items-center p-4 justify-between sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md">
        <button
          onClick={() => onNavigate('home')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Histórico de Conta</h2>
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4">
        <div className="mb-6">
          <div className="flex flex-col gap-4 rounded-xl bg-surface-dark p-5 shadow-lg border border-gray-200 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex flex-col z-10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-400 text-sm font-medium">Saldo Amazon Pay</p>
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
              <p className="text-black text-3xl font-bold tracking-tight mb-4">Kz 142.250,00</p>
              <div className="flex gap-4 border-t border-white/10 pt-4">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-1">Entradas (Mês)</p>
                  <p className="text-green-600 text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    Kz 33.450
                  </p>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-1">Saídas (Mês)</p>
                  <p className="text-black text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    Kz 22.200
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3">
          <button
            onClick={() => onNavigate('p2p-transfer')}
            className="flex items-center gap-4 bg-primary/10 border border-primary/20 p-4 rounded-xl active:scale-95 transition-all shadow-sm group"
          >
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">send</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-black font-black text-sm uppercase">Enviar Dinheiro</p>
              <p className="text-gray-500 text-xs">Transferência instantânea entre contas</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6">
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-5 shadow-md shadow-primary/20">
            <span className="text-black text-sm font-bold">Todos</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark border border-white/10 px-5 transition-colors hover:bg-white/5">
            <span className="text-black text-sm font-medium">Entradas</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-surface-dark border border-white/10 px-5 transition-colors hover:bg-white/5">
            <span className="text-black text-sm font-medium">Saídas</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider pb-3 px-1">Hoje</p>
          {transactions.slice(0, 2).map(t => (
            <div key={t.id} className="group flex items-center gap-4 py-4 border-b border-gray-200 hover:bg-white/5 transition-colors cursor-pointer rounded-lg px-2">
              <div className="relative flex items-center justify-center size-12 rounded-full bg-surface-dark border border-white/10 shrink-0">
                <span className={`material-symbols-outlined ${t.type === 'incoming' ? 'text-green-600' : 'text-primary'}`}>{t.icon}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-black text-base font-bold truncate">{t.title}</p>
                  <p className={`text-base font-bold whitespace-nowrap ${t.type === 'incoming' ? 'text-green-600' : 'text-black'}`}>
                    {t.amount > 0 ? '+' : '-'} Kz {Math.abs(t.amount).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-gray-400 text-sm truncate">{t.subtitle}</p>
                  <p className="text-gray-400 text-xs">{t.date.split(', ')[1] || t.date}</p>
                </div>
              </div>
            </div>
          ))}

          <p className="text-[text-gray-400] text-xs font-bold uppercase tracking-wider pb-3 pt-6 px-1">Ontem</p>
          {transactions.slice(2).map(t => (
            <div key={t.id} className="group flex items-center gap-4 py-4 border-b border-gray-200 hover:bg-white/5 transition-colors cursor-pointer rounded-lg px-2">
              <div className="relative flex items-center justify-center size-12 rounded-full bg-surface-dark border border-white/10 shrink-0">
                <span className={`material-symbols-outlined ${t.type === 'incoming' ? 'text-green-600' : 'text-primary'}`}>{t.icon}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-black text-base font-bold truncate">{t.title}</p>
                  <p className={`text-base font-bold whitespace-nowrap ${t.type === 'incoming' ? 'text-green-600' : 'text-black'}`}>
                    {t.amount > 0 ? '+' : '-'} Kz {Math.abs(t.amount).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-gray-400 text-sm truncate">{t.subtitle}</p>
                  <p className="text-gray-400 text-xs">{t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Wallet;
