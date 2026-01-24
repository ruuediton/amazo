import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface AddBankProps {
  onNavigate: (page: any) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const AddBank: React.FC<AddBankProps> = ({ onNavigate, showToast }) => {
  const { withLoading } = useLoading(); // Hook importado corretamente
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingBank, setExistingBank] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'view' | 'edit'>('create');

  useEffect(() => {
    checkExistingBank();
  }, []);

  const checkExistingBank = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.rpc('get_my_bank_accounts');
      if (data && data.length > 0) {
        setExistingBank(data[0]);
        setMode('view');
      }
    } catch (err) {
      console.error('Erro ao buscar conta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (existingBank) {
      setBankName(existingBank.nome_banco);
      setHolderName(existingBank.nome_completo);
      setIban(existingBank.iban);
      setMode('edit');
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja apagar esta conta?')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('bancos_clientes')
          .delete()
          .eq('user_id', existingBank.user_id);

        if (error) throw error;

        showToast?.('Conta removida com sucesso!', 'success');
        setExistingBank(null);
        setBankName('');
        setHolderName('');
        setIban('');
        setMode('create');
      } catch (error: any) {
        showToast?.('Erro ao deletar: ' + (error.message || 'Erro desconhecido'), 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setIban(value);
  };

  const handleSaveBank = async () => {
    try {
        const cleanIban = iban.replace(/[^A-Z0-9]/g, '');
        if (cleanIban.length < 21) {
            showToast?.("IBAN inválido. Um IBAN angolano deve conter pelo menos 21 caracteres.", "error");
            return;
        }

        await withLoading(async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("Sessão expirada. Acesse novamente.");
            }

            const payload = {
                p_bank_name: bankName,
                p_holder_name: holderName,
                p_iban: cleanIban
            };

            const { error } = await supabase.rpc(
                mode === 'edit' ? 'update_bank_account' : 'add_bank_account',
                payload
            );

            if (error) throw error;

            showToast?.("Conta bancária vinculada com sucesso!", "success");
            await checkExistingBank();
            setTimeout(() => onNavigate('profile'), 1200);
        }, "Salvando dados bancários...");

    } catch (err: any) {
        if (err.message && !err.message.includes('loading')) {
            showToast?.(err.message, "error");
        }
    }
  };

  return (
    <div className="font-sans antialiased bg-white text-[#0F1111] min-h-screen flex flex-col selection:bg-amber-100">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('profile')}
            className="group flex items-center justify-center size-10 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[#0F1111] text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-[16px] font-bold text-[#0F1111] tracking-tight">
            {mode === 'view' ? 'Dados Bancários' : mode === 'edit' ? 'Editar Conta' : 'Nova Conta'}
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-5 pt-6 pb-10">
        {mode === 'view' ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="size-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
               <span className="material-symbols-outlined text-green-600 text-4xl">verified_user</span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-[#0F1111]">Conta Vinculada</h2>
              <p className="text-[#565959] text-sm">Seus recebimentos serão enviados para:</p>
            </div>

            <div className="w-full bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-[13px] font-bold text-[#565959]">Banco</span>
                  <span className="text-[14px] font-bold text-[#0F1111]">{existingBank?.nome_banco}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-[13px] font-bold text-[#565959]">Titular</span>
                  <span className="text-[14px] font-bold text-[#0F1111]">{existingBank?.nome_completo}</span>
                </div>
                <div>
                   <span className="text-[11px] font-bold text-[#565959] uppercase tracking-wider mb-1 block">IBAN</span>
                   <p className="text-[15px] font-mono font-medium text-[#0F1111] bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">
                      {existingBank?.iban}
                   </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3 pt-4">
              <button
                onClick={handleEdit}
                className="w-full h-12 bg-white border border-gray-300 text-[#0F1111] text-[14px] font-medium rounded-lg shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50"
              >
                Atualizar Dados
              </button>
              <button
                onClick={handleDelete}
                className="w-full h-12 text-[#CC0C39] text-[14px] font-medium rounded-lg hover:bg-red-50 transition-all"
              >
                Remover Conta
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-[18px] font-bold text-[#0F1111] mb-1">Adicionar Conta Bancária</h2>
              <p className="text-[#565959] text-[13px]">Certifique-se que o titular da conta corresponde ao seu BI.</p>
            </div>

            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  Banco Destinatário
                </label>
                <div className="relative">
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-[44px] pl-4 pr-10 rounded-[8px] bg-white border border-[#D5D9D9] text-[14px] text-[#0F1111] focus:outline-none focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] transition-all appearance-none"
                  >
                    <option value="">Selecione o banco...</option>
                    <option value="Banco BAI">Banco BAI</option>
                    <option value="Banco BFA">Banco BFA</option>
                    <option value="Banco BIC">Banco BIC</option>
                    <option value="Banco Atlântico">Banco Atlântico</option>
                    <option value="Banco Sol">Banco Sol</option>
                    <option value="Banco BNI">Banco BNI</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#565959]">
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  Nome do Titular
                </label>
                <input
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full h-[44px] px-4 rounded-[8px] bg-white border border-[#D5D9D9] text-[14px] text-[#0F1111] placeholder:text-[#565959] focus:outline-none focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] transition-all"
                  placeholder="Ex: João Manuel Silva"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-[#0F1111]">
                  IBAN (21 Dígitos)
                </label>
                <input
                  value={iban}
                  onChange={handleIbanChange}
                  maxLength={25}
                  className="w-full h-[44px] px-4 rounded-[8px] bg-white border border-[#D5D9D9] text-[14px] text-[#0F1111] font-mono placeholder:text-[#565959] focus:outline-none focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] transition-all"
                  placeholder="AO06 0000 0000..."
                  type="text"
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {mode === 'edit' && (
                <button
                  onClick={() => setMode('view')}
                  className="w-full h-10 text-[#007185] text-[13px] font-medium hover:underline transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSaveBank}
                disabled={loading}
                className="w-full h-[44px] bg-[#FFD814] border border-[#FCD200] rounded-[8px] flex items-center justify-center font-normal text-[#0F1111] text-[15px] shadow-sm hover:bg-[#F7CA00] active:scale-[0.99] transition-all"
              >
                  {loading ? (
                    'Salvando...'
                  ) : (
                    mode === 'edit' ? 'Salvar Alterações' : 'Vincular Conta'
                  )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
                <span className="material-symbols-outlined text-[16px] text-[#565959]">lock</span>
                <p className="text-[11px] text-[#565959]">Ambiente seguro Amazon</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};};

export default AddBank;
