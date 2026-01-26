import React, { useEffect } from 'react';

interface StatusModalProps {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
    onClose: () => void;
    onSupport?: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
    isOpen,
    type,
    title,
    message,
    onClose,
    onSupport
}) => {
    // Auto‑close after 4 seconds
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getStatusConfig = () => {
        switch (type) {
            case 'success':
                return {
                    color: 'bg-success-bg',
                    shadow: 'shadow-success-text/10',
                    icon: 'check',
                    iconColor: 'text-success-text',
                    title: 'Sucesso!',
                    branding: 'SmartBuy SUCCESS'
                };
            case 'warning':
                return {
                    color: 'bg-warning-bg',
                    shadow: 'shadow-warning-text/10',
                    icon: 'warning',
                    iconColor: 'text-warning-text',
                    title: 'Aviso!',
                    branding: 'SmartBuy WARNING'
                };
            case 'info':
                return {
                    color: 'bg-primary/20',
                    shadow: 'shadow-primary/10',
                    icon: 'info',
                    iconColor: 'text-primary',
                    title: 'Informação',
                    branding: 'SmartBuy INFO'
                };
            case 'error':
            default:
                return {
                    color: 'bg-error-bg',
                    shadow: 'shadow-error-text/10',
                    icon: 'priority_high',
                    iconColor: 'text-error-text',
                    title: 'Erro!',
                    branding: 'SmartBuy ERROR'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[200] px-4 bg-black/40 backdrop-blur-[2px]">
            <div
                className="w-fit max-w-[300px] flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-lg border border-white/30 rounded-[28px] p-6 animate-in zoom-in-95 duration-300 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Status Icon */}
                <div className={`size-12 rounded-full flex items-center justify-center mb-4 ${config.color} ${config.shadow}`}>
                    <span className={`material-symbols-outlined text-[24px] font-bold ${config.iconColor}`}>
                        {config.icon}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-text-primary text-lg font-bold tracking-tight mb-2">
                    {title || config.title}
                </h2>

                {/* Message */}
                <p className="text-slate-700 text-[13px] font-bold leading-relaxed mb-6 px-2 max-w-[240px]">
                    {message}
                </p>

                {/* Branding Pill */}
                <div className="bg-background-dark rounded-full px-4 py-1.5 border border-brand-border">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        {config.branding}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
