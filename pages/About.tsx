
import React from 'react';

interface AboutProps {
  onNavigate: (page: any) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="bg-background-dark font-display text-black antialiased min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        {/* Top App Bar */}
        <div className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-brand-border">
          <button
            onClick={() => onNavigate('profile')}
            className="text-primary flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-surface-dark transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-text-primary text-lg font-bold leading-tight tracking-tight flex-1 text-center">Transparência Legal</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-0 pt-0">
          <div
            className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden h-[250px]"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(28, 28, 28, 0) 0%, rgba(28, 28, 28, 0.4) 50%, rgba(28, 28, 28, 0.8) 100%), url("/amazon_legal_hero.png")'
            }}
          >
            <div className="flex flex-col p-6 z-10">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-black tracking-widest text-text-primary uppercase bg-primary rounded-full w-fit">Institucional</span>
              <h1 className="text-white tracking-tight text-4xl font-black leading-tight drop-shadow-md">amazon</h1>
            </div>
          </div>
        </div>

        {/* Introduction Text */}
        <div className="px-6 py-4">
          <p className="text-text-secondary text-base font-normal leading-relaxed">
            Documentação oficial e registros regulatórios da amazon. Garantindo a máxima segurança e conformidade em todas as operações em Kz.
          </p>
        </div>

        {/* Status Chips */}
        <div className="flex gap-3 px-6 pb-6 flex-wrap">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-success-bg border border-success-text/10 px-4">
            <span className="material-symbols-outlined text-success-text text-[20px]">check_circle</span>
            <p className="text-success-text text-sm font-bold">Instituição Verificada</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-brand-border px-4 shadow-sm">
            <span className="material-symbols-outlined text-text-secondary text-[20px]">account_balance</span>
            <p className="text-text-primary text-sm font-bold">BFA Partner</p>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="px-6 grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface-dark rounded-xl p-4 flex flex-col gap-1 border border-brand-border shadow-sm">
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">NIF</p>
            <p className="text-text-primary text-base font-bold">5417382910</p>
          </div>
          <div className="bg-surface-dark rounded-xl p-4 flex flex-col gap-1 border border-brand-border shadow-sm">
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest">REGISTRO</p>
            <p className="text-text-primary text-base font-bold">0284/2024</p>
          </div>
        </div>

        {/* Headquarter Card */}
        <div className="px-6 mb-6">
          <div className="flex items-stretch justify-between gap-4 rounded-xl bg-surface-dark p-4 shadow-lg border border-brand-border">
            <div className="flex flex-col justify-center gap-1 flex-[2_2_0px]">
              <p className="text-text-primary text-lg font-extrabold leading-tight tracking-tight">Sede Social</p>
              <p className="text-text-secondary text-sm font-medium leading-normal">Edifício Chicala, Luanda, Angola</p>
              <div className="mt-2 flex items-center gap-1 text-primary text-sm font-black uppercase tracking-wider text-[10px]">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span>Ver no mapa</span>
              </div>
            </div>
            <div
              className="w-full bg-center bg-no-repeat aspect-square max-w-[100px] bg-cover rounded-lg flex-1 border border-white/10"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCY6ukuV31utW1QRDX6aQjwpWWPQrUEBRS1npApsWW7mvTaUUkRKvlW7GqI9wH7HTbMyPEfy9g6T8fZquBHHW3cntQg4QpXFAx7nbYQwAAGuwU_d-OB0I0nHCm2FgEzeBh13hZLdiUUecRiNPFMb6seUwmtLHtQmX-WbNsB4_mli_di69AsZmfbsgSzh8v3A56b_0NKV__g-pER3lusLDnBy5_Rj0pRYXjTgzXXUJ0z65pOyjp-TWoLO_GLN2II0wI3hk4gRADSpL2L")' }}
            ></div>
          </div>
        </div>

        {/* Document Section Header */}
        <div className="px-6 flex items-center justify-between mb-4 mt-2">
          <h3 className="text-black text-xl font-bold">Documentos Oficiais</h3>
          <span className="text-primary text-sm font-semibold cursor-pointer">Ver todos</span>
        </div>

        {/* Document List */}
        <div className="flex flex-col gap-4 px-6 pb-8">
          <DocumentItem
            title="Certificado de Admissibilidade"
            subtitle="Emitido pela Conservatória"
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuD3h28KhuHm7RXiwQJZaPqCQP-vNy-t3rSkl54D2dGOKLrstCQ31yFOmUmTR5oM_p51UFn_iFiWhdoIkoxPV_B62Y7xcobeMglq77XoKQTntn9Uw-EJgO0Aakb66h8OU9FGl64bpxL8VyANil-K5Mxw5PLVvLuaPUF76MmjY2B5A1FjLsmyfjLxmiWwrEKPNSBWT4n9QaHixtCfUji29byHOP38SniFshFn1043bLn0LNfvsmcMNwdYP6K116vUBMaxk2W0kMyzLA75"
          />
          <DocumentItem
            title="Registro Comercial"
            subtitle="Cadastro Geral de Entidades"
            img="https://lh3.googleusercontent.com/aida-public/AB6AXuCM6KqsbeJ0iffxGp5mA37sjRUv4Mz4cdECe4MkVhpBoPeiWuTQvp-o2K0TSX5bke6B6FhTDfTml1aWLGvejQT7UnRbYpbYBHc1lSGcnd_p4FbfTjkQYy_wZOWwJufyr4k_NTCRxR6WCBJ-RqknpDGX9DQ9S4II_P8e_KoeNCZcTidQRG-GUmAriVTVPOkmyTUHOshvF4k2CY0mC6mbRWi3tB0vJoAKYNsRnZYb89d37_fJSDLyHtOOKSN9SC2ReVBcir0M1M_G1GJm"
          />
        </div>

        {/* Mission & Values */}
        <div className="px-6 py-4 grid grid-cols-1 gap-4">
          <div className="bg-primary p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
              <span className="material-symbols-outlined text-9xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <h3 className="text-text-primary text-xl font-black mb-2 relative z-10">A Nossa Missão</h3>
            <p className="text-text-primary/80 font-bold leading-tight relative z-10">
              Democratizar o acesso a serviços financeiros de qualidade e produtos globais, conectando cada angolano à economia digital.
            </p>
          </div>
        </div>

        {/* Footer Compliance Text */}
        <div className="mt-4 px-6 pb-40">
          <p className="text-text-secondary text-[11px] leading-relaxed text-center italic">
            A amazon é uma entidade regulada conforme a legislação em vigor na República de Angola. Para mais informações, contacte compliance@amazon.co.ao
          </p>
        </div>

        {/* Sticky Footer CTA */}
        <div className="fixed bottom-0 max-w-md w-full p-4 bg-background-dark/95 backdrop-blur-lg border-t border-brand-border z-40">
          <button
            className="w-full bg-primary hover:bg-primary-hover text-text-primary font-black py-4 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">ios_share</span>
            <span>Exportar Dossiê Legal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentItem = ({ title, subtitle, img }: { title: string, subtitle: string, img: string }) => (
  <div className="group relative overflow-hidden rounded-xl bg-surface-dark border border-brand-border p-3 transition-all active:scale-[0.98] shadow-sm">
    <div className="flex gap-4">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-background-dark shadow-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-text-primary/10 to-transparent"></div>
        <img className="h-full w-full object-cover" src={img} alt={title} />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-text-primary/20">
          <span className="material-symbols-outlined text-white">zoom_in</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center py-1">
        <h4 className="text-text-primary font-bold text-base leading-tight">{title}</h4>
        <p className="text-text-secondary text-xs mt-1">{subtitle}</p>
        <div className="mt-3 flex gap-2">
          <button className="bg-primary px-4 py-1.5 rounded-lg text-text-primary text-[10px] font-black hover:bg-primary-hover transition-colors shadow-sm">VISUALIZAR</button>
          <button className="bg-background-dark px-4 py-1.5 rounded-lg text-text-primary text-[10px] font-bold border border-brand-border hover:bg-surface-dark transition-colors">DOWNLOAD</button>
        </div>
      </div>
    </div>
  </div>
);

export default About;
