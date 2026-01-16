
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
            <div className="bg-black/70 backdrop-blur-md p-5 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[130px] max-w-[80vw] w-fit border border-white/5 shadow-2xl animate-in zoom-in-95 duration-300 mx-4">
                {status === 'loading' ? (
                    <SpokeSpinner size="w-9 h-9" className="text-white/80" />
                ) : config && (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className={`size-12 rounded-full flex items-center justify-center ${config.bgColor} border ${config.borderColor} animate-in zoom-in duration-500`}>
                            <span className={`material-symbols-outlined text-2xl ${config.iconColor}`}>
                                {config.icon}
                            </span>
                        </div>
                        {message && (
                            <p className="text-white/90 text-[13px] font-semibold leading-snug animate-in fade-in slide-in-from-bottom duration-500 px-1">
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

