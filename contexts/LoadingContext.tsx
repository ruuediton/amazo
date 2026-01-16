
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

export type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning';

interface LoadingContextType {
    status: FeedbackStatus;
    message: string | null;
    showLoading: () => void;
    hideLoading: () => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    reset: () => void;
    withLoading: <T>(promise: Promise<T> | (() => Promise<T>), successMsg?: string, errorMsg?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<FeedbackStatus>('loading');
    const [message, setMessage] = useState<string | null>(null);
    const [failureCount, setFailureCount] = useState(0);
    const [lastFailureTime, setLastFailureTime] = useState(0);

    const reset = useCallback(() => {
        setStatus('idle');
        setMessage(null);
    }, []);


    const showLoading = useCallback(() => {
        setStatus('loading');
        setMessage(null);
    }, []);

    const hideLoading = useCallback(() => {
        setStatus('idle');
        setMessage(null);
    }, []);

    const showSuccess = useCallback((msg: string) => {
        setStatus('success');
        setMessage(msg);
        setTimeout(reset, 3000);
    }, [reset]);

    const sanitiseError = (error: any): string => {
        const technicalPatterns = [
            /sql/i, /database/i, /invalid input/i, /syntax error/i, /unexpected /i,
            /fetch/i, /network/i, /cors/i, /token/i, /jwt/i, /auth/i, /unauthorized/i
        ];

        const errorMessage = typeof error === 'string' ? error : (error.message || '');

        // Mapeamento específico conforme prompt
        if (technicalPatterns.some(p => p.test(errorMessage))) {
            if (/token|jwt|auth|unauthorized/i.test(errorMessage)) {
                return "Sessão expirada. Por favor, entre novamente.";
            }
            if (/sql|database|unexpected/i.test(errorMessage)) {
                return "Não foi possível concluir a operação. Tente novamente.";
            }
            return "Operação não permitida no momento.";
        }

        return errorMessage || "Ocorreu um erro inesperado";
    };

    const showError = useCallback((msg: any) => {
        const safeMsg = sanitiseError(msg);
        setStatus('error');
        setMessage(safeMsg);
        setTimeout(reset, 3000);
    }, [reset]);

    const showWarning = useCallback((msg: any) => {
        const safeMsg = sanitiseError(msg);
        setStatus('warning');
        setMessage(safeMsg);
        setTimeout(reset, 3000);
    }, [reset]);

    const withLoading = async <T,>(
        promise: Promise<T> | (() => Promise<T>),
        successMsg?: string,
        errorMsg?: string
    ): Promise<T> => {
        // Anti-abuso: Delay progressivo em caso de falhas consecutivas
        const now = Date.now();
        if (failureCount > 0) {
            const delay = Math.min(failureCount * 1000, 5000); // Até 5 segundos
            const timeSinceLastFailure = now - lastFailureTime;
            if (timeSinceLastFailure < delay) {
                await new Promise(resolve => setTimeout(resolve, delay - timeSinceLastFailure));
            }
        }

        showLoading();
        try {
            const p = typeof promise === 'function' ? promise() : promise;
            const result = await p;

            // Sucesso: Reseta contador de falhas
            setFailureCount(0);
            setLastFailureTime(0);

            if (successMsg) {
                showSuccess(successMsg);
            } else {
                reset();
            }
            return result;
        } catch (error: any) {
            // Falha: Incrementa contador e regista horário
            setFailureCount(prev => prev + 1);
            setLastFailureTime(Date.now());

            const msg = errorMsg || sanitiseError(error);
            showError(msg);
            throw error;
        }
    };



    return (
        <LoadingContext.Provider value={{
            status,
            message,
            showLoading,
            hideLoading,
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

