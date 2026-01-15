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

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning',
    };

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
            <div className={`${bgColors[type]} flex items-center gap-3 p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md`}>
                <span className="material-symbols-outlined text-black text-2xl">
                    {icons[type]}
                </span>
                <p className="text-black font-bold text-sm leading-tight flex-1">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="text-black/60 hover:text-black transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>
        </div>
    );
};

export default Toast;
