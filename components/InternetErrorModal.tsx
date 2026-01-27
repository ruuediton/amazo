
import React from 'react';

interface InternetErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const InternetErrorModal: React.FC<InternetErrorModalProps> = ({ isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container do Modal / Bottom Sheet */}
      <div
        className="w-full max-w-[340px] bg-white rounded-t-[24px] sm:rounded-[24px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 p-6 pb-8 mx-4 mb-4 sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ConteÃºdo do Erro */}
        <div className="flex flex-col items-center">
          <div className="mb-5 flex items-center justify-center size-20 rounded-full bg-[#FFFBEB]">
            <span className="material-symbols-outlined text-[#FCD34D] text-5xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>
              wifi_off
            </span>
          </div>

          <h3 className="text-black tracking-tight text-[22px] font-bold leading-tight text-center pb-3">
            Erro de Internet
          </h3>
          <p className="text-[#64748B] text-sm font-medium leading-relaxed text-center px-2 mb-8">
            A ligaÃ§Ã£o demorou demasiado tempo. Verifique a sua rede e tente novamente.
          </p>

          {/* Divisor Decorativo (Opcional, removido para limpar o design light) */}

          {/* Grupo de BotÃµes */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onRetry}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-[#FCD34D] text-[#181711] text-sm font-bold active:scale-[0.97] transition-all shadow-md shadow-[#FCD34D]/20 hover:bg-[#fbbf24]"
            >
              Tentar Novamente
            </button>
            <button
              onClick={onClose}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 bg-[#F1F5F9] text-[#0F172A] text-sm font-bold active:scale-[0.97] transition-all hover:bg-[#E2E8F0]"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternetErrorModal;

