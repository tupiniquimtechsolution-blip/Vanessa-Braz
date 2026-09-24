import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Instagram,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  businessInfo,
  faqItems,
  isPublicHandleConfigured,
  isWhatsAppConfigured,
} from '../lib/data';
import { galleryImages, treatedHairImages } from '../lib/media';
import { loadCatalog, type CatalogService } from '../lib/catalog';
import { formatCurrency } from '../lib/store';

const showcaseImages = treatedHairImages.slice(0, 6);

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [services, setServices] = useState<CatalogService[]>([]);

  useEffect(() => {
    void loadCatalog().then((catalog) => setServices(catalog.services));
  }, []);

  const whatsappUrl = isWhatsAppConfigured(businessInfo.whatsapp)
    ? `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de informações e de agendar um horário.')}`
    : null;

  return (
    <div className="overflow-hidden bg-brand-background">
      <section className="salon-grid relative bg-brand-ink text-white">
        <div className="salon-glow mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:min-h-[calc(100vh-88px)] md:py-20 lg:grid-cols-12 lg:px-8">
          <div className="relative z-10 lg:col-span-6 xl:col-span-5">
            <div className="mb-6 inline-flex items-center gap-2 border border-brand-accent/30 bg-brand-accent/10 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-brand-secondary">
              <Sparkles size={13} />
              Beleza & Autoestima
            </div>

            <h1 className="max-w-xl font-display text-5xl font-light leading-[0.98] text-white sm:text-6xl lg:text-7xl xl:text-[5.6rem]">
              Cuidado com presença, identidade e acabamento.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
              Portfólio, canais oficiais e uma seleção de trabalhos da Vanessa Braz com foco em cabelos tratados, finalizados e prontos para inspirar o próximo cuidado.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 bg-brand-accent px-7 py-4 text-sm font-semibold text-brand-ink transition hover:bg-brand-secondary"
              >
                <Calendar size={18} />
                Agendar horário
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/galeria"
                className="inline-flex items-center justify-center gap-2 border border-white/15 px-7 py-4 text-sm font-medium text-white/75 transition hover:border-brand-accent/60 hover:text-white"
              >
                Ver trabalhos
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-brand-ink px-4 py-4">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">Acervo</span>
                <span className="mt-1 block text-sm text-white/75">Fotografia real</span>
              </div>
              <div className="bg-brand-ink px-4 py-4">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">Seleção</span>
                <span className="mt-1 block text-sm text-white/75">Cabelos finalizados</span>
              </div>
              <div className="col-span-2 bg-brand-ink px-4 py-4 sm:col-span-1">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">Atendimento</span>
                <span className="mt-1 block text-sm text-white/75">Canais oficiais</span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-7">
            <div className="salon-panel relative ml-auto max-w-[680px] p-2 sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5] xl:aspect-[5/6]">
                <img
                  src={showcaseImages[0]}
                  alt="Cabelo finalizado do acervo Vanessa Braz"
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">Portfólio</p>
                    <p className="mt-1 max-w-xs text-sm text-white/70">Seleção editorial com foco no acabamento final do cabelo.</p>
                  </div>
                  <span className="hidden border border-white/20 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/60 backdrop-blur sm:block">
                    Vanessa Braz
                  </span>
                </div>
              </div>
            </div>

            {showcaseImages[1] && (
              <div className="absolute -bottom-7 -left-2 hidden w-[38%] border border-white/10 bg-brand-night p-2 shadow-2xl lg:block xl:-left-10">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={showcaseImages[1]}
                    alt="Cabelo finalizado em detalhe"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-brand-night text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-secondary">Serviços</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">Escolha com informação clara e confirmação direta.</h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45">
                Serviços, valores e duração entram no catálogo público somente quando estiverem confirmados. Para informações atuais, use os canais oficiais.
              </p>
            </div>

            <div className="lg:col-span-8">
              {services.length === 0 ? (
                <div className="border border-white/10 bg-white/[0.025] p-7 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-brand-accent">Atendimento</p>
                  <h3 className="mt-3 font-display text-3xl font-light">Catálogo em atualização</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
                    Consulte os serviços disponíveis, valores e horários diretamente com a Vanessa Braz. Assim você recebe a informação atual antes de confirmar seu atendimento.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-secondary"
                      >
                        <MessageCircle size={17} /> Falar no WhatsApp
                      </a>
                    )}
                    <Link
                      to="/servicos"
                      className="inline-flex items-center justify-center gap-2 border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/35 hover:text-white"
                    >
                      Ver página de serviços <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {services.slice(0, 5).map((service, index) => (
                    <Link
                      key={service.id}
                      to={`/agendar?service=${service.id}`}
                      className="group grid gap-4 py-6 transition hover:bg-white/[0.025] md:grid-cols-[56px_1fr_auto] md:items-center md:px-4"
                    >
                      <span className="text-xs text-white/25">0{index + 1}</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-brand-accent">{service.category}</span>
                        <h3 className="mt-1 font-display text-2xl font-light text-white transition group-hover:text-brand-secondary">{service.name}</h3>
                        <p className="mt-2 max-w-2xl text-sm text-white/40">{service.description}</p>
                      </div>
                      <div className="flex items-center gap-5 text-sm text-white/55 md:text-right">
                        <span>{formatCurrency(service.price)}</span>
                        <span className="text-white/25">{service.duration} min</span>
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream text-brand-text">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Acabamento em foco</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-light md:text-5xl">Uma vitrine dedicada ao resultado final.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-brand-muted">
              A seleção pública prioriza cabelos tratados e finalizados para apresentar o portfólio de forma consistente, elegante e fiel ao resultado do atendimento.
            </p>
          </div>

          <div className="grid auto-rows-[210px] grid-cols-2 gap-2 md:auto-rows-[270px] md:grid-cols-12 md:gap-3">
            {showcaseImages.slice(0, 5).map((src, index) => {
              const layout = [
                'col-span-2 row-span-2 md:col-span-5',
                'col-span-1 md:col-span-3',
                'col-span-1 md:col-span-4',
                'col-span-1 md:col-span-4',
                'col-span-1 md:col-span-3',
              ][index];

              return (
                <div key={src} className={`hair-card group relative overflow-hidden bg-brand-surface ${layout}`}>
                  <img src={src} alt={`Cabelo finalizado do acervo — ${index + 1}`} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />
                  <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.18em] text-white/65">Vanessa Braz</span>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/galeria" className="inline-flex items-center gap-2 border border-brand-text/25 px-7 py-3.5 text-sm transition hover:border-brand-wine hover:bg-brand-wine hover:text-white">
              Abrir portfólio completo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-2">
              {showcaseImages.slice(2, 4).map((src, index) => (
                <div key={src} className={`${index === 1 ? 'mt-12' : ''} aspect-[3/4] overflow-hidden border border-white/10`}>
                  <img src={src} alt="Detalhe de cabelo finalizado" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center lg:col-span-6 lg:col-start-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-secondary">Experiência</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">Cuidado que começa na escuta e termina no acabamento.</h2>
              <p className="mt-6 text-sm leading-relaxed text-white/50 md:text-base">
                O site foi organizado para deixar o portfólio em primeiro plano, facilitar o contato e tornar a decisão de agendar mais simples. Informações comerciais são apresentadas somente quando confirmadas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contato" className="inline-flex items-center gap-2 border border-white/15 px-6 py-3 text-sm text-white/75 transition hover:border-brand-accent/50 hover:text-white">
                  Falar com a Vanessa <ArrowRight size={16} />
                </Link>
                {isPublicHandleConfigured(businessInfo.instagram) && (
                  <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 text-sm text-brand-secondary transition hover:text-white">
                    <Instagram size={17} /> Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Portfólio</p>
              <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Resultados selecionados para inspirar seu próximo cuidado.</h2>
            </div>
            <Link to="/galeria" className="hidden items-center gap-2 text-sm text-brand-wine md:inline-flex">
              Ver tudo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {galleryImages.slice(0, 8).map((image, index) => (
              <div
                key={image.src}
                className={`hair-card overflow-hidden bg-brand-surface ${index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-square h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Dúvidas</p>
            <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Perguntas frequentes</h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">
              Informações objetivas para você escolher o melhor canal e confirmar seu atendimento.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="divide-y divide-brand-text/10 border-y border-brand-text/10">
              {faqItems.map((item, index) => {
                const open = openFaq === index;
                return (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="w-full py-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="flex items-center justify-between gap-6">
                      <span className="font-display text-xl font-light text-brand-text">{item.question}</span>
                      {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                    {open && <span className="mt-4 block max-w-2xl text-sm leading-relaxed text-brand-muted">{item.answer}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-wine text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 md:py-24">
          <p className="text-[10px] uppercase tracking-[0.26em] text-brand-secondary">Próximo passo</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-light md:text-5xl">Conheça o portfólio e escolha o canal mais confortável para falar com a Vanessa.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/60">
            Consulte serviços, disponibilidade e valores diretamente pelos canais oficiais antes da confirmação do atendimento.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/agendar" className="inline-flex items-center gap-2 bg-white px-7 py-4 text-sm font-semibold text-brand-wine transition hover:bg-brand-cream">
              <Calendar size={18} /> Agendar horário
            </Link>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/20 px-7 py-4 text-sm text-white transition hover:border-white/45">
                <MessageCircle size={18} /> WhatsApp
              </a>
            )}
            {isPublicHandleConfigured(businessInfo.instagram) && (
              <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-4 text-sm text-white/70 transition hover:text-white">
                <Instagram size={18} /> Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
