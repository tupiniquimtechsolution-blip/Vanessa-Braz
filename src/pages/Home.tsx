import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Instagram,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  businessInfo,
  faqItems,
  isPublicHandleConfigured,
  isWhatsAppConfigured,
} from '../lib/data';
import { detailImages, galleryImages, treatedHairImages } from '../lib/media';
import { loadCatalog, type CatalogService } from '../lib/catalog';
import { formatCurrency } from '../lib/store';

const showcaseImages = treatedHairImages.slice(0, 6);

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [services, setServices] = useState<CatalogService[]>([]);

  useEffect(() => {
    void loadCatalog().then((catalog) => setServices(catalog.services));
  }, []);

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
              O site reúne o portfólio real de Vanessa Braz, informações confirmadas e acesso ao agendamento quando o serviço estiver disponível no catálogo.
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
                <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">Conteúdo</span>
                <span className="mt-1 block text-sm text-white/75">Sem dados inventados</span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-7">
            <div className="salon-panel relative ml-auto max-w-[680px] p-2 sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5] xl:aspect-[5/6]">
                <img
                  src={showcaseImages[0]}
                  alt="Cabelo finalizado — acervo Vanessa Braz"
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">Portfólio real</p>
                    <p className="mt-1 max-w-xs text-sm text-white/70">Seleção editorial com foco no acabamento final do cabelo.</p>
                  </div>
                  <span className="hidden border border-white/20 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/60 backdrop-blur sm:block">
                    Acervo
                  </span>
                </div>
              </div>
            </div>

            {showcaseImages[1] && (
              <div className="absolute -bottom-7 -left-2 hidden w-[38%] border border-white/10 bg-brand-night p-2 shadow-2xl lg:block xl:-left-10">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={showcaseImages[1]}
                    alt="Cabelo finalizado — detalhe do acervo"
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
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">Informação clara, sem preencher lacunas com ficção.</h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/45">
                O catálogo real aparece aqui conforme serviços, duração e preço forem confirmados na fonte de dados do projeto.
              </p>
            </div>

            <div className="lg:col-span-8">
              {services.length === 0 ? (
                <div className="border border-white/10 bg-white/[0.025] p-7 md:p-10">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-brand-accent">Catálogo</p>
                  <h3 className="mt-3 font-display text-2xl font-light">PENDENTE_DE_CONFIRMACAO</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
                    Nenhum serviço, preço ou duração foi inventado apenas para preencher o layout. Assim que o catálogo confirmado estiver disponível, esta área será alimentada automaticamente.
                  </p>
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

              <div className="mt-8">
                <Link to="/servicos" className="inline-flex items-center gap-2 text-sm text-brand-secondary transition hover:text-white">
                  Ver página de serviços <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream text-brand-text">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Acabamento em foco</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-light md:text-5xl">Na vitrine pública, apenas cabelos já tratados e finalizados.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-brand-muted">
              Fotos de processo com cabelo desalinhado permanecem preservadas no acervo, mas foram retiradas da seleção padrão do site.
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
                  <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.18em] text-white/65">Acervo Vanessa Braz</span>
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
              <div className="aspect-[3/4] overflow-hidden border border-white/10">
                <img src={detailImages[0]} alt="Detalhe de cabelo finalizado" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-12 aspect-[3/4] overflow-hidden border border-white/10">
                <img src={detailImages[1]} alt="Detalhe de cabelo finalizado" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="flex items-center lg:col-span-6 lg:col-start-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-secondary">Direção visual</p>
              <h2 className="mt-4 font-display text-4xl font-light md:text-5xl">Inspirado na experiência do template Clandestine, sem importar o conteúdo fictício.</h2>
              <p className="mt-6 text-sm leading-relaxed text-white/50 md:text-base">
                A referência orienta ritmo, contraste, navegação e composição. Nomes, equipe, serviços, preços, depoimentos, produtos, horários e dados comerciais do template não são reutilizados aqui.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/50 md:text-base">
                No projeto Vanessa Braz, informação real permanece separada de placeholder e qualquer item ainda não confirmado continua explicitamente pendente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Portfólio</p>
              <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Uma galeria mais limpa, focada no que deve ser mostrado.</h2>
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-muted">
              Respostas limitadas ao que está confirmado no projeto. Informações comerciais não validadas não são preenchidas por conveniência visual.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="divide-y divide-brand-text/10 border-y border-brand-text/10">
              {faqItems.map((item, index) => (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-medium text-brand-text">{item.question}</span>
                    {openFaq === index ? <ChevronUp size={19} className="shrink-0 text-brand-wine" /> : <ChevronDown size={19} className="shrink-0 text-brand-muted" />}
                  </button>
                  {openFaq === index && (
                    <div className="animate-fade-in pb-6 pr-10 text-sm leading-relaxed text-brand-muted">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-wine text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-brand-secondary">Próximo passo</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-light md:text-6xl">Conheça o portfólio e use apenas os canais reais do projeto.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            O fluxo de agendamento do sistema é real quando o backend estiver configurado; dados não confirmados continuam bloqueados ou marcados como pendentes.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/agendar" className="inline-flex items-center justify-center gap-2 bg-brand-cream px-7 py-4 text-sm font-semibold text-brand-wine transition hover:bg-white">
              <Calendar size={18} /> Agendar horário
            </Link>
            {isWhatsAppConfigured(businessInfo.whatsapp) && (
              <a
                href={`https://wa.me/${businessInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm text-white/75 transition hover:border-white/50 hover:text-white"
              >
                <Phone size={18} /> WhatsApp
              </a>
            )}
            {isPublicHandleConfigured(businessInfo.instagram) && (
              <a
                href={businessInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-sm text-white/75 transition hover:border-white/50 hover:text-white"
              >
                <Instagram size={18} /> Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
