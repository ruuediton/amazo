
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

export type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';

interface LoadingContextType {
    status: FeedbackStatus;
    message: string | null;
    showLoading: () => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    reset: () => void;
    withLoading: <T>(promise: Promise<T> | (() => Promise<T>), successMsg?: string, errorMsg?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<FeedbackStatus>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStatus('idle');
        setMessage(null);
    }, []);

    const showLoading = useCallback(() => {
        setStatus('loading');
        setMessage(null);
    }, []);

    const showSuccess = useCallback((msg: string) => {
        setStatus('success');
        setMessage(msg);
        setTimeout(reset, 3000);
    }, [reset]);

    const showError = useCallback((msg: string) => {
        setStatus('error');
        setMessage(msg);
        setTimeout(reset, 3000);
    }, [reset]);

    const showWarning = useCallback((msg: string) => {
        setStatus('warning');
        setMessage(msg);
        setTimeout(reset, 3000);
    }, [reset]);

    const withLoading = async <T,>(
        promise: Promise<T> | (() => Promise<T>),
        successMsg?: string,
        errorMsg?: string
    ): Promise<T> => {
        showLoading();
        try {
            const p = typeof promise === 'function' ? promise() : promise;
            const result = await p;
            if (successMsg) {
                showSuccess(successMsg);
            } else {
                reset();
            }
            return result;
        } catch (error: any) {
            const msg = errorMsg || error.message || "Ocorreu um erro inesperado";
            showError(msg);
            throw error;
        }
    };

    return (
        <LoadingContext.Provider value={{
            status,
            message,
            showLoading,
            showSuccess,
            showError,
            showWarning,
            reset,
            withLoading
        }}>
            {children}
            <LoadingOverlay status={status} message={message || ""} />
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

