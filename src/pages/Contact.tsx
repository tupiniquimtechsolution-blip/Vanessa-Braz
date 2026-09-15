import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import { businessInfo } from '../lib/data';

export default function Contact() {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Entre em Contato
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto">
            Estamos aqui para ajudar! Escolha o canal de sua preferência.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
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
            <p className="text-sm text-brand-muted">Resposta rápida</p>
            <p className="text-sm font-medium text-green-600 mt-2">Enviar mensagem →</p>
          </a>

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
            <p className="text-sm font-medium text-pink-600 mt-2">Seguir →</p>
          </a>

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <Phone size={24} className="text-brand-primary" />
            </div>
            <h3 className="font-semibold text-brand-text mb-1">Telefone</h3>
            <p className="text-sm text-brand-muted">{businessInfo.phone}</p>
            <p className="text-xs text-brand-muted mt-2">Horário comercial</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="w-12 h-12 bg-brand-secondary/20 rounded-xl flex items-center justify-center mb-4">
              <Mail size={24} className="text-brand-primary" />
            </div>
            <h3 className="font-semibold text-brand-text mb-1">E-mail</h3>
            <p className="text-sm text-brand-muted">{businessInfo.email}</p>
            <p className="text-xs text-brand-muted mt-2">Respondemos em até 24h</p>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-brand-primary" />
              <h3 className="font-semibold text-brand-text">Localização</h3>
            </div>
            <p className="text-sm text-brand-muted">
              {businessInfo.address || 'PENDENTE_DE_CONFIRMACAO'}
            </p>
            <p className="text-sm text-brand-muted">
              {businessInfo.city}, {businessInfo.state}
            </p>
            <div className="mt-4 h-40 bg-brand-surface/50 rounded-xl flex items-center justify-center">
              <p className="text-xs text-brand-muted">Mapa — INTEGRATION_PENDING (Google Maps)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-brand-surface">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-brand-primary" />
              <h3 className="font-semibold text-brand-text">Horários de Funcionamento</h3>
            </div>
            <div className="space-y-2">
              {[
                { day: 'Segunda', hours: '9h - 19h' },
                { day: 'Terça', hours: '9h - 19h' },
                { day: 'Quarta', hours: '9h - 19h' },
                { day: 'Quinta', hours: '9h - 20h' },
                { day: 'Sexta', hours: '9h - 20h' },
                { day: 'Sábado', hours: '9h - 16h' },
                { day: 'Domingo', hours: 'Fechado' },
              ].map(item => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{item.day}</span>
                  <span className={`font-medium ${item.hours === 'Fechado' ? 'text-brand-danger' : 'text-brand-text'}`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
