import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Loader2, Sparkles } from 'lucide-react';
import { BorderBeamInput } from './ui/BorderBeamInput';
import { formatPhoneNumber } from '../utils/formatters';
import { submitApplication } from '../services/supabaseClient';
import { CheckoutModal } from './CheckoutModal';

type ExperienceLevel = 'Iniciante' | 'Intermediário' | 'Avançado' | '';
type NetworkingPain = 'Encontrar parceiros estratégicos' | 'Acessar novos mercados' | 'Ambiente de confiança para CEOs' | 'Escalar operação' | '';
type OpportunityCost = 'Sim, o crescimento é lento' | 'Parcialmente' | 'Não, meu network atende' | '';

export interface PokerFormData {
  fullName: string;
  whatsapp: string;
  companyRole: string;
  instagram: string;
  experienceLevel: ExperienceLevel;
  networkingPain: NetworkingPain;
  opportunityCost: OpportunityCost;
  allInGoal: string;
}

const INITIAL_DATA: PokerFormData = {
  fullName: '',
  whatsapp: '',
  companyRole: '',
  instagram: '',
  experienceLevel: '',
  networkingPain: '',
  opportunityCost: '',
  allInGoal: ''
};

export const PokerApplicationForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PokerFormData>(INITIAL_DATA);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (field: keyof PokerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleSelectAndNext = (field: keyof PokerFormData, value: string) => {
    updateForm(field, value);
    setTimeout(nextStep, 400); // Small delay to see selection before transitioning
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitApplication({
        name: formData.fullName,
        phone: formData.whatsapp,
        email: 'poker@nghub.com',
        sector: formData.companyRole,
        instagram: formData.instagram,
        pain_point: formData.networkingPain,
        origin: 'NG.POKER App',
      });
      nextStep(); // Go to step 6 (Checkout)
    } catch (error) {
      console.error(error);
      nextStep(); // Mostra checkout mesmo em caso de erro de rede
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutSuccess = () => {
    setDirection(1);
    setStep(7); // Tela de confirmação final
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim().length > 3 && formData.whatsapp.length > 13 && formData.companyRole.trim().length > 2 && formData.instagram.trim().length > 2;
      case 5:
        return formData.allInGoal.trim().length > 5;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background Radial Glow mimicking Poker Table lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-ngGold-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Navbar Minimalista com Logo NGHUB */}
      <header className="w-full p-6 flex justify-center sm:justify-start relative z-10">
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          <img src="/logo.png" alt="NG.HUB" className="h-8 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div className="hidden sm:block w-[1px] h-6 bg-white/20"></div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-ngGold-500" />
            <span className="font-serif tracking-[0.2em] font-bold text-lg text-white">NG.POKER</span>
          </div>
          <div className="hidden sm:block w-[1px] h-6 bg-white/20"></div>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-md">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngGold-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ngGold-500"></span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">Maceió Hold'em Club</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-3xl mx-auto relative z-10 pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8 flex flex-col items-center"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold leading-tight tracking-tight mt-4">
                Mais do que um <span className="text-transparent bg-clip-text bg-gradient-to-r from-ngGold-400 to-ngGold-600">jogo.</span>
              </h1>
              
              <p className="text-base sm:text-xl text-white/40 font-light max-w-xl leading-relaxed">
                Uma mesa onde as cartas são apenas o pretexto para o seu próximo grande negócio. Vagas Limitadas para o dia 02/05.
              </p>

              <button
                onClick={nextStep}
                className="mt-8 px-10 py-5 rounded-2xl bg-gradient-to-r from-ngGold-600 to-ngGold-400 text-black font-bold uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(200,155,60,0.3)] animate-breathe"
              >
                Iniciar Aplicação
              </button>
            </motion.div>
          )}

          {step > 0 && step < 6 && (
            <motion.div
              key={`step-${step}`}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50, filter: 'blur(5px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#0A0A0A]/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 sm:p-12 shadow-2xl relative"
            >
              <div className="mb-8">
                <span className="text-ngGold-500 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">
                  Etapa {step} de 5
                </span>

                {/* Step 1: Identificação */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      Para começarmos, quem é você na mesa?
                    </h2>
                    <div className="space-y-4 mt-8">
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block ml-2">Nome e Sobrenome</label>
                        <BorderBeamInput 
                          placeholder="Ex: Arthur Galdino" 
                          value={formData.fullName} 
                          onChange={e => updateForm('fullName', e.target.value)} 
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block ml-2">WhatsApp Corporativo</label>
                        <BorderBeamInput 
                          placeholder="(00) 00000-0000" 
                          value={formData.whatsapp} 
                          onChange={e => updateForm('whatsapp', formatPhoneNumber(e.target.value))} 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block ml-2">Sua Empresa e Cargo Atual</label>
                        <BorderBeamInput 
                          placeholder="Ex: NG.HUB - CEO" 
                          value={formData.companyRole} 
                          onChange={e => updateForm('companyRole', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block ml-2">Instagram (Pessoal ou Empresa)</label>
                        <BorderBeamInput 
                          placeholder="Ex: @nghub.os" 
                          value={formData.instagram} 
                          onChange={e => updateForm('instagram', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Nível */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      Qual é o seu nível de experiência nas mesas de Poker?
                    </h2>
                    <div className="grid grid-cols-1 gap-3 mt-8">
                      {['Iniciante', 'Intermediário', 'Avançado'].map(level => (
                        <button
                          key={level}
                          onClick={() => handleSelectAndNext('experienceLevel', level)}
                          className={`
                            p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group
                            ${formData.experienceLevel === level ? 'bg-ngGold-500/10 border-ngGold-500 text-white' : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'}
                          `}
                        >
                          <span className="text-lg font-light tracking-wide">{level}</span>
                          <div className={`w-2 h-2 rounded-full transition-all ${formData.experienceLevel === level ? 'bg-ngGold-500 shadow-[0_0_10px_#C89B3C]' : 'bg-transparent'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Dor */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      No mundo dos negócios, seu network dita o seu net worth. Qual é o seu maior gargalo hoje?
                    </h2>
                    <div className="grid grid-cols-1 gap-3 mt-8">
                      {['Encontrar parceiros estratégicos', 'Acessar novos mercados', 'Ambiente de confiança para CEOs', 'Escalar operação'].map(pain => (
                        <button
                          key={pain}
                          onClick={() => handleSelectAndNext('networkingPain', pain)}
                          className={`
                            p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group
                            ${formData.networkingPain === pain ? 'bg-ngGold-500/10 border-ngGold-500 text-white' : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'}
                          `}
                        >
                          <span className="text-lg font-light tracking-wide">{pain}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Oportunidade */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      Seja honesto: você sente que a falta de um ecossistema fechado está fazendo você deixar dinheiro na mesa?
                    </h2>
                    <div className="grid grid-cols-1 gap-3 mt-8">
                      {['Sim, o crescimento é lento', 'Parcialmente', 'Não, meu network atende'].map(cost => (
                        <button
                          key={cost}
                          onClick={() => handleSelectAndNext('opportunityCost', cost)}
                          className={`
                            p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between group
                            ${formData.opportunityCost === cost ? 'bg-ngGold-500/10 border-ngGold-500 text-white' : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'}
                          `}
                        >
                          <span className="text-lg font-light tracking-wide">{cost}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: All-In */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                      Se o NG.POKER te colocar na mesma mesa que seus próximos 3 maiores clientes ou parceiros, o que você estaria buscando fechar?
                    </h2>
                    <div className="mt-8">
                      <BorderBeamInput 
                        as="textarea"
                        placeholder="Ex: Busco investidores para minha rodada seed, ou sócios de tecnologia para uma nova vertical..." 
                        value={formData.allInGoal} 
                        onChange={e => updateForm('allInGoal', e.target.value)} 
                        autoFocus
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation Bar inside the form */}
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest font-bold transition-colors"
                >
                  Voltar
                </button>

                <button
                  onClick={step === 5 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className={`
                    px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all duration-300
                    ${isStepValid() ? 'bg-white text-black hover:bg-ngGold-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-white/5 text-white/20 cursor-not-allowed'}
                  `}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (step === 5 ? 'All-in!' : 'Próximo')}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Checkout */}
          {step === 6 && (
            <CheckoutModal
              key="step-6"
              onSuccess={handleCheckoutSuccess}
              userName={formData.fullName}
            />
          )}

          {/* Step 7: Confirmação Final */}
          {step === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg mx-auto bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/8 rounded-[36px] p-8 sm:p-12 shadow-2xl relative text-center overflow-hidden"
            >
              {/* Glow top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ngGold-500/40 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-ngGold-500/6 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                {/* Ícone animado */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mx-auto w-20 h-20 bg-ngGold-500/10 border border-ngGold-500/20 rounded-full flex items-center justify-center mb-7"
                >
                  <CheckCircle2 className="w-10 h-10 text-ngGold-400" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ngGold-500/8 border border-ngGold-500/20 mb-5">
                    <Sparkles className="w-3 h-3 text-ngGold-500" />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-ngGold-400 font-bold">Acesso Ativado</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4 leading-tight">
                    Bem-vindo à mesa,{' '}
                    <span className="text-ngGold-400">{formData.fullName.split(' ')[0]}</span>.
                  </h2>

                  <p className="text-white/35 text-sm font-light mb-10 max-w-sm mx-auto leading-relaxed">
                    Sua aplicação foi registrada e o pagamento está sendo verificado. Nossa equipe entrará em contato via WhatsApp com as instruções finais para a sua cadeira.
                  </p>

                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngGold-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-ngGold-500"></span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">Fique atento ao seu WhatsApp</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
