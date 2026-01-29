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

    const feePercentage = 0.05; // 5% for internal transfers
    const amountNum = Number(amount);
    const fee = amountNum > 0 ? amountNum * feePercentage : 0;
    const total = amountNum; // If amount is gross (bruto), total debited is amount.
    // Wait, the user said "amount - fee -> valor final enviado". 
    // This implies amount is the TOTAL debited.

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
            showToast?.('Mínimo de envio é 1.000 Kz.', 'warning');
            return;
        }
        if (amountNum > 10000) {
            showToast?.('Máximo de envio é 10.000 Kz.', 'warning');
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
                    showToast?.(data.message || "Envio bem-sucedido", 'success');
                    onNavigate('historico-p2p');
                } else {
                    throw new Error(data?.message || 'Erro no envio.');
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
                    <h1 className="text-xl font-black text-white tracking-tight">Enviar Saldo</h1>
                    <div className="w-11"></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-md mx-auto">

                {/* Info Card - Light Style */}
                <div className="relative mb-8">
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-[24px] flex items-center gap-4 relative overflow-hidden">
                        <div className="size-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#e47911] text-3xl">currency_exchange</span>
                        </div>
                        <div>
                            <p className="text-[#565959] text-[10px] font-bold uppercase tracking-widest mb-1">Envio P2P</p>
                            <p className="text-[13px] font-bold text-[#0F1111] leading-tight">Envie saldo instantaneamente para qualquer conta BP.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Receiver Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Telefone do Destinatário</label>
                            {isValidatingPhone && <span className="text-[10px] text-[#00C853] animate-pulse">Verificando...</span>}
                            {receiverName && !isValidatingPhone && <span className="text-[10px] text-green-600 font-bold truncate max-w-[150px]">{receiverName}</span>}
                        </div>
                        <div className={`bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border transition-colors ${receiverName ? 'border-green-500' : 'border-transparent focus-within:border-[#00C853]'}`}>
                            <span className={`material-symbols-outlined text-[24px] ${receiverName ? 'text-green-500' : 'text-[#00C853]'}`}>
                                {receiverName ? 'check_circle' : 'person_search'}
                            </span>
                            <input
                                type="tel"
                                placeholder="Nº do destinatário"
                                value={receiverPhone}
                                onChange={handlePhoneChange}
                                className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
                            />
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Valor a Enviar</label>
                        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                            <span className="material-symbols-outlined text-[#00C853] text-[24px]">payments</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[14px]"
                            />
                            <span className="text-[14px] font-bold text-gray-400">Kz</span>
                        </div>
                    </div>

                    {/* Calculations Summary */}
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Subtotal (Líquido)</span>
                            <span className="text-[#0F1111] font-black">Kz {(amountNum - fee).toLocaleString('pt-AO')}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Taxa Operacional (5%)</span>
                            <span className="text-red-600 font-black">+ Kz {fee.toLocaleString('pt-AO')}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between items-center">
                            <span className="text-[#565959] font-black uppercase text-[10px] tracking-[0.2em]">Total Bruto (Debitado)</span>
                            <span className="text-2xl font-black text-[#0F1111] tracking-tighter">Kz {amountNum.toLocaleString('pt-AO')}</span>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 ml-1 uppercase tracking-wider">Senha de Retirada</label>
                        <div className="bg-gray-50 rounded-xl h-14 flex items-center px-4 gap-3 relative border border-transparent focus-within:border-[#00C853] transition-colors">
                            <span className="material-symbols-outlined text-[#00C853] text-[24px]">lock</span>
                            <input
                                type="password"
                                placeholder="••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent flex-1 h-full outline-none text-[#111] font-medium placeholder:text-gray-400 text-[20px] tracking-[0.4em]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || !receiverPhone || !password}
                        className="w-full h-14 bg-[#00C853] text-[#0F1111] border border-[#00C853] font-bold text-[15px] uppercase tracking-widest rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-4 hover:bg-[#00C853]"
                    >
                        {loading ? <SpokeSpinner size="w-6 h-6" color="text-[#0F1111]" /> : 'Confirmar Envio'}
                    </button>

                    <p className="text-center text-[11px] text-gray-400 font-medium px-4 leading-relaxed italic">
                        O envio de saldo entre contas BP é instantâneo e seguro. Verifique os dados antes de confirmar.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TransferenciaP2P;

