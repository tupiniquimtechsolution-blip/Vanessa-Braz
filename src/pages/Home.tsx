import { Link } from 'react-router-dom';
import { Calendar, Star, ChevronDown, ChevronUp, MapPin, Clock, Phone, Instagram, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { services, faqItems, testimonials, businessInfo } from '../lib/data';
import { heroImage, galleryImages, detailImages, environmentImages } from '../lib/media';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* ═══════════════════════════════════════════
          HERO — Full-bleed editorial com foto real
         ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-end">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Vanessa Braz — Beleza & Autoestima"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
          <div className="max-w-2xl">
            <p className="text-white/70 text-sm uppercase tracking-[0.2em] mb-4 font-light">
              Beleza & Autoestima
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-light leading-[1.1] mb-6">
              Vanessa Braz
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg font-light">
              Cuidado profissional para realçar sua beleza natural com técnica, 
              produtos de qualidade e atendimento humanizado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-text font-medium rounded-none hover:bg-white/90 transition-all group"
              >
                <Calendar size={18} />
                Agendar Horário
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/${businessInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/40 text-white font-medium rounded-none hover:bg-white/10 transition-all"
              >
                <Phone size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Explorar</span>
          <div className="w-px h-8 bg-white/30 animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MANIFESTO — Sobre a marca
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={detailImages[0]}
                  alt="Detalhe de procedimento"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-6">
                Nossa Essência
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-text font-light leading-tight mb-8">
                Beleza que transforma, cuidado que acolhe.
              </h2>
              <div className="space-y-6 text-brand-muted leading-relaxed">
                <p>
                  Cada atendimento é uma experiência pensada para você. Combinamos técnica 
                  refinada, produtos selecionados e um ambiente acolhedor para que você se 
                  sinta cuidada em cada detalhe.
                </p>
                <p>
                  Acreditamos que beleza é autoestima. E autoestima se constrói com cuidado 
                  genuíno, atenção individual e resultados que falam por si.
                </p>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <Link
                  to="/servicos"
                  className="text-brand-text font-medium underline underline-offset-4 hover:text-brand-primary transition-colors"
                >
                  Conheça os serviços →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVIÇOS — Layout editorial assimétrico
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-4">
                Serviços
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-text font-light">
                Tratamentos especializados
              </h2>
            </div>
            <Link
              to="/servicos"
              className="mt-6 md:mt-0 text-brand-text font-medium underline underline-offset-4 hover:text-brand-primary transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {/* Featured services — editorial layout */}
          <div className="grid md:grid-cols-2 gap-px bg-brand-surface">
            {services.slice(0, 4).map((service, idx) => (
              <div
                key={service.id}
                className={`bg-white p-8 md:p-12 group hover:bg-brand-surface/30 transition-colors ${
                  idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                }`}
              >
                <div className="flex flex-col h-full">
                  <span className="text-xs uppercase tracking-wider text-brand-accent mb-4">
                    {service.category}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-brand-text font-light mb-4">
                    {service.name}
                  </h3>
                  <p className="text-brand-muted leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-brand-surface">
                    <div>
                      <span className="text-2xl font-light text-brand-text">
                        R$ {service.price}
                      </span>
                      <span className="text-sm text-brand-muted ml-2">
                        · {service.duration}min
                      </span>
                    </div>
                    <Link
                      to={`/agendar?service=${service.id}`}
                      className="text-sm font-medium text-brand-text underline underline-offset-4 hover:text-brand-primary transition-colors"
                    >
                      Agendar →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GALERIA EDITORIAL — Proporções variadas
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-4">
              Resultados Reais
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-text font-light">
              Nosso trabalho fala por si
            </h2>
          </div>

          {/* Bento grid editorial */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[200px] md:auto-rows-[250px]">
            {/* Large feature */}
            <div className="col-span-2 row-span-2 overflow-hidden">
              <img
                src={galleryImages[0]?.src}
                alt={galleryImages[0]?.alt}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Regular items */}
            {galleryImages.slice(1, 7).map((img, idx) => (
              <div key={idx} className="overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/galeria"
              className="inline-flex items-center gap-2 px-8 py-4 border border-brand-text text-brand-text font-medium hover:bg-brand-text hover:text-white transition-all"
            >
              Ver galeria completa
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BASTIDORES — Full-bleed com vídeo/imagem
         ═══════════════════════════════════════════ */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={environmentImages[0]}
          alt="Ambiente Vanessa Braz"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <p className="text-sm uppercase tracking-[0.3em] mb-4 text-white/70">
              Ambiente
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-light mb-6">
              Um espaço pensado para você
            </h2>
            <p className="text-white/80 text-lg font-light">
              Conforto, privacidade e atmosfera acolhedora em cada detalhe.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DEPOIMENTOS — Sem inventar, apenas reais
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-4">
              Depoimentos
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-text font-light">
              O que nossas clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {testimonials.map((t) => (
              <div key={t.id} className="text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-accent text-brand-accent" />
                  ))}
                </div>
                <p className="text-brand-muted leading-relaxed mb-6 italic font-light">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-medium text-brand-text">{t.name}</p>
                  <p className="text-xs text-brand-muted mt-1">{t.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ — Accordion minimalista
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-brand-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-4">
              Dúvidas
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-brand-text font-light">
              Perguntas frequentes
            </h2>
          </div>

          <div className="divide-y divide-brand-surface">
            {faqItems.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                  aria-expanded={openFaq === idx}
                >
                  <span className="text-brand-text font-medium pr-8 group-hover:text-brand-primary transition-colors">
                    {item.question}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp size={20} className="text-brand-accent flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-brand-muted flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="pb-6 animate-fade-in">
                    <p className="text-brand-muted leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA FINAL — Conversão
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-brand-text">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white font-light mb-6">
            Pronta para se cuidar?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto font-light">
            Agende seu horário e descubra uma experiência de beleza pensada para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agendar"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-brand-text font-medium hover:bg-white/90 transition-all"
            >
              <Calendar size={18} />
              Agendar Agora
            </Link>
            <a
              href={`https://wa.me/${businessInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/30 text-white font-medium hover:bg-white/10 transition-all"
            >
              <Phone size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LOCALIZAÇÃO — Info + mapa placeholder
         ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-accent text-sm uppercase tracking-[0.2em] mb-4">
                Localização
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-brand-text font-light mb-8">
                Venha nos visitar
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-brand-text font-medium">Endereço</p>
                    <p className="text-brand-muted text-sm mt-1">
                      {businessInfo.address || 'PENDENTE_DE_CONFIRMAÇÃO'}
                    </p>
                    <p className="text-brand-muted text-sm">
                      {businessInfo.city}, {businessInfo.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-brand-text font-medium">Horários</p>
                    <p className="text-brand-muted text-sm mt-1">Seg a Sex: 9h – 19h/20h</p>
                    <p className="text-brand-muted text-sm">Sábado: 9h – 16h</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Instagram size={20} className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-brand-text font-medium">Instagram</p>
                    <p className="text-brand-muted text-sm mt-1">{businessInfo.instagram}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-square bg-brand-surface flex items-center justify-center">
              <p className="text-brand-muted text-sm">
                Mapa — INTEGRATION_PENDING
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
