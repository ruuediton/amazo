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
    const [receiverName, setReceiverName] = useState<string | null>(null);
    const [isValidatingPhone, setIsValidatingPhone] = useState(false);

    const feePercentage = 0.02; // 2%
    const amountNum = Number(amount);
    const fee = amountNum > 0 ? amountNum * feePercentage : 0;
    const total = amountNum + fee;

    // Real-time phone validation
    const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value;
        setReceiverPhone(phone);
        setReceiverName(null);

        if (phone.length >= 9) {
            setIsValidatingPhone(true);
            try {
                // Simple check if user exists (can be improved with specific RPC if needed to return partial name)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('phone', phone)
                    .single();

                if (data) {
                    setReceiverName(data.full_name);
                } else {
                    // Silent fail or custom UI indication
                }
            } catch (err) {
                // ignore
            } finally {
                setIsValidatingPhone(false);
            }
        }
    };

    const handleTransfer = async () => {
        if (!receiverPhone || !amount || !password) {
            showToast?.('Preencha todos os campos.', 'warning');
            return;
        }

        if (amountNum < 1000) {
            showToast?.('Mínimo de transferência é 1.000 Kz.', 'warning');
            return;
        }
        if (amountNum > 10000) {
            showToast?.('Máximo de transferência é 10.000 Kz.', 'warning');
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
                    showToast?.(data.message || "Tranferencia sucedida", 'success');
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
        <div className="bg-white min-h-screen font-sans text-[#0F1111] selection:bg-amber-100 pb-20 antialiased">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-[#FFD814] px-6 py-4 shadow-md border-b border-[#FCD200]">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all"
                >
                    <span className="material-symbols-outlined text-[#0F1111] text-[24px]">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-[16px] font-bold text-[#0F1111]">
                    Enviar Saldo
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md mx-auto">
                
                {/* Info Card - Light Style */}
                <div className="relative mb-8">
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-[24px] shadow-sm flex items-center gap-4 relative overflow-hidden">
                        <div className="size-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-[#e47911] text-3xl">currency_exchange</span>
                        </div>
                        <div>
                            <p className="text-[#565959] text-[10px] font-bold uppercase tracking-widest mb-1">Transferência P2P</p>
                            <p className="text-[13px] font-bold text-[#0F1111] leading-tight">Envie saldo instantaneamente para qualquer conta Amazon.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Receiver Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Telefone do Destinatário</label>
                            {isValidatingPhone && <span className="text-[10px] text-[#e77600] animate-pulse">Verificando...</span>}
                            {receiverName && !isValidatingPhone && <span className="text-[10px] text-green-600 font-bold truncate max-w-[150px]">{receiverName}</span>}
                        </div>
                        <div className={`relative flex items-center bg-white rounded-xl border h-14 px-4 transition-all shadow-sm ${receiverName ? 'border-green-500 ring-1 ring-green-500' : 'border-[#D5D9D9] focus-within:border-[#e77600] focus-within:ring-1 focus-within:ring-[#e77600]'}`}>
                            <span className={`material-symbols-outlined mr-3 ${receiverName ? 'text-green-500' : 'text-gray-400'}`}>
                                {receiverName ? 'check_circle' : 'person_search'}
                            </span>
                            <input
                                type="tel"
                                placeholder="Nº do destinatário"
                                value={receiverPhone}
                                onChange={handlePhoneChange}
                                className="w-full bg-transparent border-none p-0 text-[16px] font-bold text-[#0F1111] placeholder:text-gray-400 focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Valor a Enviar</label>
                        <div className="relative flex items-center bg-white rounded-xl border border-[#D5D9D9] h-14 px-4 focus-within:border-[#e77600] focus-within:ring-1 focus-within:ring-[#e77600] transition-all shadow-sm">
                            <span className="text-lg font-black text-[#e77600] mr-3">Kz</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[18px] font-black text-[#0F1111] placeholder:text-gray-400 focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Calculations Summary */}
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-4 shadow-inner">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Subtotal</span>
                            <span className="text-[#0F1111] font-black">Kz {amountNum.toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Taxa Operacional (2%)</span>
                            <span className="text-red-600 font-black">+ Kz {fee.toLocaleString('pt-AO')}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between items-center">
                            <span className="text-[#565959] font-black uppercase text-[10px] tracking-[0.2em]">Total Debitado</span>
                            <span className="text-2xl font-black text-[#0F1111] tracking-tighter">Kz {total.toLocaleString('pt-AO')}</span>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Senha de Retirada</label>
                        <div className="relative flex items-center bg-white rounded-xl border border-[#D5D9D9] h-14 px-4 focus-within:border-[#e77600] focus-within:ring-1 focus-within:ring-[#e77600] transition-all shadow-sm">
                            <span className="material-symbols-outlined text-gray-400 mr-3">lock</span>
                            <input
                                type="password"
                                placeholder="••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[20px] font-bold text-[#0F1111] tracking-[0.4em] placeholder:text-gray-300 focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || !receiverPhone || !password}
                        className="w-full h-14 bg-[#FFD814] text-[#0F1111] border border-[#FCD200] font-bold text-[15px] uppercase tracking-widest rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-4 hover:bg-[#F7CA00]"
                    >
                        {loading ? <SpokeSpinner size="w-6 h-6" color="text-[#0F1111]" /> : 'Confirmar Envio'}
                    </button>
                    
                    <p className="text-center text-[11px] text-gray-400 font-medium px-4 leading-relaxed italic">
                        O envio de saldo entre contas Amazon é instantâneo e seguro. Verifique os dados antes de confirmar.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TransferenciaP2P;
