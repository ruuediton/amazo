
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNetwork } from '../contexts/NetworkContext';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
  onNavigate: (page: any) => void;
  onOpenSupport?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const GiftChest: React.FC<Props> = ({ onNavigate, onOpenSupport, showToast }) => {
  const { runWithTimeout } = useNetwork();
  const { withLoading } = useLoading();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await runWithTimeout(() => supabase
        .from('bonus_transacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('data_recebimento', { ascending: false })
        .limit(10));

      if (!error && data) {
        setHistory(data);
      }
    } catch (err) {
      // Falha silenciosa
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleRedeem = async () => {
    if (!promoCode.trim()) {
      showToast?.("Por favor, digite código.", "warning");
      return;
    }

    await withLoading(async () => {
      // Validação de sessão no client first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redireciona se não houver sessão ativa
        onNavigate('login');
        throw new Error("Sessão expirada.");
      }

      // Chamada RPC simplificada e segura (User ID é pego do contexto Auth no backend)
      const { data, error } = await supabase.rpc('redeem_gift_code', {
        p_code: promoCode.trim()
      });

      if (error) {
        throw new Error("Não foi possível processar o pedido. Tente novamente");
      }

      if (!data.success) {
        // Exibe mensagem segura retornada do backend (Ex: "Código inválido" ou "Muitas tentativas")
        throw new Error(data.message || "Código inválido ou expirado.");
      }

      // Sucesso
      setLastReward(data.amount || 0);
      setIsOpen(true);
      setPromoCode('');

      // Atualiza histórico em background
      fetchHistory();

      return data.message;

    }, "Resgate sucedido!");
  };

  return (
    <div className="bg-background-dark text-black min-h-screen flex flex-col font-display antialiased">
      {/* TopAppBar */}
      <div className="flex items-center bg-background-dark px-4 py-2 justify-between sticky top-0 z-50">
        <div
          onClick={() => onNavigate('home')}
          className="text-primary flex size-10 shrink-0 items-center cursor-pointer hover:bg-white/10 rounded-full justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </div>
        <h2 className="text-black text-base font-bold leading-tight tracking-[-0.015em] flex-1 text-center">amazon</h2>
        <div className="flex w-10 items-center justify-end">
          <button onClick={() => onOpenSupport?.()} className="flex cursor-pointer items-center justify-center rounded-lg h-10 bg-transparent text-black p-0">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 max-w-lg mx-auto w-full pb-20">
        {/* Header / Label */}
        <div className="mb-2">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Parabéns!</span>
        </div>

        {/* HeadlineText */}
        <h1 className="text-black tracking-tight text-[24px] font-extrabold leading-tight px-4 text-center pb-1">
          {isOpen ? 'Presente Aberto!' : 'Tens um presente para abrir!'}
        </h1>

        {/* BodyText */}
        <p className="text-black/70 text-[13px] font-medium leading-relaxed pb-4 px-10 text-center">
          {isOpen
            ? `Acabaste de resgatar Kz ${lastReward?.toLocaleString()}.`
            : 'Introduz o teu código abaixo para resgatar agora.'
          }
        </p>

        {/* Redemption Input Area - Only show if not open */}
        {!isOpen && (
          <div className="w-full px-6 mb-4">
            <div className="flex flex-col">
              <div className="relative group">
                <input
                  className="flex w-full rounded-xl border border-gray-200 bg-gray-50 px-4 h-11 text-sm font-bold focus:border-primary focus:ring-0 focus:outline-none transition-all placeholder:text-gray-400 text-black shadow-inner"
                  placeholder="Insira o seu código aqui"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treasure Chest Visual - Redimensionado para caber o input */}
        <div className="relative w-full aspect-square max-w-[180px] mb-4 flex items-center justify-center">

          {/* Glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,209,37,0.15)_0%,_rgba(24,23,17,0)_70%)] rounded-full"></div>

          {/* Metallic Chest Container */}
          <div className={`relative w-40 h-40 bg-[#2a2820] rounded-xl border-2 transition-all duration-500 ${isOpen ? 'border-primary shadow-[0_0_80px_rgba(244,209,37,0.4)] scale-110' : 'border-[#3a3830] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]'} flex flex-col overflow-hidden`}>
            {/* Top lid detail */}
            <div className={`h-1/3 bg-[#323028] border-b-2 transition-all duration-500 ${isOpen ? 'border-primary/60 -translate-y-4' : 'border-primary/30'} flex items-center justify-center shadow-inner`}>
              <div className={`w-12 h-1.5 rounded-full transition-colors ${isOpen ? 'bg-primary' : 'bg-primary/10'}`}></div>
            </div>

            {/* Body / Lock detail */}
            <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#2d2b22] to-[#1e1c14]">
              {/* Lock Circle */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : 'bg-primary shadow-[0_0_20px_rgba(244,209,37,0.5)] animate-pulse'}`}>
                <span className="material-symbols-outlined text-[#181711] text-2xl font-black transition-all" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isOpen ? 'lock_open' : 'lock'}
                </span>
              </div>

              {/* Reward Reveal - Only if open */}
              {isOpen && (
                <div className="absolute inset-x-0 bottom-2 flex flex-col items-center animate-bounce">
                  <p className="text-primary text-sm font-black tracking-tighter shadow-sm">+ Kz {lastReward}</p>
                </div>
              )}
            </div>

            {/* Bottom detail */}
            <div className={`h-4 transition-colors ${isOpen ? 'bg-primary/20' : 'bg-black/20'}`}></div>
          </div>

          {/* Currency Badge Kz */}
          <div className="absolute bottom-2 right-2 bg-primary text-[#181711] font-black px-4 py-2 rounded-xl shadow-2xl rotate-12 flex items-center gap-1.5 border-2 border-[#181711]/10">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            <span className="text-lg">Kz</span>
          </div>
        </div>

        <div className="w-full space-y-3 px-6">
          {isOpen ? (
            <button
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center overflow-hidden rounded-xl h-11 bg-white border border-primary text-text-primary text-base font-black leading-normal tracking-wide active:scale-95 transition-all shadow-md"
            >
              <span>Resgatar Outro</span>
            </button>
          ) : (
            <button
              onClick={handleRedeem}
              disabled={loading}
              className={`flex w-full items-center justify-center overflow-hidden rounded-xl h-11 bg-primary text-[#181711] text-base font-black leading-normal tracking-wide shadow-lg active:scale-95 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="truncate">{loading ? 'Processando...' : 'Abrir Presente Agora'}</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="w-full text-center text-black/40 text-[11px] font-bold py-1 tracking-widest uppercase hover:text-black transition-colors"
          >
            Guardar para mais tarde
          </button>
        </div>

        {/* Redeemed Gifts History */}
        <div className="w-full mt-10 px-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-black text-lg font-bold">Presentes Resgatados</h3>
            <span className="text-primary text-sm font-bold cursor-pointer">Ver todos</span>
          </div>

          <div className="flex flex-col gap-3">
            {fetchingHistory ? (
              <div className="flex justify-center p-8">
                <SpokeSpinner size="w-8 h-8" />
              </div>
            ) : history.length > 0 ? (
              history.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 bg-white/50 border rounded-2xl shadow-sm transition-all ${index === 0 && isOpen ? 'border-primary ring-2 ring-primary/20 bg-primary/5 scale-[1.02]' : 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${item.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <span className="material-symbols-outlined icon-filled">
                        {item.status === 'success' ? 'check_circle' : 'error'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-black font-bold text-sm">
                          {item.status === 'success' ? 'Resgate Concluído' : 'Falha no Resgate'}
                        </p>
                        {index === 0 && isOpen && (
                          <span className="bg-primary text-[#181711] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Recente</span>
                        )}
                      </div>
                      <p className="text-black/50 text-xs text-left">
                        {new Date(item.data_recebimento).toLocaleTimeString()} • {(() => {
                          const code = item.codigo_presente || '';
                          if (code.length <= 4) return code;
                          return code.slice(0, 2) + "**" + code.slice(-2);
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black block ${item.status === 'success' ? 'text-green-600' : 'text-red-400'}`}>
                      {item.status === 'success' ? `+ Kz ${item.valor_recebido || 0}` : 'Inválido'}
                    </span>
                    <span className="text-[10px] text-black/40 font-bold uppercase">{new Date(item.data_recebimento).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 text-sm font-medium">Nenhum presente resgatado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <div className="h-2 bg-primary/5 w-full mt-auto"></div>
    </div>
  );
};

export default GiftChest;
