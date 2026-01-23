import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useLoading } from '../contexts/LoadingContext';

interface ChangeWithdrawPinProps {
    onBack: () => void;
}

const ChangeWithdrawPin: React.FC<ChangeWithdrawPinProps> = ({ onBack }) => {
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const { showLoading, hideLoading, showToast } = useLoading();

    const handleUpdatePin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPin !== confirmPin) {
            showToast('Os PINs não coincidem.', 'error');
            return;
        }

        if (!/^\d{4}$/.test(newPin)) {
            showToast('O PIN deve ter exatamente 4 dígitos numéricos.', 'error');
            return;
        }

        showLoading();
        try {
            const { data, error } = await supabase.rpc('update_withdrawal_pin', {
                p_new_pin: newPin
            });

            if (error) throw error;

            showToast('PIN de retirada atualizado com sucesso!', 'success');
            onBack();
        } catch (error: any) {
            console.error('Error updating PIN:', error);
            showToast(error.message || 'Erro ao atualizar PIN.', 'error');
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
                <h1 className="text-lg font-bold text-gray-900">Alterar PIN de Retirada</h1>
                <div className="w-10" />
            </div>

            <div className="p-4 max-w-md mx-auto w-full">
                <form onSubmit={handleUpdatePin} className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Novo PIN (4 dígitos)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="****"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Novo PIN</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="****"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        Atualizar PIN
                    </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-xl font-variation-icon-fill">security</span>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Importante: Este PIN será solicitado em todas as suas solicitações de retirada. Não compartilhe com ninguém.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeWithdrawPin;
