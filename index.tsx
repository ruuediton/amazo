
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoadingProvider } from './contexts/LoadingContext';
import { NetworkProvider } from './contexts/NetworkContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <NetworkProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </NetworkProvider>
  </React.StrictMode>
);
