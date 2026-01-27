import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface Props {
    onNavigate: (page: any) => void;
    data?: any;
    showToast?: (message: string, type: any) => void;
}

const ConfirmDeposit: React.FC<Props> = ({ onNavigate, data, showToast }) => {
    const [deposit, setDeposit] = useState<any>(() => {
        if (data?.deposit) return data.deposit;
        const stored = localStorage.getItem('current_deposit_data');
        return stored ? JSON.parse(stored) : null;
    });

    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('phone')
                    .eq('id', user.id)
                    .single();
                if (profile?.phone) {
                    setUserPhone(profile.phone);
                }
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (data?.deposit) {
            setDeposit(data.deposit);
            localStorage.setItem('current_deposit_data', JSON.stringify(data.deposit));
        }
    }, [data]);

    const handleCopy = (text: string, fieldId: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async () => {
        if (!userName) {
            showToast?.("Por favor, digite seu nome", "warning");
            return;
        }
        try {
            const message = `ID: ${userPhone || deposit.id}
VALOR: ${(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZs
BANCO: ${deposit.nome_banco || deposit.nome_do_banco}
NOME DO PAGADOR: ${userName}`.trim();

            const whatsappUrl = `https://wa.me/244933850746?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            showToast?.("Redirecionando para o WhatsApp...", "success");
            localStorage.removeItem('current_deposit_data');
            onNavigate('home');

        } catch (err: any) {
            showToast?.("Erro: " + err.message, "error");
        }
    };

    if (!deposit) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center text-[#0F1111]">
                <h3 className="text-xl font-bold mb-2">Solicitação não encontrada</h3>
                <button onClick={() => onNavigate('deposit')} className="bg-[#00C853] px-8 py-3 rounded-2xl font-bold text-white shadow-lg shadow-green-200">Voltar</button>
            </div>
        );
    }

    const depositDetails = [
        { label: 'Banco', value: deposit.nome_banco || deposit.nome_do_banco, id: 'bank' },
        { label: 'Titular', value: deposit.nome_destinatario || deposit.beneficiario, id: 'owner' },
        { label: 'IBAN / Referência', value: deposit.iban, id: 'iban' },
        { label: 'Valor', value: `${(Number(deposit.valor_deposito) || 0).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} KZs`, id: 'amount', rawValue: deposit.valor_deposito.toString() }
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-white font-sans text-[#0F1111] overflow-y-auto">
            <div className="flex flex-col min-h-screen max-w-md mx-auto">
                <header className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                    <button onClick={() => onNavigate('deposit')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-[#00C853]">
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                    </button>
                    <h1 className="text-base font-bold">Detalhes da Recarga</h1>
                    <div className="size-10"></div>
                </header>

                <main className="flex-1 p-6 space-y-6">
                    <div className="bg-gray-50 rounded-3xl p-2 border border-gray-100">
                        {depositDetails.map((field) => (
                            <div
                                key={field.id}
                                className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-white rounded-2xl transition-colors group"
                                onClick={() => handleCopy(field.rawValue || field.value, field.id)}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{field.label}</span>
                                    <span className="text-sm font-bold text-[#0F1111]">{field.value}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {copiedField === field.id ? (
                                        <span className="text-[10px] text-[#00C853] font-bold bg-green-50 px-2 py-1 rounded-full">Copiado!</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-300 group-hover:text-[#00C853] transition-colors text-[20px]">content_copy</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#0F1111] ml-1">Seu Nome Completo</label>
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full h-14 bg-white border border-gray-200 rounded-2xl px-5 text-base font-medium outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all placeholder:text-gray-300"
                                placeholder="Digite o nome do pagador"
                                type="text"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full h-14 bg-[#00C853] text-white font-bold rounded-2xl transition-all text-base shadow-lg shadow-green-200 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>Finalizar Recarga</span>
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </button>
                    </div>

                    <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-3xl space-y-2">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <span className="material-symbols-outlined text-[20px]">info</span>
                            <span className="font-bold text-sm">Instruções</span>
                        </div>
                        <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                            Efetue a transferência de acordo com as informações acima e envie o comprovativo pelo WhatsApp para validação imediata.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ConfirmDeposit;
