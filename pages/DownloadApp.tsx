import React from 'react';

interface DownloadAppProps {
    onNavigate: (page: any) => void;
}

const DownloadApp: React.FC<DownloadAppProps> = ({ onNavigate }) => {
    const handleDownload = () => {
        // Logic to download the APK file
        // For now, we can link to a placeholder or the actual file if provided
        const link = document.createElement('a');
        link.href = '/app-release.apk'; // Assuming the APK is in the public folder or similar
        link.download = 'Amazoning.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-background-dark min-h-screen pb-24 font-display text-black">
            <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-gray-200 px-4 py-4 flex items-center">
                <button
                    onClick={() => onNavigate('profile')}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-primary"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center font-bold text-lg text-black">Baixar Aplicativo</h1>
                <div className="w-10"></div>
            </header>

            <main className="px-6 py-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mb-8 ring-4 ring-primary/10">
                    <span className="material-symbols-outlined text-primary text-5xl">install_mobile</span>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black mb-3 text-black tracking-tight">Leve o Amazoning com você</h2>
                    <p className="text-gray-600 text-sm max-w-[280px] mx-auto leading-relaxed">
                        Acesse seus investimentos de qualquer lugar com nossa experiência nativa.
                    </p>
                </div>

                <div className="w-full space-y-4 mb-12">
                    {/* APK Only - Removed Google Play and App Store as requested */}
                    <div className="bg-surface-dark p-1 rounded-3xl shadow-2xl border border-gray-200">
                        <div className="bg-background-dark rounded-[20px] p-5 flex items-center justify-between border border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                    <span className="material-symbols-outlined text-3xl">android</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-black">Arquivo APK</h3>
                                    <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wider mt-0.5">Versão Android</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="flex items-center bg-black text-white hover:bg-gray-800 px-5 py-2.5 rounded-xl text-xs font-black transition-colors active:scale-95"
                            >
                                BAIXAR <span className="material-symbols-outlined text-base ml-1.5">download</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="w-full bg-surface-dark rounded-3xl p-8 border border-gray-200 shadow-xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary">info</span>
                        </div>
                        <h3 className="font-black text-xs uppercase tracking-widest text-black/70">Como instalar (APK)</h3>
                    </div>
                    <div className="space-y-8">
                        <div className="flex items-start space-x-5 relative">
                            <div className="absolute left-[11px] top-8 bottom-[-20px] w-0.5 bg-gray-200"></div>
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black z-10">1</div>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium pt-0.5">Clique no botão <span className="text-black font-bold">"Baixar"</span> acima para iniciar o download do arquivo.</p>
                        </div>
                        <div className="flex items-start space-x-5 relative">
                            <div className="absolute left-[11px] top-8 bottom-[-20px] w-0.5 bg-gray-200"></div>
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black z-10">2</div>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium pt-0.5">Após o download, toque no arquivo e habilite a opção <span className="text-black font-bold">"Instalar apps desconhecidos"</span>.</p>
                        </div>
                        <div className="flex items-start space-x-5">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black z-10">3</div>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium pt-0.5">Siga as instruções na tela para concluir a instalação e aproveitar!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500 font-medium">
                        Precisa de ajuda? <button onClick={() => onNavigate('support')} className="text-primary font-bold hover:underline ml-1">Fale com o suporte</button>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DownloadApp;
