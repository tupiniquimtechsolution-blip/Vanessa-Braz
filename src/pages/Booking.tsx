import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, Check, ArrowLeft, ArrowRight, User, Phone, Sparkles } from 'lucide-react';
import { services } from '../lib/data';
import { generateTimeSlots, saveBooking, generateId, formatCurrency, formatDate } from '../lib/store';

type Step = 'service' | 'date' | 'time' | 'info' | 'confirm';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<string>(searchParams.get('service') || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);

  const service = services.find(s => s.id === selectedService);

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Skip Sunday
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const getDayName = (dateStr: string) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(dateStr + 'T12:00:00');
    return days[date.getDay()];
  };

  const getDayNumber = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').getDate();
  };

  const getMonthName = (dateStr: string) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const date = new Date(dateStr + 'T12:00:00');
    return months[date.getMonth()];
  };

  const handleConfirm = () => {
    if (!service || !selectedDate || !selectedTime || !clientName || !clientPhone) return;

    const booking = {
      id: generateId(),
      serviceId: service.id,
      serviceName: service.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending' as const,
      price: service.price,
      clientName,
      clientPhone,
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    return (
      <div className="py-12 md:py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-brand-success/10 rounded-full flex items-center justify-center mb-6">
              <Check size={40} className="text-brand-success" />
            </div>
            <h1 className="font-display text-3xl font-bold text-brand-primary mb-4">
              Agendamento Confirmado!
            </h1>
            <p className="text-brand-muted mb-8">
              Seu horário foi reservado com sucesso. Em breve entraremos em contato para confirmar os detalhes.
            </p>
            <div className="bg-brand-surface/50 rounded-2xl p-6 text-left mb-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-brand-muted">Serviço:</span>
                  <span className="text-sm font-medium">{service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-brand-muted">Data:</span>
                  <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-brand-muted">Horário:</span>
                  <span className="text-sm font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-brand-muted">Valor:</span>
                  <span className="text-sm font-medium">{formatCurrency(service?.price || 0)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors"
              >
                Voltar ao Início
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition-colors"
              >
                Criar minha conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-2">
            Agendar Horário
          </h1>
          <p className="text-brand-muted">
            Siga os passos para reservar seu horário
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['service', 'date', 'time', 'info', 'confirm'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step === s ? 'bg-brand-primary text-white' :
                (['service', 'date', 'time', 'info', 'confirm'].indexOf(step) > idx) ? 'bg-brand-success text-white' :
                'bg-brand-surface text-brand-muted'
              }`}>
                {(['service', 'date', 'time', 'info', 'confirm'].indexOf(step) > idx) ? <Check size={14} /> : idx + 1}
              </div>
              {idx < 4 && <div className={`w-8 md:w-12 h-0.5 ${
                (['service', 'date', 'time', 'info', 'confirm'].indexOf(step) > idx) ? 'bg-brand-success' : 'bg-brand-surface'
              }`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
          {/* Step 1: Service */}
          {step === 'service' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-brand-primary mb-6 flex items-center gap-2">
                <Sparkles size={20} />
                Escolha o serviço
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      selectedService === s.id
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-brand-surface hover:border-brand-secondary'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-brand-text">{s.name}</p>
                        <p className="text-xs text-brand-muted mt-1">{s.category} • {s.duration}min</p>
                      </div>
                      <span className="font-bold text-brand-primary text-sm">{formatCurrency(s.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep('date')}
                  disabled={!selectedService}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date */}
          {step === 'date' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-brand-primary mb-6 flex items-center gap-2">
                <Calendar size={20} />
                Escolha a data
              </h2>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {getAvailableDates().map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl text-center transition-all border ${
                      selectedDate === date
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-surface hover:border-brand-secondary'
                    }`}
                  >
                    <p className={`text-xs ${selectedDate === date ? 'text-white/70' : 'text-brand-muted'}`}>
                      {getDayName(date)}
                    </p>
                    <p className={`text-lg font-bold ${selectedDate === date ? 'text-white' : 'text-brand-text'}`}>
                      {getDayNumber(date)}
                    </p>
                    <p className={`text-xs ${selectedDate === date ? 'text-white/70' : 'text-brand-muted'}`}>
                      {getMonthName(date)}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('service')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-surface text-brand-muted font-medium rounded-full hover:bg-brand-surface transition-colors"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  onClick={() => setStep('time')}
                  disabled={!selectedDate}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Time */}
          {step === 'time' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-brand-primary mb-2 flex items-center gap-2">
                <Clock size={20} />
                Escolha o horário
              </h2>
              <p className="text-sm text-brand-muted mb-6">
                {formatDate(selectedDate)} • {service?.name}
              </p>
              {timeSlots.length === 0 ? (
                <p className="text-brand-muted text-center py-8">
                  Não há horários disponíveis para esta data. Selecione outra data.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-xl text-center text-sm font-medium transition-all border ${
                        selectedTime === slot.time
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : slot.available
                            ? 'border-brand-surface hover:border-brand-secondary'
                            : 'border-brand-surface/50 text-brand-muted/50 cursor-not-allowed line-through'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('date')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-surface text-brand-muted font-medium rounded-full hover:bg-brand-surface transition-colors"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  onClick={() => setStep('info')}
                  disabled={!selectedTime}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Info */}
          {step === 'info' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-brand-primary mb-6 flex items-center gap-2">
                <User size={20} />
                Seus dados
              </h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-1">
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-text mb-1">
                    WhatsApp *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('time')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-surface text-brand-muted font-medium rounded-full hover:bg-brand-surface transition-colors"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!clientName || !clientPhone}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 'confirm' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-brand-primary mb-6 flex items-center gap-2">
                <Check size={20} />
                Confirme seu agendamento
              </h2>
              <div className="bg-brand-surface/50 rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Serviço:</span>
                    <span className="font-medium text-brand-text">{service?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Data:</span>
                    <span className="font-medium text-brand-text">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Horário:</span>
                    <span className="font-medium text-brand-text">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Duração:</span>
                    <span className="font-medium text-brand-text">{service?.duration} minutos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">Nome:</span>
                    <span className="font-medium text-brand-text">{clientName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-muted">WhatsApp:</span>
                    <span className="font-medium text-brand-text">{clientPhone}</span>
                  </div>
                  <hr className="border-brand-surface" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-brand-text">Total:</span>
                    <span className="text-xl font-bold text-brand-primary">{formatCurrency(service?.price || 0)}</span>
                  </div>
                </div>
              </div>

              {/* LGPD Consent */}
              <div className="bg-brand-surface/30 rounded-xl p-4 mb-6">
                <p className="text-xs text-brand-muted">
                  Ao confirmar, você concorda com nossos{' '}
                  <Link to="/termos" className="text-brand-primary underline">Termos de Uso</Link>
                  {' '}e{' '}
                  <Link to="/politica-de-privacidade" className="text-brand-primary underline">Política de Privacidade</Link>
                  . Seus dados serão tratados conforme a LGPD.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('info')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-brand-surface text-brand-muted font-medium rounded-full hover:bg-brand-surface transition-colors"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-brand-success text-white font-medium rounded-full hover:bg-brand-success/90 transition-colors"
                >
                  <Check size={16} />
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
