import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
    onNavigate: (page: any) => void;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const TransferenciaP2P: React.FC<Props> = ({ onNavigate, showToast }) => {
    const { withLoading } = useLoading();
    const [receiverPhone, setReceiverPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const feePercentage = 0.02; // 2%
    const amountNum = Number(amount);
    const fee = amountNum > 0 ? amountNum * feePercentage : 0;
    const total = amountNum + fee;

    const handleTransfer = async () => {
        if (!receiverPhone || !amount || !password) {
            showToast?.('Preencha todos os campos.', 'warning');
            return;
        }

        if (amountNum < 100) {
            showToast?.('Mínimo de transferência é 100 Kz.', 'warning');
            return;
        }

        setLoading(true);

        try {
            await withLoading(async () => {
                const { data, error } = await supabase.rpc('transfer_p2p', {
                    p_receiver_phone: receiverPhone,
                    p_amount: amountNum,
                    p_password: password
                });

                if (error) throw error;

                if (data && data.success) {
                    showToast?.(`Transferência realizada! Enviado: ${data.sent_amount} Kz (+${data.fee} taxa)`, 'success');
                    onNavigate('wallet');
                } else {
                    throw new Error(data?.message || 'Erro na transferência.');
                }
            });
        } catch (error: any) {
            showToast?.(error.message || 'Erro ao processar transferência.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark min-h-screen font-display text-gray-900 pb-20">
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center p-4 justify-between">
                    <button
                        onClick={() => onNavigate('wallet')}
                        className="size-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Transferência P2P</h1>
                    <div className="size-10"></div>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl text-primary mb-2">currency_exchange</span>
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">Envie dinheiro na hora</p>
                        <p className="text-xs text-gray-500 mt-1">Transfira saldo para outros membros Amazon instantaneamente.</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-primary/10">
                        <span className="material-symbols-outlined text-9xl">send</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Telefone do Destinatário</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">person_search</span>
                            <input
                                type="tel"
                                placeholder="Ex: 923456789"
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:border-primary outline-none font-bold text-lg text-gray-900 placeholder:text-gray-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Valor a enviar (Kz)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">Kz</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:border-primary outline-none font-black text-xl text-gray-900 placeholder:text-gray-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Valor do Envio</span>
                            <span className="text-gray-900 font-bold">Kz {amountNum.toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Taxa de Serviço (2%)</span>
                            <span className="text-red-500 font-bold">+ Kz {fee.toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="h-px bg-gray-200 my-1"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-black uppercase text-xs tracking-wider">Total a Debitar</span>
                            <span className="text-primary font-black text-lg">Kz {total.toLocaleString('pt-AO')}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha de Retirada</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
                            <input
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:border-primary outline-none font-bold text-lg text-gray-900 placeholder:text-gray-300 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || !receiverPhone || !password}
                        className="w-full h-14 bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-gray-900 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <SpokeSpinner size="w-6 h-6" className="text-white" /> : 'Confirmar Transferência'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TransferenciaP2P;
