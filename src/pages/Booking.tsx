import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Calendar, Check, Clock, Copy, Instagram, MessageCircle, ShieldCheck, Sparkles, User } from 'lucide-react';
import { businessInfo, isPublicHandleConfigured, isWhatsAppConfigured } from '../lib/data';
import { loadCatalog, type CatalogService } from '../lib/catalog';
import { buildBookingRequestMessage, buildWhatsAppBookingUrl, formatBookingRequestDate } from '../lib/booking-request';

function localDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<CatalogService[]>([]);
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [manualService, setManualService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void loadCatalog().then((catalog) => {
      setServices(catalog.services);
      const requested = searchParams.get('service');
      if (!requested) return;
      const match = catalog.services.find((item) => item.id === requested || item.slug === requested);
      if (match) setServiceId(match.id);
    });
  }, [searchParams]);

  const selectedService = services.find((item) => item.id === serviceId);
  const serviceName = selectedService?.name || manualService.trim();
  const isComplete = Boolean(name.trim() && serviceName && date && time);

  const message = useMemo(
    () => buildBookingRequestMessage({ name, service: serviceName, date, time }),
    [name, serviceName, date, time],
  );

  const whatsappUrl = isComplete && isWhatsAppConfigured(businessInfo.whatsapp)
    ? buildWhatsAppBookingUrl(businessInfo.whatsapp, message)
    : null;

  const minDate = localDateInputValue(new Date());

  const copyMessage = async () => {
    if (!isComplete) return false;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
      return true;
    } catch {
      return false;
    }
  };

  const openInstagram = () => {
    if (!isComplete || !isPublicHandleConfigured(businessInfo.instagram)) return;
    window.open(businessInfo.instagramUrl, '_blank', 'noopener,noreferrer');
    void copyMessage();
  };

  return (
    <div className="bg-brand-background py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.26em] text-brand-wine">Agendamento</p>
            <h1 className="mt-4 font-display text-5xl font-light leading-[1.02] text-brand-text md:text-6xl">
              Escolha o que você precisa e envie tudo pronto ao atendimento.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-muted">
              Informe nome, serviço, data e horário de interesse. O site monta a mensagem automaticamente para o atendimento receber o pedido já organizado.
            </p>

            <div className="mt-8 border border-brand-surface bg-white p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-brand-wine" size={20} />
                <div>
                  <h2 className="font-medium text-brand-text">Solicitação, não reserva automática</h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    A data e o horário enviados representam sua preferência. O atendimento confirma a disponibilidade pelo próprio canal antes de considerar o horário reservado.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 bg-brand-cream px-5 py-4 text-sm text-brand-muted">
              <Sparkles size={17} className="mt-0.5 shrink-0 text-brand-wine" />
              <p>
                A mensagem começa com “Oi, vim através do site...” e mantém um formato estável, preparado para futura automação com ManyChat ou ferramenta semelhante.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border border-brand-surface bg-white p-7 shadow-sm md:p-10">
              <div className="flex h-12 w-12 items-center justify-center bg-brand-wine text-white">
                <Calendar size={22} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-light text-brand-text">Monte sua solicitação</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                Preencha os quatro dados abaixo. Nenhuma informação é enviada até você tocar no canal escolhido.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-text">
                    <User size={16} className="text-brand-wine" /> Nome
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Ex.: Rodrigo da Silva"
                    className="w-full border border-brand-surface bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-wine"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-brand-text">Serviço de interesse</span>
                  {services.length > 0 ? (
                    <select
                      value={serviceId}
                      onChange={(event) => setServiceId(event.target.value)}
                      className="w-full border border-brand-surface bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-wine"
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={manualService}
                      onChange={(event) => setManualService(event.target.value)}
                      placeholder="Ex.: Manicure e Pedicure"
                      className="w-full border border-brand-surface bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-wine"
                    />
                  )}
                  <span className="mt-2 block text-xs leading-relaxed text-brand-muted">
                    {services.length > 0
                      ? 'A lista usa apenas serviços cadastrados na fonte real do projeto.'
                      : 'Enquanto o catálogo central não estiver integrado, descreva o serviço que deseja consultar.'}
                  </span>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-text">
                      <Calendar size={16} className="text-brand-wine" /> Data de interesse
                    </span>
                    <input
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full border border-brand-surface bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-wine"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-text">
                      <Clock size={16} className="text-brand-wine" /> Horário de interesse
                    </span>
                    <input
                      type="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className="w-full border border-brand-surface bg-brand-background px-4 py-3 text-brand-text outline-none transition focus:border-brand-wine"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-8 border border-brand-surface bg-brand-background p-5" aria-live="polite">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-brand-text">Prévia da mensagem</h3>
                  <button
                    type="button"
                    onClick={() => void copyMessage()}
                    disabled={!isComplete}
                    className="inline-flex items-center gap-2 text-xs font-medium text-brand-wine transition hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copiada' : 'Copiar'}
                  </button>
                </div>

                {isComplete ? (
                  <div className="mt-4 overflow-hidden border border-brand-surface bg-white text-sm">
                    <p className="border-b border-brand-surface px-4 py-3 leading-relaxed text-brand-muted">
                      Oi, vim através do site e tenho interesse em fazer esses serviços:
                    </p>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4 py-4">
                      <dt className="font-medium text-brand-text">Nome:</dt><dd className="text-brand-muted">{name.trim()}</dd>
                      <dt className="font-medium text-brand-text">Serviço:</dt><dd className="text-brand-muted">{serviceName}</dd>
                      <dt className="font-medium text-brand-text">Data:</dt><dd className="text-brand-muted">{formatBookingRequestDate(date)}</dd>
                      <dt className="font-medium text-brand-text">Horário:</dt><dd className="text-brand-muted">{time}</dd>
                    </dl>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                    Preencha nome, serviço, data e horário para liberar a mensagem pronta.
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {isWhatsAppConfigured(businessInfo.whatsapp) && (
                  whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 bg-brand-wine px-5 py-4 text-white transition hover:bg-brand-primary"
                    >
                      <span className="inline-flex items-center gap-3"><MessageCircle size={20} /> Enviar solicitação pelo WhatsApp</span>
                      <ArrowRight size={18} />
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-4 bg-brand-wine/40 px-5 py-4 text-white/80" aria-disabled="true">
                      <span className="inline-flex items-center gap-3"><MessageCircle size={20} /> Preencha os dados para usar o WhatsApp</span>
                    </div>
                  )
                )}

                {isPublicHandleConfigured(businessInfo.instagram) && (
                  <button
                    type="button"
                    onClick={openInstagram}
                    disabled={!isComplete}
                    className="flex w-full items-center justify-between gap-4 border border-brand-text/15 px-5 py-4 text-left text-brand-text transition hover:border-brand-wine hover:text-brand-wine disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="inline-flex items-center gap-3"><Instagram size={20} /> Copiar mensagem e abrir Instagram</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-brand-muted">
                No WhatsApp, a mensagem já abre preenchida. O Instagram não permite preencher a DM automaticamente por link; por isso o site copia a mesma mensagem e abre o perfil para você colar no Direct.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
