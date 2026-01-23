import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    isOpen: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const borderColors = {
        success: 'border-green-100',
        error: 'border-red-100',
        info: 'border-blue-100',
        warning: 'border-yellow-100',
    };

    const textColors = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-blue-600',
        warning: 'text-yellow-600',
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning',
    };

    return (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-[90vw] animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
            <div className={`bg-white/90 backdrop-blur-md flex items-center gap-3 py-2.5 px-4 rounded-full shadow-lg border ${borderColors[type]} flex-nowrap min-w-[200px]`}>
                <span className={`material-symbols-outlined ${textColors[type]} text-xl shrink-0`}>
                    {icons[type]}
                </span>
                <p className="text-slate-800 font-bold text-[13px] leading-tight flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 flex items-center"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        </div>
    );
};

export default Toast;
