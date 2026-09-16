import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { businessInfo, isPendingValue, isPublicHandleConfigured, isWhatsAppConfigured } from '../lib/data';

export default function Contact() {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Entre em Contato
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Canais confirmados aparecem abaixo. O restante permanece PENDENTE_DE_CONFIRMACAO.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {isWhatsAppConfigured(businessInfo.whatsapp) ? (
            <a
              href={`https://wa.me/${businessInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-brand-surface hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-brand-text mb-1">WhatsApp</h3>
              <p className="text-sm font-medium text-green-600 mt-2">Enviar mensagem →</p>
            </a>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-brand-surface">
              <h3 className="font-semibold text-brand-text mb-1">WhatsApp</h3>
              <p className="text-sm text-brand-muted">PENDENTE_DE_CONFIRMACAO</p>
            </div>
          )}

          {isPublicHandleConfigured(businessInfo.instagram) ? (
            <a
              href={`https://instagram.com/${businessInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-brand-surface hover:border-pink-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Instagram size={24} className="text-pink-600" />
              </div>
              <h3 className="font-semibold text-brand-text mb-1">Instagram</h3>
              <p className="text-sm text-brand-muted">{businessInfo.instagram}</p>
            </a>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-brand-surface">
              <h3 className="font-semibold text-brand-text mb-1">Instagram</h3>
              <p className="text-sm text-brand-muted">PENDENTE_DE_CONFIRMACAO</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <Phone size={24} className="text-brand-primary" />
            </div>
            <h3 className="font-semibold text-brand-text mb-1">Telefone</h3>
            <p className="text-sm text-brand-muted">{isPendingValue(businessInfo.phone) ? 'PENDENTE_DE_CONFIRMACAO' : businessInfo.phone}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <Mail size={24} className="text-brand-primary" />
            </div>
            <h3 className="font-semibold text-brand-text mb-1">E-mail</h3>
            <p className="text-sm text-brand-muted">{isPendingValue(businessInfo.email) ? 'PENDENTE_DE_CONFIRMACAO' : businessInfo.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-brand-primary" />
              <h3 className="font-semibold text-brand-text">Localização</h3>
            </div>
            <p className="text-sm text-brand-muted">PENDENTE_DE_CONFIRMACAO</p>
            <div className="mt-4 h-40 bg-brand-surface/50 rounded-xl flex items-center justify-center">
              <p className="text-xs text-brand-muted">Mapa — INTEGRATION_PENDING (Google Maps)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-brand-primary" />
              <h3 className="font-semibold text-brand-text">Horários de Funcionamento</h3>
            </div>
            <p className="text-sm text-brand-muted">PENDENTE_DE_CONFIRMACAO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
