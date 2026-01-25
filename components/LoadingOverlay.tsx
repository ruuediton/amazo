
import React from 'react';
import SpokeSpinner from './SpokeSpinner';
import { FeedbackStatus } from '../contexts/LoadingContext';

interface LoadingOverlayProps {
    status: FeedbackStatus;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status, message }) => {
    if (status === 'idle') return null;

    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: 'check_circle',
                    iconColor: 'text-success-text',
                    bgColor: 'bg-success-bg/20',
                    borderColor: 'border-success-text/20'
                };
            case 'error':
                return {
                    icon: 'error',
                    iconColor: 'text-error-text',
                    bgColor: 'bg-error-bg/20',
                    borderColor: 'border-error-text/20'
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: 'text-warning-text',
                    bgColor: 'bg-warning-bg/20',
                    borderColor: 'border-warning-text/20'
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-[2px] animate-in fade-in duration-300 ${status === 'loading' ? 'bg-white/10' : 'bg-black/30'}`}>
            {status === 'loading' ? (
                <div className="flex flex-col items-center justify-center p-6 bg-white/80 rounded-3xl shadow-xl border border-white/20 animate-in zoom-in-95 duration-300">
                    <SpokeSpinner size="w-10 h-10" color="text-[#FF9900]" />
                </div>
            ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-[24px] p-5 flex flex-col items-center justify-center w-fit max-w-[85vw] border border-white/30 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center justify-center text-center gap-3">
                        {config && (
                            <div className={`size-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-[28px] ${config.iconColor}`}>
                                    {config.icon}
                                </span>
                            </div>
                        )}
                        {message && (
                            <p className="text-slate-900 text-[13px] font-bold leading-snug px-2 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-[240px]">
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;

