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
            showToast?.('Por favor, selecione uma imagem válida.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showToast?.('A imagem deve ter no máximo 2MB.', 'error');
            return;
        }

        showLoading();
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

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
            showToast?.('O nome completo não pode estar vazio.', 'warning');
            return;
        }

        setSaving(true);
        try {
            await withLoading(async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Usuário não autenticado');

                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        avatar_url: avatarUrl,
                    })
                    .eq('id', user.id);

                if (error) throw error;
            }, 'Configurações atualizadas com sucesso!');

            onNavigate('profile');
        } catch (error: any) {
            showToast?.(error.message || 'Erro ao salvar configurações.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_O5s3g5eF50cs5tQ_zh2NLwLYFyqEHtdcmZQASWBXJmsfG9k1wREC0IVW-eylYq2qw9Wumxb3YSS9L8wyFWSAANAxg0weMoxNXY5GHUshMgmu4w9sjeIyoflSKaECFCwFS1gStIJMDr7wVpnTKZtIpcTAH9dvh6Gana_Pw0-htT1Q9DdTGiPGHpfWu0oZKbmwz9Siq4VzRFUsXmwkyVAA2EOn-fhlHOMblENj8rod3pTqjUbUouxH6s1qZ6ZAEvzMM3z9YeCoHvE0",
    ];


    return (
        <div className="flex flex-col min-h-screen bg-background-dark font-display text-black antialiased">
            <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 pb-2 border-b border-gray-200">
                <button
                    onClick={() => onNavigate('profile')}
                    className="text-primary flex size-12 shrink-0 items-center justify-start hover:bg-white/5 rounded-full transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h2 className="text-black text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
                    Configurações
                </h2>
            </header>

            <main className="flex-1 flex flex-col px-6 pt-8 pb-32 space-y-8">
                <section className="flex flex-col items-center">
                    <div className="relative mb-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                        <div
                            className="size-24 rounded-full border-4 border-[#f4c025] shadow-lg bg-center bg-cover bg-no-repeat overflow-hidden transition-transform group-hover:scale-105"
                            style={{ backgroundImage: `url("${avatarUrl || avatars[0]}")` }}
                        ></div>
                        <div className="absolute bottom-0 right-0 bg-primary text-black size-8 rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:bg-primary/90">
                            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avatar do Perfil</p>
                </section>

                <section className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Nome Completo</label>
                        <div className="relative flex items-center bg-white rounded-2xl border border-gray-200 p-4 focus-within:border-primary transition-all shadow-sm">
                            <span className="material-symbols-outlined text-primary mr-3">person</span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-black placeholder:text-gray-300 focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 opacity-60">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Telefone (Não editável)</label>
                        <div className="relative flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-4 shadow-inner">
                            <span className="material-symbols-outlined text-gray-400 mr-3">phone</span>
                            <input
                                type="text"
                                value={profile?.phone || ''}
                                disabled
                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-400 focus:ring-0"
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Segurança e Acesso</h3>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {[
                            { label: 'Senha login', action: () => onNavigate('change-password'), icon: 'lock_reset' },
                            { label: 'PIN de Retirada', action: () => onNavigate('withdraw-password'), icon: 'pin' },
                            { label: 'Alterar PIN de Retirada', action: () => onNavigate('update-withdraw-password'), icon: 'lock_person' },
                        ].map((link, i, arr) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">{link.icon}</span>
                                    <span className="text-sm font-bold">{link.label}</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-500 ml-1">Conta e Suporte</h3>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {[
                            { label: 'Detalhes de Conta', action: () => onNavigate('detalhes-conta'), icon: 'account_circle' },
                            { label: 'Suporte', action: () => onNavigate('support'), icon: 'support_agent' },
                            { label: 'Relatar Problema', action: () => onNavigate('report'), icon: 'report_problem' },
                        ].map((link, i, arr) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">{link.icon}</span>
                                    <span className="text-sm font-bold">{link.label}</span>
                                </div>
                                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full h-14 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-gray-900"
                    >
                        {saving ? <SpokeSpinner size="w-5 h-5" className="text-white" /> : 'Salvar Alterações'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Settings;
