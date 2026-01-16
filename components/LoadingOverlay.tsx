
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-black/80 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center justify-center min-w-[140px] max-w-[280px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
                {status === 'loading' ? (
                    <SpokeSpinner size="w-12 h-12" className="text-white" />
                ) : config && (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`size-16 rounded-full flex items-center justify-center ${config.bgColor} border ${config.borderColor} animate-in zoom-in duration-500`}>
                            <span className={`material-symbols-outlined text-4xl ${config.iconColor}`}>
                                {config.icon}
                            </span>
                        </div>
                        {message && (
                            <p className="text-white text-base font-bold animate-in fade-in slide-in-from-bottom duration-500">
                                {message}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingOverlay;

