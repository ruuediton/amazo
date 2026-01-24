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
                    onNavigate('historico-conta');
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
        <div className="bg-[#0a0a0b] min-h-screen font-display text-white selection:bg-amber-500/30 pb-20">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0b]/80 px-6 py-4 backdrop-blur-xl border-b border-white/5">
                <button
                    onClick={() => onNavigate('profile')}
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all border border-white/10"
                >
                    <span className="material-symbols-outlined text-amber-500 text-[22px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-[15px] font-black uppercase tracking-[0.1em] text-white pr-10">
                    Enviar Saldo
                </h1>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-lg mx-auto">
                <div className="relative mb-10 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-200/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/[0.03] backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <span className="material-symbols-outlined text-amber-500 text-3xl">synced_line</span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">Transferência P2P</p>
                            <p className="text-[13px] font-medium text-white/80 leading-tight">Envie saldo instantaneamente para qualquer conta Amazon.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">Telefone do Destinatário</label>
                        <div className="relative flex items-center bg-white/[0.03] rounded-2xl border border-white/10 h-16 px-5 focus-within:border-amber-500/50 transition-all">
                            <span className="material-symbols-outlined text-amber-500/50 mr-3">person_search</span>
                            <input
                                type="tel"
                                placeholder="Nº do destinatário"
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[18px] font-bold text-white placeholder:text-gray-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">Valor a Enviar</label>
                        <div className="relative flex items-center bg-white/[0.03] rounded-2xl border border-white/10 h-16 px-5 focus-within:border-amber-500/50 transition-all">
                            <span className="text-xl font-bold text-amber-500 mr-3">Kz</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[18px] font-bold text-white placeholder:text-gray-700 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Subtotal</span>
                            <span className="text-white font-black">Kz {amountNum.toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Taxa Operacional (2%)</span>
                            <span className="text-amber-500 font-black">+ Kz {fee.toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">Total Debitado</span>
                            <span className="text-2xl font-black text-white tracking-tighter">Kz {total.toLocaleString('pt-AO')}</span>
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="block text-[11px] font-black text-gray-500 ml-1 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors">Senha de Retirada</label>
                        <div className="relative flex items-center bg-white/[0.03] rounded-2xl border border-white/10 h-16 px-5 focus-within:border-amber-500/50 transition-all">
                            <span className="material-symbols-outlined text-amber-500/50 mr-3">lock_open</span>
                            <input
                                type="password"
                                placeholder="••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[24px] font-bold text-white tracking-[0.3em] placeholder:text-gray-800 focus:ring-0"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || !receiverPhone || !password}
                        className="relative group w-full h-16 overflow-hidden rounded-2xl shadow-2xl shadow-amber-500/10 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 group-hover:scale-105 transition-transform duration-500"></div>
                        <div className="relative flex items-center justify-center font-black text-black text-sm uppercase tracking-[0.2em]">
                            {loading ? <SpokeSpinner size="w-6 h-6" className="text-black" /> : 'Confirmar Envio'}
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default TransferenciaP2P;
