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
        <div className="bg-background-dark font-display text-black antialiased min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center p-4 justify-between bg-white sticky top-0 z-40 border-b border-gray-100 backdrop-blur-md bg-opacity-90">
                <button onClick={() => onNavigate('profile')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors text-primary">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold flex-1 text-center pr-10 tracking-tight">Convidar Amigos</h2>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-20"><SpokeSpinner size="w-8 h-8" /></div>
                ) : (
                    <>
                        {/* Hero Card */}
                        <div className="bg-gradient-to-br from-primary to-yellow-500 rounded-[32px] p-6 text-black shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="material-symbols-outlined text-9xl">group_add</span>
                            </div>

                            <h3 className="text-2xl font-black mb-2 leading-tight">Ganhe Recompensas<br />Ilimitadas</h3>
                            <p className="text-sm font-bold opacity-80 mb-6 max-w-[200px]">Convide amigos e ganhe % sobre todas as operações deles.</p>

                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-white/10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Seu Código</p>
                                    <p className="text-3xl font-black tracking-wider font-mono">{inviteCode || '---'}</p>
                                </div>
                                <button
                                    onClick={handleCopyCode}
                                    className="size-12 bg-white text-black rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                                >
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Link Action */}
                        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">link</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg">Link de Convite</h4>
                                    <p className="text-xs text-gray-500 font-medium">Compartilhe em suas redes sociais</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopyLink}
                                    className="flex-1 h-12 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    Copiar Link
                                </button>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-3xl text-primary mb-2">groups</span>
                                <p className="text-2xl font-black">{stats.total_invited}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amigos Convidados</p>
                            </div>
                            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-3xl text-green-500 mb-2">monetization_on</span>
                                <p className="text-2xl font-black">Kz {stats.total_earned}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ganhos Totais</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4 pt-4">
                            <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 px-2">Como Funciona</h4>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs shrink-0">1</div>
                                <div>
                                    <p className="font-bold text-sm">Compartilhe seu link</p>
                                    <p className="text-xs text-gray-500 mt-1">Envie seu link exclusivo para seus amigos e familiares.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs shrink-0">2</div>
                                <div>
                                    <p className="font-bold text-sm">Amigos se cadastram</p>
                                    <p className="text-xs text-gray-500 mt-1">Eles usam seu código para criar uma nova conta na Amazon.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start px-2">
                                <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-xs shrink-0">3</div>
                                <div>
                                    <p className="font-bold text-sm">Você ganha</p>
                                    <p className="text-xs text-gray-500 mt-1">Receba comissões automáticas sempre que eles realizarem operações.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default InvitePage;
