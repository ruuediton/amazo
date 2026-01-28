
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const DetalhesConta: React.FC<Props> = ({ onNavigate, showToast }) => {
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        onNavigate('login');
        return;
      }

      // Buscar os detalhes descriptografando no banco via RPC
      const { data, error } = await supabase.rpc('get_my_bank_accounts');

      if (error) {
        console.error('Erro ao buscar dados bancários:', error);
        // Se der erro, pode ser que não exista conta ainda
      } else if (data && data.length > 0) {
        setBankInfo(data[0]);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  const maskIban = (val: string) => {
    if (!val) return '';
    const clean = val.replace(/\s/g, '');
    if (clean.length < 13) return val;
    return `${clean.substring(0, 8)}*****${clean.substring(clean.length - 9)}`;
  };

  const getBankStyle = (name: string) => {
    if (!name) return 'from-[#2d2a1e] via-[#3d3a2e] to-[#1d1a0e]';
    const n = name.toUpperCase();

    // BAI -> Azul Escuro
    if (n.includes('BAI')) return 'from-[#002e5d] via-[#003d7c] to-[#001c3d]';

    // BFA -> Amarelo Dourado
    if (n.includes('BFA')) return 'from-[#cca300] via-[#e6b800] to-[#997a00]';

    // BIC -> Vermelho
    if (n.includes('BIC')) return 'from-[#d00000] via-[#ff0000] to-[#9a0000]';

    // ATLÂNTICO -> Azul Claro
    if (n.includes('ATLÂNTICO') || n.includes('ATL')) return 'from-[#0070c0] via-[#008ae6] to-[#005691]';

    // SOL -> Verde
    if (n.includes('SOL')) return 'from-[#15803d] via-[#16a34a] to-[#14532d]';

    // BNI -> Roxo
    if (n.includes('BNI')) return 'from-[#4b0082] via-[#6a0dad] to-[#310055]';

    // Padrão (Cinza/Azul Neutro)
    return 'from-[#334155] via-[#475569] to-[#1e293b]';
  };

  const handleDeleteBank = async () => {
    if (!bankInfo) return;

    if (confirm('Tem certeza que deseja remover esta conta bancária?')) {
      const { error } = await supabase
        .from('bancos_clientes')
        .delete()
        .eq('id', bankInfo.id);

      if (error) {
        showToast?.('Erro ao remover conta: ' + error.message, 'error');
      } else {
        showToast?.('Conta bancária removida com sucesso.', 'success');
        onNavigate('profile');
      }
    }
  };

  // Se não carregar nada, mostra botão para adicionar
  if (!loading && !bankInfo) {
    return (
      <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col p-6 items-center justify-center text-center">
        <span className="material-symbols-outlined text-gray-700 text-6xl mb-4">no_accounts</span>
        <h2 className="text-xl font-bold mb-2">Nenhuma conta vinculada</h2>
        <p className="text-gray-500 text-sm mb-8">Você ainda não adicionou um cartão bancário à sua conta BP.</p>
        <button
          onClick={() => onNavigate('add-bank')}
          className="w-full h-14 bg-primary text-black font-black rounded-2xl"
        >
          ADICIONAR CARTÃO
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col selection:bg-primary selection:text-black">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-4">
        <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pb-8 pt-4 px-4 overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex items-center justify-between">
            <button
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
            </button>
            <h1 className="text-xl font-black text-white tracking-tight">Cartão Bancário</h1>
            <button
              onClick={handleDeleteBank}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90 text-white"
            >
              <span className="material-symbols-outlined text-[24px]">delete</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col px-6 mt-6">
          {loading ? (
            <div className="w-full aspect-[1.586/1] bg-surface-dark rounded-[20px] animate-pulse flex items-center justify-center">
              <SpokeSpinner size="w-8 h-8" />
            </div>
          ) : (
            <>
              {/* Card Bancário Realista e Compacto */}
              <div className={`relative w-full aspect-[1.586/1] rounded-[20px] overflow-hidden transition-transform active:scale-[0.99] duration-300 bg-gradient-to-br ${getBankStyle(bankInfo?.nome_banco)}`}>
                {/* Textura do Cartão */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
                {/* Brilho Glossy */}
                <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-[25deg] pointer-events-none"></div>

                <div className="relative h-full flex flex-col p-5 z-10">
                  {/* Topo: Logo e Nome do Banco */}
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1">
                        <span className="material-symbols-outlined text-black text-2xl">account_balance</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-black text-base font-black tracking-tight leading-none uppercase">{bankInfo?.nome_banco}</span>
                        <span className="text-[9px] text-black/70 font-bold uppercase tracking-widest mt-0.5">CONTA CORRENTE</span>
                      </div>
                    </div>
                    <div className="w-10 h-7 rounded bg-white/10 flex items-center justify-center border border-white/10">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500/80 -ml-1.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Chip e Contactless */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#d4af37] via-[#fcf6ba] to-[#aa771c] relative overflow-hidden flex items-center justify-center ring-1 ring-black/5">
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px p-0.5 opacity-30">
                        {[...Array(6)].map((_, i) => <div key={i} className="border border-black/20 rounded-sm"></div>)}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-black/30 text-xl rotate-90">contactless</span>
                  </div>

                  {/* Dados Centrais: IBAN */}
                  <div className="mt-auto mb-2">
                    <p className="text-[7px] text-black/60 font-black uppercase tracking-[0.3em] mb-1">IBAN</p>
                    <p className="text-[16px] font-mono font-bold text-black tracking-[0.08em] select-all leading-none">
                      {maskIban(bankInfo?.iban)}
                    </p>
                  </div>

                  {/* Base: Titular */}
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <p className="text-[7px] text-black/60 font-black uppercase tracking-[0.3em] mb-0.5">Titular</p>
                      <p className="text-[13px] font-bold text-black tracking-wide uppercase leading-none">
                        {bankInfo?.nome_completo}
                      </p>
                    </div>
                    <span className="text-[8px] text-black/40 font-black tracking-widest italic">PREMIUM PLATINUM</span>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="mt-10 flex flex-col gap-4 px-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(bankInfo?.numero_iban || '');
                    showToast?.("IBAN copiado!", "success");
                  }}
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-primary text-black font-black text-base active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                  <span>COPIAR IBAN</span>
                </button>

                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-relaxed mt-4 px-6 opacity-60">
                  ESTE CARTÃO É PROTEGIDO POR PROTOCOLOS DE SEGURANÇA BANCÁRIA DA BP AO
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetalhesConta;

