import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';
import SpokeSpinner from '../components/SpokeSpinner';

interface P2PTransaction {
    id: string;
    sender_id: string;
    receiver_id: string;
    amount: number;
    fee: number;
    created_at: string;
    status: string;
    sender?: {
        phone: string;
        full_name: string;
    };
    receiver?: {
        phone: string;
        full_name: string;
    };
}

interface Props {
    onNavigate: (page: any) => void;
}

const HistoricoP2P: React.FC<Props> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<P2PTransaction[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState<'Todas' | 'Saídas' | 'Recebidas'>('Todas');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const userId = session.user.id;

            // Fetch profile for balance and info
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            setUserProfile(profile);

            // Fetch P2P transactions
            const { data: txs, error } = await supabase
                .from('transacoes_p2p')
                .select('*')
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!txs) {
                setTransactions([]);
                setLoading(false);
                return;
            }

            // Hydrate profiles (names/phones)
            const profileIds = [...new Set(txs.flatMap(t => [t.sender_id, t.receiver_id]))];
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, phone, full_name')
                .in('id', profileIds);

            const profileMap = (profilesData || []).reduce((acc: any, p: any) => {
                acc[p.id] = p;
                return acc;
            }, {});

            const hydrated = txs.map(t => ({
                ...t,
                sender: profileMap[t.sender_id],
                receiver: profileMap[t.receiver_id]
            }));

            setTransactions(hydrated);
        } catch (err) {
            console.error('Error fetching P2P history:', err);
        } finally {
            setLoading(false);
        }
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '*** ***';
        const clean = phone.replace(/\s/g, '');
        if (clean.length < 8) return phone;
        // Hide 4 central digits
        // 923 123 456 -> 923 **** 56
        return `${clean.substring(0, 3)} **** ${clean.substring(clean.length - 2)}`;
    };

    const filteredTransactions = useMemo(() => {
        if (!userProfile) return [];
        return transactions.filter(t => {
            if (activeFilter === 'Todas') return true;
            if (activeFilter === 'Saídas') return t.sender_id === userProfile.id;
            if (activeFilter === 'Recebidas') return t.receiver_id === userProfile.id;
            return true;
        });
    }, [transactions, activeFilter, userProfile]);

    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: P2PTransaction[] } = {};
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        filteredTransactions.forEach(t => {
            const date = new Date(t.created_at);
            let label = '';

            if (date.toDateString() === today.toDateString()) {
                label = 'HOJE';
            } else if (date.toDateString() === yesterday.toDateString()) {
                label = 'ONTEM';
            } else {
                label = date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' }).toUpperCase();
            }

            if (!groups[label]) groups[label] = [];
            groups[label].push(t);
        });
        return groups;
    }, [filteredTransactions]);

    // Summary calculations for the month
    const monthlyStats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let entradas = 0;
        let saidas = 0;

        transactions.forEach(t => {
            const date = new Date(t.created_at);
            if (date >= startOfMonth && userProfile) {
                if (t.receiver_id === userProfile.id) {
                    entradas += (t.amount - t.fee);
                } else if (t.sender_id === userProfile.id) {
                    saidas += t.amount;
                }
            }
        });

        return { entradas, saidas };
    }, [transactions, userProfile]);

    if (loading && !userProfile) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <SpokeSpinner size="w-12 h-12" color="text-[#00C853]" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-[#0F1111] antialiased pb-20">
            {/* Header */}
            <header className="relative bg-gradient-to-b from-[#00C853] to-[#00C853]/10 pb-6 pt-4 px-4 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90"
                    >
                        <span className="material-symbols-outlined text-white text-[28px]">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-black text-white tracking-tight">Histórico</h1>
                    <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90">
                        <span className="material-symbols-outlined text-white text-[24px]">search</span>
                    </button>
                </div>
            </header>

            <main className="px-5 -mt-4 relative z-20">
                {/* Balance Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-gray-100 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Saldo BP Pay</p>
                            <h2 className="text-3xl font-black tracking-tighter text-[#0F1111]">
                                Kz {userProfile?.balance?.toLocaleString('pt-AO', { minimumFractionDigits: 2 }) || '0,00'}
                            </h2>
                        </div>
                        <div className="size-10 bg-[#00C853]/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#00C853] text-[24px]">account_balance_wallet</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Entradas (Mês)</p>
                            <p className="text-[#00C853] font-black text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">south_west</span>
                                Kz {monthlyStats.entradas.toLocaleString('pt-AO')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Saídas (Mês)</p>
                            <p className="text-black font-black text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">north_east</span>
                                Kz {monthlyStats.saidas.toLocaleString('pt-AO')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => onNavigate('p2p-transfer')}
                    className="w-full bg-[#00C853]/5 border border-[#00C853]/10 rounded-2xl h-14 flex items-center px-4 justify-between mb-8 active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-[#00C853] rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#0F1111] text-[20px] font-bold">send</span>
                        </div>
                        <div className="text-left">
                            <p className="text-[13px] font-black text-[#0F1111] uppercase tracking-wide">ENVIAR</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Transferência instantânea entre contas</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                </button>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['Todas', 'Recebidas', 'Saídas'] as const).map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2.5 rounded-full text-[12px] font-black uppercase tracking-widest transition-all ${activeFilter === filter
                                ? 'bg-[#003816] text-white shadow-lg'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Transaction Legend/Labels (Optional but suggested by image structure) */}
                {/* The image shows grouped by HOJE, ONTEM */}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <SpokeSpinner size="w-8 h-8" />
                    </div>
                ) : Object.keys(groupedTransactions).length > 0 ? (
                    Object.keys(groupedTransactions).map(date => (
                        <div key={date} className="mb-6">
                            <p className="text-gray-400 text-[10px] font-black tracking-[0.2em] mb-4 ml-1">{date}</p>
                            <div className="space-y-3">
                                {groupedTransactions[date].map(t => {
                                    const isSender = t.sender_id === userProfile?.id;
                                    const finalAmount = t.amount - t.fee;
                                    const otherParty = isSender ? t.receiver : t.sender;
                                    const otherPhone = otherParty?.phone ? maskPhone(otherParty.phone) : 'Usuário BP';

                                    return (
                                        <div key={t.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-50 shadow-sm active:scale-[0.99] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isSender ? 'bg-gray-50' : 'bg-[#00C853]/10'}`}>
                                                    <span className={`material-symbols-outlined text-[24px] ${isSender ? 'text-gray-400' : 'text-[#00C853]'}`}>
                                                        {isSender ? 'shopping_bag' : 'arrow_downward'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-bold text-[#0F1111] leading-tight mb-0.5">
                                                        {isSender ? 'Transferência Enviada' : 'Transferência Recebida'}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 font-medium">
                                                        {isSender ? `Para: ${otherPhone}` : `De: ${otherPhone}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[15px] font-black ${isSender ? 'text-black' : 'text-[#00C853]'}`}>
                                                    {isSender ? '-' : '+'} Kz {finalAmount.toLocaleString('pt-AO')}
                                                </p>
                                                <p className="text-[10px] text-gray-300 font-medium">
                                                    {new Date(t.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                {isSender && (
                                                    <p className="text-[9px] text-red-400 font-bold uppercase mt-1">Taxa: Kz {t.fee.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">history</span>
                        <p className="font-black uppercase tracking-[0.2em] text-[12px] text-gray-400">Nenhum registro encontrado</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HistoricoP2P;
