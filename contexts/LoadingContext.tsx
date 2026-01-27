
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
    const [status, setStatus] = useState<FeedbackStatus>('idle');
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
        setTimeout(reset, 2500);
    }, [reset]);

    const sanitiseError = (error: any): string => {
        const errorMessage = typeof error === 'string' ? error : (error.message || '');
        const lowMsg = errorMessage.toLowerCase();

        // 1. Auth Mapping
        if (lowMsg.includes('invalid login credentials') || lowMsg.includes('user not found') || lowMsg.includes('invalid credentials')) {
            return "Dados de acesso incorretos. Verifique e tente novamente.";
        }
        if (lowMsg.includes('email not confirmed')) {
            return "Por favor, confirme seu cadastro.";
        }
        if (lowMsg.includes('token') || lowMsg.includes('jwt') || lowMsg.includes('auth') || lowMsg.includes('unauthorized') || lowMsg.includes('session expired') || lowMsg.includes('not logged in')) {
            return "SessÃ£o expirada. Por favor, acesse sua conta novamente.";
        }

        // 2. Business Logic
        if (lowMsg.includes('insufficient') || lowMsg.includes('balance') || lowMsg.includes('funds')) {
            return "Saldo insuficiente para esta operaÃ§Ã£o.";
        }
        if (lowMsg.includes('duplicate') || lowMsg.includes('already exists') || lowMsg.includes('already processed')) {
            return "Esta aÃ§Ã£o jÃ¡ foi realizada anteriormente.";
        }
        if (lowMsg.includes('user already registered')) {
            return "Este nÃºmero de telefone jÃ¡ estÃ¡ em uso.";
        }
        if (lowMsg.includes('limit') || lowMsg.includes('exceeded')) {
            return "Limite operacional atingido. Tente mais tarde.";
        }
        if (lowMsg.includes('invalid') && (lowMsg.includes('deposit') || lowMsg.includes('withdrawal'))) {
            return "Os dados informados para a transaÃ§Ã£o sÃ£o invÃ¡lidos.";
        }

        // 3. Technical Error Masking (Crucial for Security)
        const technicalPatterns = [
            /sql/i, /database/i, /invalid input/i, /syntax error/i, /unexpected /i,
            /fetch/i, /network/i, /cors/i, /table/i, /schema/i, /column/i,
            /relation/i, /row/i, /procedure/i, /rpc/i, /postgrest/i, /violates/i
        ];

        if (technicalPatterns.some(p => p.test(errorMessage))) {
            return "ServiÃ§o temporariamente indisponÃ­vel. Nossa equipe tÃ©cnica jÃ¡ foi notificada.";
        }

        // Safe Fallback
        if (errorMessage && errorMessage.length < 80 && !/[{}<>|\\/]/.test(errorMessage)) {
            return errorMessage;
        }

        return "Ocorreu um erro no processamento. Por favor, tente em instantes.";
    };

    const showError = useCallback((msg: any) => {
        const safeMsg = sanitiseError(msg);
        setStatus('error');
        setMessage(safeMsg);
        setTimeout(reset, 4000);
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
        const now = Date.now();
        if (failureCount > 2) {
            const delay = Math.min(failureCount * 800, 4000);
            const timeSinceLastFailure = now - lastFailureTime;
            if (timeSinceLastFailure < delay) {
                await new Promise(resolve => setTimeout(resolve, delay - timeSinceLastFailure));
            }
        }

        showLoading();
        try {
            const p = typeof promise === 'function' ? promise() : promise;
            const result = await p;

            setFailureCount(0);
            setLastFailureTime(0);

            if (successMsg) {
                showSuccess(successMsg);
            } else {
                reset();
            }
            return result;
        } catch (error: any) {
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


