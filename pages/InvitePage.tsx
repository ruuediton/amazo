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
        const link = `https://vendas-online.vercel.app/register?ref=${inviteCode}`;
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

                        {/* View Team Button - New Action */}
                        <div className="pt-2">
                            <button
                                onClick={() => onNavigate('subordinate-list')}
                                className="w-full h-14 bg-white border-2 border-[#0F1111] text-[#0F1111] rounded-2xl flex items-center justify-center gap-3 font-black text-sm active:scale-95 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined">group</span>
                                VISUALIZAR MINHA EQUIPE
                            </button>
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

                        {/* Recompensas por Metas - Premium Section */}
                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                        <span className="material-symbols-outlined text-[#E47911] text-[24px]">workspace_premium</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[15px] text-[#0F1111] leading-none">Metas de Equipe</h4>
                                        <p className="text-[10px] text-[#565959] font-bold uppercase tracking-tighter mt-1">Conquiste bônus exclusivos</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
                                    <span className="text-[10px] font-black text-[#565959]">{stats.total_invited} GESTÕES</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { level: 1, target: 50, reward: 4000, title: 'Bronze', color: '#B12704', bg: 'bg-[#FFF5F2]', icon: 'military_tech' },
                                    { level: 2, target: 100, reward: 8000, title: 'Prata', color: '#565959', bg: 'bg-[#F7F8F8]', icon: 'stars' },
                                    { level: 3, target: 500, reward: 50000, title: 'Ouro', color: '#856404', bg: 'bg-[#FFFBF0]', icon: 'emoji_events' },
                                    { level: 4, target: 1000, reward: 100000, title: 'Diamante', color: '#007185', bg: 'bg-[#F0F9FB]', icon: 'diamond' },
                                ].map((meta) => {
                                    const progress = Math.min((stats.total_invited / meta.target) * 100, 100);
                                    const isReached = stats.total_invited >= meta.target;

                                    return (
                                        <div key={meta.level} className={`group relative overflow-hidden rounded-[24px] border transition-all duration-300 ${isReached ? 'border-green-200 bg-white shadow-lg shadow-green-500/5' : 'bg-white border-gray-100'}`}>
                                            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform`} style={{ backgroundColor: meta.color }}></div>
                                            <div className="p-5 relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-3">
                                                        <div className={`size-12 rounded-2xl flex items-center justify-center border shadow-sm ${isReached ? 'bg-green-50 border-green-100 text-green-600' : `${meta.bg} border-gray-100`}`} style={{ color: isReached ? undefined : meta.color }}>
                                                            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{isReached ? 'verified' : meta.icon}</span>
                                                        </div>
                                                        <div>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isReached ? 'text-green-600' : 'text-[#565959]'}`}>NÍVEL {meta.level} • {meta.title}</p>
                                                            <h5 className="font-black text-[18px] text-[#0F1111] leading-tight">{meta.target} <span className="text-[13px] font-bold text-[#565959]">Indicações</span></h5>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-black text-[#565959] uppercase tracking-tighter opacity-60">Prêmio Amazon</span>
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="text-[10px] font-black text-[#B12704]">Kz</span>
                                                            <span className="text-[20px] font-black text-[#B12704] tracking-tighter">{meta.reward.toLocaleString('pt-AO')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-end mb-1 px-0.5">
                                                        <p className="text-[10px] font-bold text-[#565959]">
                                                            {isReached ? <span className="flex items-center gap-1 text-green-600 font-black"><span className="material-symbols-outlined text-[14px]">check_circle</span> META ATINGIDA</span> : <>Progresso: <span className="text-[#0F1111]">{stats.total_invited}</span> de {meta.target}</>}
                                                        </p>
                                                        <span className={`text-[11px] font-black ${isReached ? 'text-green-600' : 'text-[#0F1111]'}`}>{Math.floor(progress)}%</span>
                                                    </div>
                                                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                                                        <div className={`h-full transition-all duration-1000 ease-out relative ${isReached ? 'bg-green-500' : 'bg-[#FFD814]'}`} style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                                                    <p className="text-[9px] font-bold text-[#565959] italic opacity-60">* Válido para usuários ativos na rede</p>
                                                    <button onClick={handleCopyLink} disabled={isReached} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${isReached ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-[#00A8E1]/10 text-[#007185] border border-[#00A8E1]/20 active:scale-95'}`}>{isReached ? 'RESGATADO' : 'CONVIDAR AGORA'}</button>
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
