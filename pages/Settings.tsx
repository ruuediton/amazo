import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';
import SpokeSpinner from '../components/SpokeSpinner';

interface Props {
    onNavigate: (page: any) => void;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    profile: any;
}

const Settings: React.FC<Props> = ({ onNavigate, showToast, profile }) => {
    const { withLoading, showLoading, hideLoading } = useLoading();
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast?.('Por favor, selecione uma imagem vÃ¡lida.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showToast?.('A imagem deve ter no mÃ¡ximo 2MB.', 'error');
            return;
        }

        showLoading();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('UsuÃ¡rio nÃ£o autenticado');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setAvatarUrl(publicUrl);
            showToast?.('Avatar carregado com sucesso!', 'success');
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            showToast?.(error.message || 'Erro ao carregar avatar.', 'error');
        } finally {
            hideLoading();
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            showToast?.('O nome completo nÃ£o pode estar vazio.', 'warning');
            return;
        }

        setSaving(true);
        try {
            await withLoading(async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('UsuÃ¡rio nÃ£o autenticado');

                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        avatar_url: avatarUrl,
                    })
                    .eq('id', user.id);

                if (error) throw error;
            }, 'ConfiguraÃ§Ãµes atualizadas com sucesso!');

            onNavigate('profile');
        } catch (error: any) {
            showToast?.(error.message || 'Erro ao salvar configuraÃ§Ãµes.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const avatars = [
        "/default_avatar.png",
    ];


    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-black antialiased">
            {/* Standard Header - Original Style */}
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
                    <h1 className="text-xl font-black text-white tracking-tight">Configurações</h1>
                    <div className="w-11"></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col px-5 pt-5 relative z-20 pb-24">

                {/* Personal Information Section - Compact */}
                <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-green-900/5 border border-gray-50 mb-5 text-center">
                    <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-[#00C853] text-[32px]">manage_accounts</span>
                    </div>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[1.5px] mb-4">Informações Pessoais</h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                            <div className="bg-[#F8FAF8] rounded-xl h-12 flex items-center px-4 gap-3 border border-transparent focus-within:border-[#00C853]/20 transition-all">
                                <span className="material-symbols-outlined text-[#00C853] text-[20px]">person</span>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome completo"
                                    className="bg-transparent flex-1 h-full outline-none text-[#111] font-bold placeholder:text-gray-400 text-[13px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 text-left opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Telefone da Conta</label>
                            <div className="bg-gray-50 rounded-xl h-12 flex items-center px-4 gap-3 border border-gray-100">
                                <span className="material-symbols-outlined text-gray-400 text-[20px]">phone_iphone</span>
                                <input
                                    type="text"
                                    value={profile?.phone || ''}
                                    disabled
                                    className="bg-transparent flex-1 h-full outline-none text-gray-400 font-bold text-[13px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Sections - More Compact Items */}
                <div className="space-y-6">
                    <section>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[1.5px] mb-3 ml-1">Segurança</h3>
                        <div className="grid gap-2">
                            {[
                                { label: 'Senha de Acesso', action: () => onNavigate('change-password'), icon: 'lock_open' },
                                { label: 'Definir PIN de Saque', action: () => onNavigate('withdraw-password'), icon: 'vibration' },
                                { label: 'Alterar PIN Atual', action: () => onNavigate('update-withdraw-password'), icon: 'security' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full flex items-center justify-between p-3 bg-[#F8FAF8] hover:bg-[#00C853] hover:text-white rounded-xl transition-all active:scale-[0.98] group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#00C853] group-hover:bg-white/20 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                        </div>
                                        <span className="text-[13px] font-bold">{item.label}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-white/50 text-[18px]">chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[1.5px] mb-3 ml-1">Outros</h3>
                        <div className="grid gap-2">
                            {[
                                { label: 'Dados Bancários', action: () => onNavigate('detalhes-conta'), icon: 'account_balance' },
                                { label: 'Centro de Ajuda', action: () => onNavigate('support'), icon: 'live_help' },
                                { label: 'Termos e Regras', action: () => onNavigate('system-rules'), icon: 'gavel' },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full flex items-center justify-between p-3 bg-[#F8FAF8] hover:bg-[#00C853] hover:text-white rounded-xl transition-all active:scale-[0.98] group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#00C853] group-hover:bg-white/20 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                        </div>
                                        <span className="text-[13px] font-bold">{item.label}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-white/50 text-[18px]">chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Compact Save Button */}
                <div className="pt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-14 bg-[#00C853] text-white rounded-2xl font-black text-[15px] tracking-tight active:scale-95 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2 hover:bg-[#00a844]"
                    >
                        {saving ? <SpokeSpinner size="w-5 h-5" className="text-white" /> : 'Salvar Alterações'}
                    </button>
                    <p className="text-center text-gray-400 text-[10px] font-medium mt-3 uppercase tracking-widest opacity-60">Pressione para atualizar</p>
                </div>
            </main >
        </div >
    );
};

export default Settings;

