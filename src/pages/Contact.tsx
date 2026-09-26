import { ExternalLink, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import {
  businessInfo,
  businessMapsUrl,
  businessPhoneUrl,
  isPublicHandleConfigured,
  isWhatsAppConfigured,
} from '../lib/data';

export default function Contact() {
  const whatsappUrl = isWhatsAppConfigured(businessInfo.whatsapp)
    ? `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de informações e de agendar um horário.')}`
    : null;

  return (
    <div className="bg-brand-background py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Contato</p>
          <h1 className="mt-3 font-display text-4xl font-light text-brand-text md:text-5xl">Entre em contato</h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
            Fale pelos canais oficiais para consultar serviços, valores, disponibilidade e confirmar seu atendimento.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-brand-surface bg-white p-6 transition hover:border-green-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center bg-green-50 transition-transform group-hover:scale-105">
                <MessageCircle size={24} className="text-green-600" />
              </div>
              <h2 className="font-semibold text-brand-text">WhatsApp</h2>
              <p className="mt-1 text-sm text-brand-muted">{businessInfo.phone}</p>
              <p className="mt-3 text-sm font-medium text-green-600">Enviar mensagem →</p>
            </a>
          )}

          {isPublicHandleConfigured(businessInfo.instagram) && (
            <a
              href={businessInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-brand-surface bg-white p-6 transition hover:border-pink-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center bg-pink-50 transition-transform group-hover:scale-105">
                <Instagram size={24} className="text-pink-600" />
              </div>
              <h2 className="font-semibold text-brand-text">Instagram</h2>
              <p className="mt-1 text-sm text-brand-muted">{businessInfo.instagram}</p>
              <p className="mt-3 text-sm font-medium text-pink-600">Abrir perfil →</p>
            </a>
          )}

          <a
            href={businessPhoneUrl}
            className="group border border-brand-surface bg-white p-6 transition hover:border-brand-secondary hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center bg-brand-secondary/20 transition-transform group-hover:scale-105">
              <Phone size={24} className="text-brand-primary" />
            </div>
            <h2 className="font-semibold text-brand-text">Telefone</h2>
            <p className="mt-1 text-sm text-brand-muted">{businessInfo.phone}</p>
            <p className="mt-3 text-sm font-medium text-brand-primary">Ligar →</p>
          </a>

          <a
            href={businessMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-brand-surface bg-white p-6 transition hover:border-brand-wine hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center bg-brand-secondary/20 transition-transform group-hover:scale-105">
              <MapPin size={24} className="text-brand-primary" />
            </div>
            <h2 className="font-semibold text-brand-text">Localização</h2>
            <p className="mt-1 text-sm text-brand-muted">{businessInfo.address}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-wine">Abrir no Google Maps <ExternalLink size={14} /></p>
          </a>
        </div>

        <div className="mt-8 border border-brand-surface bg-brand-cream/70 p-6 text-center md:p-8">
          <h2 className="font-display text-2xl font-light text-brand-text">Disponibilidade e horários</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted">
            Confirme os dias e horários disponíveis pelo WhatsApp ou Instagram antes de se deslocar. Assim você recebe a informação mais atual para o atendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
