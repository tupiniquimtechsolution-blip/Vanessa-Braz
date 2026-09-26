import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Instagram, MessageCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrency } from '../lib/store';
import { detailImages } from '../lib/media';
import { loadCatalog, type CatalogService } from '../lib/catalog';
import { businessInfo, isPublicHandleConfigured, isWhatsAppConfigured } from '../lib/data';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [services, setServices] = useState<CatalogService[]>([]);

  useEffect(() => {
    void loadCatalog().then((catalog) => setServices(catalog.services));
  }, []);

  const categories = [...new Set(services.map((item) => item.category))];
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((item) => item.category === activeCategory);

  const whatsappUrl = isWhatsAppConfigured(businessInfo.whatsapp)
    ? `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de conhecer os serviços disponíveis, valores e horários.')}`
    : null;

  return (
    <div>
      <section className="bg-brand-background pb-12 pt-20 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-brand-accent">Serviços</p>
            <h1 className="mb-6 font-display text-4xl font-light leading-tight text-brand-text md:text-5xl lg:text-6xl">
              Catálogo de serviços
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-muted">
              Serviços, preços e duração são publicados somente quando confirmados. Para receber a disponibilidade atual, fale pelos canais oficiais.
            </p>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="sticky top-16 z-40 border-b border-brand-surface bg-white/95 backdrop-blur-sm md:top-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto py-4">
              <button
                onClick={() => setActiveCategory('all')}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'border-b-2 border-brand-text text-brand-text'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'border-b-2 border-brand-text text-brand-text'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="mx-auto max-w-4xl border border-brand-surface bg-brand-cream/60 p-8 md:p-12">
              <div className="flex h-12 w-12 items-center justify-center border border-brand-wine/20 bg-white text-brand-wine">
                <Sparkles size={21} />
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-brand-wine">Atendimento personalizado</p>
              <h2 className="mt-3 font-display text-3xl font-light text-brand-text md:text-4xl">Catálogo em atualização</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-muted md:text-base">
                Consulte diretamente os serviços disponíveis, valores, duração e horários. Assim você recebe a informação atual e confirma o atendimento pelo canal oficial.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-wine px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-primary"
                  >
                    <MessageCircle size={17} /> Consultar no WhatsApp
                  </a>
                )}
                {isPublicHandleConfigured(businessInfo.instagram) && (
                  <a
                    href={businessInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-brand-text/15 px-6 py-3.5 text-sm text-brand-text transition hover:border-brand-wine hover:text-brand-wine"
                  >
                    <Instagram size={17} /> Ver Instagram
                  </a>
                )}
                <Link to="/galeria" className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm text-brand-wine">
                  Ver portfólio <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-brand-surface">
              {filteredServices.map((service, idx) => (
                <div
                  key={service.id}
                  className="group grid items-center gap-6 py-10 md:grid-cols-12 md:gap-12 md:py-14"
                >
                  <div className="order-2 md:order-1 md:col-span-4">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={detailImages[idx % detailImages.length]}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="order-1 md:order-2 md:col-span-7 md:col-start-6">
                    <span className="mb-3 block text-xs uppercase tracking-wider text-brand-accent">{service.category}</span>
                    <h2 className="mb-4 font-display text-2xl font-light text-brand-text md:text-3xl lg:text-4xl">{service.name}</h2>
                    <p className="mb-6 max-w-lg leading-relaxed text-brand-muted">{service.description}</p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-light text-brand-text">{formatCurrency(service.price)}</span>
                        <span className="flex items-center gap-1 text-sm text-brand-muted"><Clock size={14} /> {service.duration} min</span>
                      </div>
                      <Link
                        to={`/agendar?service=${service.id}`}
                        className="group/link inline-flex items-center gap-2 text-sm font-medium text-brand-text underline underline-offset-4 transition-colors hover:text-brand-primary"
                      >
                        Agendar este serviço
                        <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
