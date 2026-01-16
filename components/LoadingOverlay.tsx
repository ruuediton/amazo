
import React from 'react';
import SpokeSpinner from './SpokeSpinner';

interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-black/70 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                <SpokeSpinner size="w-10 h-10" className="text-white" />
            </div>
        </div>
    );
};

export default LoadingOverlay;
