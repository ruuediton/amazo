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
        } catch (err) {
            console.error('Erro ao carregar bancos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalConfirm = async () => {
        const val = parseFloat(amount);
        if (!amount || isNaN(val) || val < 3000) {
            showToast?.("Valor mínimo, 3.000 KZ", "warning");
            return;
        }
        if (val > 1000000) {
            showToast?.("Valor máximo permitido: 1.000.000 KZ", "warning");
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
            }, "Gerando dados de depósito...");
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
            <header className="p-4 border-b border-gray-100 flex items-center">
                <button onClick={() => onNavigate('profile')} className="mr-4">
                    <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
                </button>
                <h1 className="text-[16px] font-bold">Depósito</h1>
            </header>

            <main className="p-6 space-y-6">
                <div className="space-y-3">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full h-[52px] px-4 rounded-lg bg-white border border-gray-200 text-[16px] text-[#0F1111] placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] transition-all"
                        placeholder="Digite o valor"
                    />

                    <div className="flex flex-wrap gap-2">
                        {quickAmounts.map(val => (
                            <button
                                key={val}
                                onClick={() => setAmount(val.toString())}
                                className="px-3 py-2 rounded-lg bg-gray-50 text-[12px] font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {val.toLocaleString('pt-AO')} Kz
                            </button>
                        ))}
                    </div>
                </div>

                {amount && (
                    <div className="space-y-2">
                        <p className="text-[13px] font-medium text-gray-400">Banco disponível</p>
                        <div className="relative">
                            <select
                                value={selectedBank?.id || ''}
                                onChange={(e) => {
                                    const bank = banks.find(b => String(b.id) === e.target.value);
                                    setSelectedBank(bank);
                                }}
                                className="w-full h-[52px] px-4 rounded-lg bg-white border border-gray-200 text-[15px] text-[#0F1111] appearance-none focus:outline-none focus:border-[#00C853] transition-all cursor-pointer"
                            >
                                <option value="" disabled>Escolha o banco</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>{bank.nome_do_banco}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 text-[20px]">expand_more</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleFinalConfirm}
                        disabled={!amount || !selectedBank || parseFloat(amount) < 3000}
                        className="w-full h-[52px] bg-[#00C853] text-white font-bold rounded-lg transition-all disabled:opacity-50"
                    >
                        Confirmar
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Deposit;
