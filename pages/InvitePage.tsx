import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
    onNavigate: (page: any) => void;
    showToast?: (message: string, type: any) => void;
}

const InvitePage: React.FC<Props> = ({ onNavigate, showToast }) => {
    const { withLoading } = useLoading();
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [stats, setStats] = useState({ total_invited: 0, total_earned: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInviteData();
    }, []);

    const fetchInviteData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Buscar código de convite do perfil
            const { data: profile } = await supabase
                .from('profiles')
                .select('invite_code')
                .eq('id', user.id)
                .single();

            if (profile) setInviteCode(profile.invite_code);

            // Buscar estatísticas (se existirem tabelas para isso ou contar na my_equipe)
            // Por enquanto, placeholder ou contar
            const { count } = await supabase
                .from('my_equipe')
                .select('*', { count: 'exact', head: true })
                .eq('uuid_dono', user.id);

            setStats({
                total_invited: count || 0,
                total_earned: 0 // Placeholder logic for now
            });

        } catch (error) {
            console.error("Error fetching invite data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (!inviteCode) return;
        const link = `https://deepbank-eight.vercel.app/register?ref=${inviteCode}`;
        navigator.clipboard.writeText(link).then(() => {
            showToast?.("Link copiado com sucesso!", "success");
        });
    };

    const handleCopyCode = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(inviteCode).then(() => {
            showToast?.("Código copiado!", "success");
        });
    };

    return (
        <div className="bg-white font-sans text-[#0F1111] antialiased min-h-screen flex flex-col selection:bg-amber-100">
            {/* Header */}
            <header className="flex items-center p-4 justify-between bg-white sticky top-0 z-40 border-b border-gray-100 backdrop-blur-md">
                <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-[#0F1111]">arrow_back</span>
                </button>
                <h2 className="text-[16px] font-bold flex-1 text-center pr-10 tracking-tight">Convidar Amigos</h2>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 pb-40">
                {loading ? (
                    <div className="flex justify-center py-20"><SpokeSpinner size="w-8 h-8" color="text-amber-500" /></div>
                ) : (
                    <>
                        {/* Hero Card - Flat */}
                        <div className="bg-[#FFD814] rounded-[24px] p-6 text-[#0F1111] border border-[#FCD200] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="material-symbols-outlined text-9xl">group_add</span>
                            </div>

                            <h3 className="text-2xl font-black mb-1 leading-tight tracking-tighter">Indique e Ganhe</h3>
                            <p className="text-[13px] font-bold opacity-80 mb-6 max-w-[200px]">Compartilhe a experiência Amazon e ganhe comissões ilimitadas.</p>

                            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-white/20">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Seu Código</p>
                                    <p className="text-3xl font-black tracking-wider font-mono">{inviteCode || '---'}</p>
                                </div>
                                <button
                                    onClick={handleCopyCode}
                                    className="size-12 bg-white text-black rounded-xl flex items-center justify-center active:scale-90 transition-transform border border-white/40"
                                >
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Link Action - Flat */}
                        <div className="bg-white rounded-[24px] p-5 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-full bg-gray-50 text-[#0F1111] flex items-center justify-center border border-gray-100">
                                    <span className="material-symbols-outlined text-2xl">link</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[16px]">Link de Convite</h4>
                                    <p className="text-[12px] text-[#565959] font-medium">Divulgue seu link para novos usuários</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopyLink}
                                    className="flex-1 h-12 bg-[#0F1111] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    Copiar Link
                                </button>
                            </div>
                        </div>

                        {/* Stats Overview - Flat */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-[24px] p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-3xl text-[#565959] mb-2">groups</span>
                                <p className="text-2xl font-black">{stats.total_invited}</p>
                                <p className="text-[10px] font-bold text-[#565959] uppercase tracking-widest">Indicados</p>
                            </div>
                            <div className="bg-white rounded-[24px] p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-3xl text-amazon-green mb-2">account_balance_wallet</span>
                                <p className="text-2xl font-black">Kz {stats.total_earned}</p>
                                <p className="text-[10px] font-bold text-[#565959] uppercase tracking-widest">Saldo Recebido</p>
                            </div>
                        </div>

                        {/* Instructions - Flat */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <h4 className="font-bold text-[13px] uppercase tracking-widest text-[#565959] px-2">Como Funciona</h4>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-xs shrink-0 text-[#0F1111]">1</div>
                                <div>
                                    <p className="font-bold text-[14px]">Compartilhe seu link</p>
                                    <p className="text-[12px] text-[#565959] mt-0.5">Envie seu link exclusivo para seus contatos.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-xs shrink-0 text-[#0F1111]">2</div>
                                <div>
                                    <p className="font-bold text-[14px]">Eles se cadastram</p>
                                    <p className="text-[12px] text-[#565959] mt-0.5">Seus amigos criam contas na Amazon usando seu ref.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-xs shrink-0 text-[#0F1111]">3</div>
                                <div>
                                    <p className="font-bold text-[14px]">Você lucra</p>
                                    <p className="text-[12px] text-[#565959] mt-0.5">Receba comissões automáticas por cada operação deles.</p>
                                </div>
                            </div>
                        </div>

                        {/* Recompensas por Metas - New Section */}
                        <div className="pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <span className="material-symbols-outlined text-[#E47911]">emoji_events</span>
                                <h4 className="font-bold text-[14px] text-[#0F1111] uppercase tracking-wider">Metas de Bônus</h4>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { level: 1, target: 50, reward: 4000, title: 'Bronze' },
                                    { level: 2, target: 100, reward: 8000, title: 'Prata' },
                                    { level: 3, target: 500, reward: 50000, title: 'Ouro' },
                                    { level: 4, target: 1000, reward: 100000, title: 'Diamante' },
                                ].map((meta) => {
                                    const progress = Math.min((stats.total_invited / meta.target) * 100, 100);
                                    const isReached = stats.total_invited >= meta.target;

                                    return (
                                        <div key={meta.level} className={`relative overflow-hidden rounded-xl border ${isReached ? 'bg-[#F0FDF4] border-green-200' : 'bg-white border-gray-200'}`}>
                                            <div className="p-4 relative z-10">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isReached ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            Nível {meta.level} • {meta.title}
                                                        </span>
                                                        <h5 className="font-bold text-[15px] mt-1 text-[#0F1111]">{meta.target} Convites</h5>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Prêmio</p>
                                                        <p className="text-[16px] font-black text-[#B12704]">Kz {meta.reward.toLocaleString('pt-AO')}</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${isReached ? 'bg-green-500' : 'bg-[#FFD814]'}`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-[10px] font-medium text-gray-500">{stats.total_invited} / {meta.target}</span>
                                                    {isReached && <span className="text-[10px] font-bold text-green-600 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">check_circle</span> Conquistado</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default InvitePage;
