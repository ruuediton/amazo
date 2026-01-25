import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';

interface ChangeLoginPasswordProps {
    onBack: () => void;
}

const ChangeLoginPassword: React.FC<ChangeLoginPasswordProps> = ({ onBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showLoading, hideLoading, showToast } = useLoading();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast('As senhas não coincidem.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast('Por favor digite senha de 6 caracteres', 'error');
            return;
        }

        showLoading();
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            showToast('Atualização sucedida!', 'success');
            onBack();
        } catch (error: any) {
            console.error('Error updating password:', error);
            showToast(error.message || 'Erro ao atualizar senha.', 'error');
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 h-16 flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-600">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-gray-900">Alterar Senha de Login</h1>
                <div className="w-10" />
            </div>

            <div className="p-4 max-w-md mx-auto w-full">
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all"
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all"
                                placeholder="Repita a nova senha"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        Atualizar Senha
                    </button>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-yellow-600 text-xl font-variation-icon-fill">info</span>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                            Dica: Use uma senha forte com letras e números. Após a alteração, você poderá usar a nova senha em seu próximo login.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeLoginPassword;
