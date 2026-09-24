import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Instagram, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { businessInfo, isPublicHandleConfigured, isWhatsAppConfigured } from '../lib/data';

export default function Booking() {
  const whatsappUrl = isWhatsAppConfigured(businessInfo.whatsapp)
    ? `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de agendar um horário. Pode me informar os serviços e a disponibilidade?')}`
    : null;

  return (
    <div className="bg-brand-background py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Agendamento</p>
            <h1 className="mt-4 font-display text-5xl font-light leading-[1.02] text-brand-text md:text-6xl">Seu horário começa com uma conversa simples.</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-muted">
              Para garantir que serviços, valores e disponibilidade estejam atualizados, a solicitação de horário é feita pelos canais oficiais da Vanessa Braz.
            </p>

            <div className="mt-8 border border-brand-surface bg-white p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-brand-wine" size={20} />
                <div>
                  <h2 className="font-medium text-brand-text">Confirmação antes da reserva</h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    O horário só deve ser considerado confirmado depois do retorno pelo canal de atendimento. Não envie senhas, documentos ou dados sensíveis por mensagem.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border border-brand-surface bg-white p-7 shadow-sm md:p-10">
              <div className="flex h-12 w-12 items-center justify-center bg-brand-wine text-white">
                <Calendar size={22} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-light text-brand-text">Solicitar um horário</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                Escolha o canal que preferir. Informe o serviço de interesse e os melhores dias ou períodos para você.
              </p>

              <div className="mt-8 space-y-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 bg-brand-wine px-5 py-4 text-white transition hover:bg-brand-primary"
                  >
                    <span className="inline-flex items-center gap-3"><MessageCircle size={20} /> Agendar pelo WhatsApp</span>
                    <ArrowRight size={18} />
                  </a>
                )}

                {isPublicHandleConfigured(businessInfo.instagram) && (
                  <a
                    href={businessInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 border border-brand-text/15 px-5 py-4 text-brand-text transition hover:border-brand-wine hover:text-brand-wine"
                  >
                    <span className="inline-flex items-center gap-3"><Instagram size={20} /> Falar pelo Instagram</span>
                    <ArrowRight size={18} />
                  </a>
                )}
              </div>

              <div className="mt-9 grid gap-4 border-t border-brand-surface pt-8 sm:grid-cols-3">
                {[
                  ['01', 'Conte o que procura', 'Informe o serviço ou resultado desejado.'],
                  ['02', 'Envie sua disponibilidade', 'Compartilhe os melhores dias e períodos.'],
                  ['03', 'Receba a confirmação', 'Aguarde o retorno com horário e informações finais.'],
                ].map(([number, title, text]) => (
                  <div key={number}>
                    <span className="text-[10px] tracking-[0.2em] text-brand-accent">{number}</span>
                    <h3 className="mt-2 text-sm font-semibold text-brand-text">{title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-brand-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 bg-brand-cream px-5 py-4 text-sm text-brand-muted">
              <Sparkles size={17} className="mt-0.5 shrink-0 text-brand-wine" />
              <p>Quando a área digital integrada estiver disponível, o mesmo acesso da plataforma central será usado — sem criar uma segunda conta específica para este site.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/galeria" className="inline-flex items-center gap-2 text-sm text-brand-wine transition hover:text-brand-primary">
            Ver o portfólio antes de agendar <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
