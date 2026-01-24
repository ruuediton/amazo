import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface DepositProps {
    onNavigate: (page: any, data?: any) => void;
    showToast?: (message: string, type: any) => void;
}

const Deposit: React.FC<DepositProps> = ({ onNavigate, showToast }) => {
    const [amount, setAmount] = useState<string>('');
    const { withLoading } = useLoading();
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Step management: 'amount' | 'bank'
    const [step, setStep] = useState<'amount' | 'bank'>('amount');
    const [selectedBank, setSelectedBank] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('bancos_empresa')
                .select('*')
                .eq('ativo', true);

            if (!error && data) {
                const filteredBanks = data.filter(b =>
                    !b.nome_do_banco.toUpperCase().includes('USDT') &&
                    !b.nome_do_banco.toUpperCase().includes('USTD')
                );
                setBanks(filteredBanks);
            }
        } catch (err) {
            console.error('Erro ao carregar bancos:', err);
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [3000, 12000, 39000, 75000];

    const handleQuickAmount = (val: number) => {
        setAmount(val.toString());
    };

    const handleNextToBank = () => {
        const val = parseFloat(amount);
        if (!amount || isNaN(val) || val < 3000) {
            showToast?.("Valor mínimo de depósito: 3.000 KZ", "warning");
            return;
        }
        if (val > 1000000) {
            showToast?.("Valor máximo permitido: 1.000.000 KZ", "warning");
            return;
        }
        setStep('bank');
    };

    const handleFinalConfirm = async () => {
        if (!selectedBank) {
            showToast?.("Por favor, selecione um banco.", "warning");
            return;
        }

        try {
            await withLoading(async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    showToast?.("Sessão expirada. Faça login novamente.", "error");
                    onNavigate('login');
                    return;
                }

                const { data, error } = await supabase.rpc('create_deposit_request', {
                    p_amount: parseFloat(amount),
                    p_bank_name: selectedBank.nome_do_banco,
                    p_iban: selectedBank.iban
                });

                if (error) throw error;

                if (data.success) {
                    onNavigate('confirmar-deposito', {
                        deposit: {
                            ...data.data,
                            nome_destinatario: selectedBank.nome_destinatario,
                            nome_banco: selectedBank.nome_do_banco
                        }
                    });
                }
            }, "Gerando dados de depósito...");
        } catch (err: any) {
            showToast?.(err.message || "Erro ao processar depósito", "error");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <SpokeSpinner size="w-8 h-8" color="text-[#FFD814]" />
        </div>
    );

    // VIEW: ENTER AMOUNT
    if (step === 'amount') {
        return (
            <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 selection:bg-amber-100 animate-in fade-in duration-300">
                <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <span className="font-bold text-[16px]">Depositar Kwanza</span>
                    <button
                        onClick={() => onNavigate('deposit-history')}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#0F1111]">history</span>
                    </button>
                </header>

                <main className="p-5 space-y-8">
                    <div className="space-y-2">
                        <label className="block text-[13px] font-bold text-[#0F1111]">
                            Quantia a Depositar (Kz)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full h-[52px] px-4 rounded-[12px] bg-white border border-[#D5D9D9] text-[18px] font-bold text-[#0F1111] placeholder:text-[#565959] focus:outline-none focus:border-[#E77600] focus:ring-1 focus:ring-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,0.5)] transition-all"
                            placeholder="Digite o valor..."
                            autoFocus
                        />
                        <p className="text-[11px] font-medium text-gray-400">Min: 3.000 Kz • Max: 1.000.000 Kz</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {quickAmounts.map(val => (
                            <button
                                key={val}
                                onClick={() => handleQuickAmount(val)}
                                className="py-3 bg-white border border-[#D5D9D9] rounded-[16px] text-[12px] font-bold text-[#0F1111] hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                            >
                                {val.toLocaleString('pt-AO')}
                            </button>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                        <div className="size-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[28px]">account_balance</span>
                        </div>
                        <div>
                            <p className="text-[14px] font-bold text-blue-900">Transferência Bancária</p>
                            <p className="text-[12px] text-blue-700/80 leading-snug">O valor será creditado no seu saldo após a verificação do comprovativo pela nossa equipe.</p>
                        </div>
                    </div>
                </main>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 px-8 bg-white border-t border-gray-100 pb-10">
                    <button
                        onClick={handleNextToBank}
                        disabled={!amount || parseFloat(amount) < 3000}
                        className="w-full h-14 bg-[#FFD814] text-[#0F1111] border border-[#FCD200] font-bold text-[15px] rounded-xl shadow-sm active:scale-[0.98] hover:bg-[#F7CA00] transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                    >
                        PRÓXIMO
                    </button>
                </div>
            </div>
        );
    }

    // VIEW: SELECT BANK (Full Screen matching Image Layout)
    return (
        <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 antialiased animate-in slide-in-from-right duration-300">
            {/* Header (Inspired by Image Title Bar) */}
            <header className="bg-[#E77600] text-white p-4 flex items-center justify-center relative shadow-md">
                <button onClick={() => setStep('amount')} className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-[18px] font-bold tracking-tight">Informações da Conta</h1>
            </header>

            <main className="px-6 pt-8 space-y-6">
                {/* Progress Bar (Matching Image Style) */}
                <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden relative border border-gray-200 shadow-inner">
                    <div className="absolute inset-y-0 left-0 bg-[#00ba84] rounded-full flex items-center justify-center transition-all duration-500" style={{ width: '33.3%' }}>
                        <span className="text-[11px] font-black text-white">1 / 3</span>
                    </div>
                </div>

                <div className="text-center pt-2">
                    <h2 className="text-[20px] font-bold text-[#0F1111]">Selecione o seu Banco</h2>
                </div>

                {/* Bank Selection Box (Matching Image Container) */}
                <div className="border border-gray-200 rounded-lg p-2 bg-white shadow-sm max-h-[400px] overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        {banks.map(bank => (
                            <button
                                key={bank.id}
                                onClick={() => setSelectedBank(bank)}
                                className={`w-full py-4 px-4 rounded flex items-center justify-center text-[15px] font-bold transition-all border ${selectedBank?.id === bank?.id
                                    ? 'bg-[#FFD814] border-[#FCD200] text-[#0F1111] scale-[1.02] shadow-md'
                                    : 'bg-gray-50 border-gray-100 text-gray-500 active:bg-gray-100'}`}
                            >
                                {bank.nome_do_banco}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button (Matching Image Position) */}
                <div className="pt-6">
                    <button
                        onClick={handleFinalConfirm}
                        disabled={!selectedBank}
                        className="w-full h-14 bg-[#E77600] text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300"
                    >
                        PRÓXIMO
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Deposit;
