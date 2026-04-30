import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Link2,
  ArrowRight,
  Loader2,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

interface CheckoutModalProps {
  onSuccess: () => void;
  userName?: string;
}

type PayMethod = 'pix' | 'link';

const INFINITEPAY_LINK =
  import.meta.env.VITE_PAYMENT_LINK ||
  'https://link.infinitepay.io/artur-galdino-de/VC1DLTAtUg-J8HsqLOZx-150,00';

const PIX_COPIA_COLA =
  import.meta.env.VITE_PIX_KEY ||
  '00020101021126580014br.gov.bcb.pix013660a172e6-9d33-40ae-a112-88a0c7183eca5204000053039865406150.005802BR5920LEONE E G C E S LTDA6006MACEIO62070503***63049259';

const PRICE = 'R$ 150,00';
const PRICE_INT = '150';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onSuccess,
  userName,
}) => {
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const firstName = userName?.split(' ')[0] || 'Jogador';

  const handleLinkPayment = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.open(INFINITEPAY_LINK, '_blank');
      setIsRedirecting(false);
      // Após abrir o link, avisamos que aguardará confirmação
    }, 800);
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_COPIA_COLA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleConfirmPayment = () => {
    onSuccess();
  };

  return (
    <motion.div
      key="checkout"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Glow ambiental */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-ngGold-500/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/8 rounded-[36px] shadow-2xl relative overflow-hidden">
        {/* Borda dourada sutil no topo */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ngGold-500/40 to-transparent" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ngGold-500/8 border border-ngGold-500/20 mb-5">
              <Sparkles className="w-3 h-3 text-ngGold-500" />
              <span className="text-[9px] uppercase tracking-[0.25em] text-ngGold-400 font-bold">
                Sua vaga foi aprovada
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight mb-3">
              Garanta sua cadeira,{' '}
              <span className="text-ngGold-400">{firstName}</span>
            </h2>
            <p className="text-white/35 text-sm font-light max-w-sm mx-auto leading-relaxed">
              Falta apenas um passo. Escolha como deseja ativar o seu acesso ao
              NG.POKER Hold'em Club.
            </p>
          </div>

          {/* Preço em destaque */}
          <div className="flex items-center justify-center gap-1 mb-8">
            <span className="text-ngGold-500 text-xl font-bold mt-1 font-sans">
              R$
            </span>
            <span className="text-5xl font-serif font-bold text-white tracking-tighter">
              {PRICE_INT}
            </span>
            <span className="text-white/30 text-sm ml-1 mt-auto mb-1">,00</span>
          </div>

          {/* Seletor de método */}
          <AnimatePresence mode="wait">
            {method === null ? (
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Botão PIX */}
                <button
                  id="checkout-pix-btn"
                  onClick={() => setMethod('pix')}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/[0.025] hover:bg-ngGold-500/5 hover:border-ngGold-500/30 transition-all duration-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#32BCAD]/10 border border-[#32BCAD]/20 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-5 h-5 text-[#32BCAD]" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm tracking-wide">
                        Pagar via PIX
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">
                        Aprovação instantânea · Qualquer banco
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#32BCAD]/70 bg-[#32BCAD]/8 px-2 py-1 rounded-full border border-[#32BCAD]/15">
                      Instant
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-ngGold-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>

                {/* Botão Link de Pagamento */}
                <button
                  id="checkout-link-btn"
                  onClick={() => setMethod('link')}
                  className="w-full group flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/[0.025] hover:bg-ngGold-500/5 hover:border-ngGold-500/30 transition-all duration-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-ngGold-500/8 border border-ngGold-500/15 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-ngGold-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm tracking-wide">
                        Link InfinityPay
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">
                        Cartão de crédito · Débito · PIX
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-ngGold-500/70 bg-ngGold-500/8 px-2 py-1 rounded-full border border-ngGold-500/15">
                      Todos
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-ngGold-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </motion.div>
            ) : method === 'pix' ? (
              /* ─── PAINEL PIX ─── */
              <motion.div
                key="pix-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* QR Code Container */}
                <div className="relative mb-6">
                  <div className="bg-white p-5 rounded-3xl shadow-[0_0_60px_rgba(197,160,89,0.12)] relative">
                    <img
                      src="/pix-qrcode.png"
                      alt="QR Code PIX"
                      className="w-44 h-44 object-contain mix-blend-multiply"
                      onError={(e) => {
                        // Placeholder elegante caso a imagem não exista ainda
                        const el = e.target as HTMLImageElement;
                        el.style.display = 'none';
                        const parent = el.parentElement!;
                        const placeholder = document.createElement('div');
                        placeholder.className =
                          'w-44 h-44 flex flex-col items-center justify-center gap-2';
                        placeholder.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#32BCAD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="3" height="3" x="5" y="5" rx=".5" fill="#32BCAD"/><rect width="3" height="3" x="16" y="5" rx=".5" fill="#32BCAD"/><rect width="3" height="3" x="5" y="16" rx=".5" fill="#32BCAD"/></svg>
                          <span style="font-size:10px;color:#999;text-align:center;font-family:monospace">QR Code<br/>em breve</span>
                        `;
                        parent.appendChild(placeholder);
                      }}
                    />
                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-ngGold-500/40 rounded-tl-sm" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-ngGold-500/40 rounded-tr-sm" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-ngGold-500/40 rounded-bl-sm" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-ngGold-500/40 rounded-br-sm" />
                  </div>
                </div>

                {/* Chave PIX copiável */}
                <div className="w-full mb-6">
                  <p className="text-[9px] text-white/25 uppercase tracking-[0.3em] text-center mb-2 font-bold">
                    Chave PIX
                  </p>
                  <button
                    id="copy-pix-key"
                    onClick={handleCopyPix}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-ngGold-500/25 transition-all group"
                  >
                    <span className="text-white/50 text-[10px] font-mono tracking-wide leading-relaxed break-all text-left">
                      {PIX_COPIA_COLA.slice(0, 40)}…
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-white/30 group-hover:text-ngGold-400 transition-colors">
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copiar
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Valor */}
                <div className="w-full py-4 px-6 bg-white/[0.025] rounded-2xl border border-white/6 flex items-center justify-between mb-6">
                  <span className="text-white/40 text-xs uppercase tracking-widest font-bold">
                    Valor exato
                  </span>
                  <span className="text-ngGold-400 font-serif font-bold text-xl">
                    {PRICE}
                  </span>
                </div>

                {/* Botão "Já paguei" */}
                <button
                  id="pix-confirm-btn"
                  onClick={handleConfirmPayment}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-white text-black font-bold text-sm hover:bg-ngGold-400 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.06)] active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-5 h-5 opacity-60" />
                  Já realizei o pagamento
                </button>

                <button
                  onClick={() => setMethod(null)}
                  className="mt-4 text-[9px] text-white/20 hover:text-white/50 uppercase tracking-widest font-bold transition-colors"
                >
                  ← Voltar às opções
                </button>
              </motion.div>
            ) : (
              /* ─── PAINEL LINK INFINITYPAY ─── */
              <motion.div
                key="link-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* Card visual do link */}
                <div className="w-full mb-6 p-6 rounded-3xl bg-gradient-to-br from-ngGold-600/10 to-ngGold-500/5 border border-ngGold-500/15 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ngGold-400/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-ngGold-500/15 border border-ngGold-500/25 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-ngGold-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">
                        InfinityPay
                      </div>
                      <div className="text-white/30 text-[10px]">
                        Link de pagamento seguro
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {[
                      { icon: '💳', label: 'Cartão de Crédito / Débito' },
                      { icon: '⚡', label: 'PIX pelo link' },
                      { icon: '🔒', label: 'SSL · Ambiente Criptografado' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 text-white/40 text-xs"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Valor */}
                <div className="w-full py-4 px-6 bg-white/[0.025] rounded-2xl border border-white/6 flex items-center justify-between mb-6">
                  <span className="text-white/40 text-xs uppercase tracking-widest font-bold">
                    Total
                  </span>
                  <span className="text-ngGold-400 font-serif font-bold text-xl">
                    {PRICE}
                  </span>
                </div>

                {/* Botão principal */}
                <button
                  id="infinitypay-link-btn"
                  onClick={handleLinkPayment}
                  disabled={isRedirecting}
                  className="w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-white text-black font-bold text-sm hover:bg-ngGold-400 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.06)] active:scale-[0.98] disabled:opacity-60"
                >
                  {isRedirecting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5 opacity-50" />
                      Ir para o Link de Pagamento
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </>
                  )}
                </button>

                {/* Botão confirmar após pagar pelo link */}
                <button
                  id="link-confirm-btn"
                  onClick={handleConfirmPayment}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-8 rounded-2xl border border-white/8 text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Já paguei, confirmar acesso
                </button>

                <button
                  onClick={() => setMethod(null)}
                  className="mt-4 text-[9px] text-white/20 hover:text-white/50 uppercase tracking-widest font-bold transition-colors"
                >
                  ← Voltar às opções
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust Footer */}
          {method === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-white/15" />
              <span className="text-[9px] text-white/20 uppercase tracking-[0.25em] font-bold">
                Ambiente seguro · InfinityPay Encrypted
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

CheckoutModal.displayName = 'CheckoutModal';
