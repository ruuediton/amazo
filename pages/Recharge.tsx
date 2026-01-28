import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface DepositProps {
    onNavigate: (page: any, data?: any) => void;
    showToast?: (message: string, type: any) => void;
}

const Recharge: React.FC<DepositProps> = ({ onNavigate, showToast }) => {
    const [amount, setAmount] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);
    const { withLoading } = useLoading();
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBank, setSelectedBank] = useState<any>(null);

    const quickAmounts = [3000, 12000, 39000, 75000];

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

            // Fetch current balance for header
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('balance')
                    .eq('id', user.id)
                    .single();
                if (profile) setBalance(profile.balance || 0);
            }
        } catch (err) {
            console.error('Erro ao carregar bancos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalConfirm = async () => {
        const val = parseFloat(amount);
        if (!amount || isNaN(val) || val < 3000) {
            showToast?.("Recarga mínima, 3.000 KZs", "warning");
            return;
        }
        if (val > 1000000) {
            showToast?.("Recarga máxima: 1.000.000 KZs", "warning");
            return;
        }
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
                    p_amount: val,
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
            }, "Gerando dados de recarga...");
        } catch (err: any) {
            showToast?.(err.message || "Opah algo deu errado", "error");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <SpokeSpinner size="w-8 h-8" color="text-[#00C853]" />
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans text-[#0F1111] pb-20 antialiased">
            {/* Premium Header */}
            <div className="bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pt-8 pb-20 px-4 relative">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="size-10 flex items-center justify-center rounded-full bg-white/20 text-white active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-white text-lg font-bold tracking-tight">Recarga</h1>
                    <button
                        onClick={() => onNavigate('deposit-history')}
                        className="size-10 flex items-center justify-center rounded-full bg-white/20 text-white active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">history</span>
                    </button>
                </div>
            </div>

            <main className="px-4 -mt-12 relative z-10 space-y-6">
                {/* Floating Balance Card */}
                <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-premium relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#00C853]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-[#565959] text-[13px] font-medium leading-none">Saldo</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 leading-none">
                        <span className="text-[28px] font-black text-[#111] tracking-tighter">
                            {balance.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[13px] font-bold text-[#565959]">KZs</span>
                    </div>
                </div>

                <section className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#0F1111]">Quantia da Recarga</label>
                        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                            <span className="material-symbols-outlined text-[#00C853] text-[24px]">add_card</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
                                placeholder="0,00"
                            />
                            <span className="text-[14px] font-bold text-gray-400">Kz</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {quickAmounts.map(val => (
                            <button
                                key={val}
                                onClick={() => setAmount(val.toString())}
                                className="px-3 py-2 rounded-lg bg-gray-50 text-[12px] font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {val.toLocaleString('pt-AO')} KZs
                            </button>
                        ))}
                    </div>

                    {amount && (
                        <div className="space-y-2">
                            <p className="text-[13px] font-bold text-[#0F1111]">Banco disponível</p>
                            <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                                <span className="material-symbols-outlined text-[#00C853] text-[24px]">account_balance</span>
                                <select
                                    value={selectedBank?.id || ''}
                                    onChange={(e) => {
                                        const bank = banks.find(b => String(b.id) === e.target.value);
                                        setSelectedBank(bank);
                                    }}
                                    className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium appearance-none cursor-pointer text-[14px]"
                                >
                                    <option value="" disabled>Escolha o banco</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>{bank.nome_do_banco}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleFinalConfirm}
                            disabled={loading || !amount || !selectedBank || parseFloat(amount) < 3000}
                            className="w-full h-[52px] bg-[#00C853] text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? 'Processando' : 'Confirmar'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Recharge;
