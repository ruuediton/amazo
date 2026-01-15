import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
    withLoading: <T>(promise: Promise<T> | (() => Promise<T>)) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [counter, setCounter] = useState(0);

    const showLoading = () => {
        setCounter(prev => {
            const newCount = prev + 1;
            if (newCount === 1) setIsLoading(true);
            return newCount;
        });
    };

    const hideLoading = () => {
        setCounter(prev => {
            const newCount = Math.max(0, prev - 1);
            if (newCount === 0) setIsLoading(false);
            return newCount;
        });
    };

    const withLoading = async <T,>(promise: Promise<T> | (() => Promise<T>)): Promise<T> => {
        showLoading();
        try {
            const p = typeof promise === 'function' ? promise() : promise;
            return await p;
        } finally {
            hideLoading();
        }
    };

    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
            {children}
            <LoadingOverlay isVisible={isLoading} />
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
