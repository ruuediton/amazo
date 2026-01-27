
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  time: string;
  dateLabel: string;
  monthIndex: number;
  type: 'incoming' | 'outgoing' | 'info' | 'warning';
  category: 'Depósito' | 'Retirada' | 'Segurança' | 'Bônus' | 'Compras' | 'Misto';
  status?: string;
  year: number;
}

interface Props {
  onNavigate: (page: any) => void;
}

const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const HistoricoConta: React.FC<Props> = ({ onNavigate }) => {
  const [userProfile, setUserProfile] = useState<{ code: string, phone: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar perfil para o Código e Telefone
      const { data: profile } = await supabase
        .from('profiles')
        .select('code, phone')
        .eq('id', user.id)
        .single();

      setUserProfile({
        code: profile?.code || "N/A",
        phone: profile?.phone || user.phone || user.user_metadata?.phone || "N/A"
      });

      // Fetch parallel data for speed
      const [depositsRes, depositsUsdtRes, withdrawalsRes, purchasesRes, bonusRes, p2pRes] = await Promise.all([
        supabase.from('depositos_clientes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('depositos_usdt').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('retirada_clientes').select('*').eq('user_id', user.id).order('data_de_criacao', { ascending: false }),
        supabase.from('historico_compras').select('*').eq('user_id', user.id).order('data_compra', { ascending: false }),
        supabase.from('bonus_transacoes').select('*').eq('user_id', user.id).order('data_recebimento', { ascending: false }),
        supabase.from('transacoes_p2p').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false })
      ]);

      const combined: Transaction[] = [];

      // 1. Bank Deposits
      depositsRes.data?.forEach(d => {
        const date = new Date(d.created_at);
        combined.push({
          id: `dep-${d.id}`,
          title: 'Depósito Bancário',
          subtitle: `${d.nome_do_banco || 'Transferência'} - ${d.estado_de_pagamento || 'Pendente'}`,
          amount: Number(d.valor_deposito || 0),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'incoming',
          category: 'Depósito',
          status: d.estado_de_pagamento
        });
      });

      // 2. USDT Deposits
      depositsUsdtRes.data?.forEach(d => {
        const date = new Date(d.created_at);
        combined.push({
          id: `usdt-${d.id}`,
          title: 'Depósito USDT',
          subtitle: `Cripto - ${d.status || 'Pendente'}`,
          amount: Number(d.amount_kz || 0),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'incoming',
          category: 'Depósito',
          status: d.status
        });
      });

      // 3. Withdrawals
      withdrawalsRes.data?.forEach(w => {
        const date = w.data_de_criacao ? new Date(w.data_de_criacao) : new Date();
        combined.push({
          id: `wit-${w.id}`,
          title: 'Levantamento de Fundos',
          subtitle: `${w.nome_do_banco || 'Banco'} - ${w.estado_da_retirada || 'Pendente'}`,
          amount: -Number(w.valor_solicitado),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'outgoing',
          category: 'Retirada',
          status: w.estado_da_retirada
        });
      });

      // 4. Purchases
      purchasesRes.data?.forEach(p => {
        const date = new Date(p.data_compra);
        combined.push({
          id: `pur-${p.id}`,
          title: p.nome_produto || 'Compra de Pacote',
          subtitle: `Investimento BP`,
          amount: -Number(p.preco || 0),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'outgoing',
          category: 'Compras'
        });
      });

      // 5. Bonuses
      bonusRes.data?.forEach(b => {
        const date = new Date(b.data_recebimento);
        combined.push({
          id: `bon-${b.id}`,
          title: 'Bônus Recebido',
          subtitle: b.origem_bonus || 'Promoção/Evento',
          amount: Number(b.valor_recebido || 0),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: 'incoming',
          category: 'Bônus'
        });
      });

      // 6. P2P Transfers
      p2pRes.data?.forEach(t => {
        const date = new Date(t.created_at);
        const isSender = t.sender_id === user.id;
        combined.push({
          id: `p2p-${t.id}`,
          title: isSender ? 'Transferência Enviada' : 'Transferência Recebida',
          subtitle: isSender ? `Para outro usuário` : `De outro usuário`,
          amount: isSender ? -Number(t.amount) : Number(t.amount),
          time: date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
          dateLabel: `${date.getDate()} de ${months[date.getMonth()]}`,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          type: isSender ? 'outgoing' : 'incoming',
          category: 'Misto'
        });
      });

      setTransactions(combined.sort((a, b) => {
        // Sort by year, then monthIndex, then day from dateLabel
        if (b.year !== a.year) return b.year - a.year;
        if (b.monthIndex !== a.monthIndex) return b.monthIndex - a.monthIndex;
        const dayA = parseInt(a.dateLabel.split(' ')[0]);
        const dayB = parseInt(b.dateLabel.split(' ')[0]);
        return dayB - dayA;
      }));
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  };


  const groupedTransactions = transactions.reduce((groups: any, transaction) => {
    const date = transaction.dateLabel;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});


  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 justify-between bg-background-dark sticky top-0 z-40 border-b border-gray-200 bg-opacity-90">
        <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-primary">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 tracking-tight">Histórico de Conta</h2>
      </header>

      {/* User Identifier Tag */}
      {userProfile && (
        <div className="bg-surface-dark/40 px-6 py-2 flex items-center justify-between border-b border-gray-200/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[16px]">person</span>
            <span className="text-[11px] font-bold text-black opacity-80 uppercase tracking-wider">ID: {userProfile.code}</span>
          </div>
          <span className="text-[10px] font-medium text-[text-gray-400]">{userProfile.phone}</span>
        </div>
      )}


      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 touch-pan-y">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <SpokeSpinner size="w-8 h-8" />
          </div>
        ) : Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(date => (
            <div key={date} className="mb-6">
              <p className="text-[text-gray-400] text-[11px] font-black uppercase tracking-[0.2em] pb-3 pt-6 px-6 opacity-60 flex items-center gap-2">
                <span className="size-1 bg-primary rounded-full"></span>
                {date}
              </p>
              <div className="flex flex-col gap-1 px-3">
                {groupedTransactions[date].map((t: Transaction) => (
                  <div key={t.id} className="group flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors rounded-[24px] border border-transparent hover:border-gray-200">
                    <div className={`relative flex items-center justify-center size-12 rounded-2xl shrink-0 border border-gray-200 ${t.category === 'Depósito' ? 'bg-green-500/10 text-green-600' :
                      t.category === 'Retirada' ? 'bg-[#00C853]/10 text-[#00C853]' :
                        t.category === 'Segurança' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-white/5 text-gray-600'
                      }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {t.category === 'Depósito' ? 'add_card' :
                          t.category === 'Retirada' ? 'payments' :
                            t.category === 'Segurança' ? 'security' :
                              'shopping_bag'}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-black text-[15px] font-bold truncate leading-tight">{t.title}</p>
                        {t.amount !== 0 && (
                          <p className={`text-[15px] font-black ${t.type === 'incoming' ? 'text-green-600' : 'text-black'}`}>
                            {t.amount > 0 ? '+' : ''} Kz {Math.abs(t.amount).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[text-gray-400] text-[11px] uppercase font-bold tracking-wider opacity-70 truncate">{t.subtitle}</p>
                        <p className="text-[text-gray-400] text-[11px] font-medium">{t.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-10 text-center opacity-30">
            <div className="size-20 bg-surface-dark rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">folder_off</span>
            </div>
            <p className="font-black uppercase tracking-[0.2em] text-[12px] leading-relaxed">
              Nenhum registro encontrado
            </p>
          </div>
        )}
      </main>

    </div>
  );
};

export default HistoricoConta;

