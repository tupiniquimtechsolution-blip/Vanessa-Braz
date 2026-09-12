import { Link } from 'react-router-dom';
import { Calendar, Star, Sparkles, Heart, Shield, Award, ChevronDown, ChevronUp, MapPin, Clock, Phone, Instagram } from 'lucide-react';
import { useState } from 'react';
import { services, faqItems, testimonials, businessInfo } from '../lib/data';
import { images, galleryImages } from '../lib/media';
import Gallery from '../components/Gallery';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-surface via-brand-background to-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/20 text-brand-primary text-xs font-medium rounded-full mb-6">
                <Sparkles size={14} />
                Beleza que transforma
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary leading-tight mb-6">
                Realce sua{' '}
                <span className="text-brand-accent">beleza natural</span>{' '}
                com cuidado e técnica
              </h1>
              <p className="text-lg text-brand-muted mb-8 max-w-lg">
                {businessInfo.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/agendar"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Calendar size={20} />
                  Agendar Agora
                </Link>
                <Link
                  to="/servicos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition-all"
                >
                  Ver Serviços
                </Link>
              </div>
            </div>
            <div className="hidden lg:block animate-fade-in stagger-2">
              <div className="relative">
                <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={images.hero}
                    alt="Espaço de beleza Vanessa Braz"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-brand-accent text-brand-accent" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-brand-text">5.0</span>
                  </div>
                  <p className="text-xs text-brand-muted mt-1">Avaliação das clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Por que escolher a Vanessa Braz?
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Cada detalhe é pensado para proporcionar a melhor experiência em beleza e autoestima.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Profissional Qualificada', desc: 'Técnicas atualizadas e certificações nas áreas de beleza e estética.' },
              { icon: Shield, title: 'Produtos de Qualidade', desc: 'Apenas marcas reconhecidas e produtos regulamentados pela ANVISA.' },
              { icon: Heart, title: 'Atendimento Personalizado', desc: 'Cada procedimento é adaptado às suas necessidades e características.' },
              { icon: Sparkles, title: 'Ambiente Acolhedor', desc: 'Espaço pensado para seu conforto, relaxamento e bem-estar.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-brand-surface/50 hover:bg-brand-surface transition-colors">
                <div className="w-14 h-14 mx-auto bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon size={24} className="text-brand-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-brand-primary mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços em Destaque */}
      <section className="py-16 md:py-20 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Nossos Serviços
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Conheça nossos tratamentos e encontre o ideal para realçar sua beleza.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-brand-surface/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-brand-primary text-xs font-medium rounded-full">
                    {service.category}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-brand-primary mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-brand-muted mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-brand-surface">
                  <div>
                    <span className="text-lg font-bold text-brand-primary">
                      R$ {service.price}
                    </span>
                    <span className="text-xs text-brand-muted ml-1">
                      • {service.duration}min
                    </span>
                  </div>
                  <Link
                    to={`/agendar?service=${service.id}`}
                    className="text-sm font-medium text-brand-accent hover:text-brand-primary transition-colors"
                  >
                    Agendar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-primary text-brand-primary font-medium rounded-full hover:bg-brand-primary hover:text-white transition-all"
            >
              Ver Todos os Serviços
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-secondary/20 text-brand-primary text-xs font-medium rounded-full mb-4">
                <Heart size={14} />
                Sobre mim
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-6">
                Vanessa Braz
              </h2>
              <div className="space-y-4 text-brand-muted">
                <p>
                  Há mais de 8 anos dedicando minha carreira à beleza e autoestima feminina. 
                  Minha missão é fazer cada cliente se sentir especial e confiante.
                </p>
                <p>
                  Acredito que a beleza vai além da estética — é sobre se sentir bem consigo mesma. 
                  Por isso, cada atendimento é único e personalizado.
                </p>
                <p>
                  Constantemente me atualizo com as melhores técnicas e produtos do mercado 
                  para oferecer resultados excepcionais com total segurança.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <div>
                  <p className="text-3xl font-bold text-brand-primary">+500</p>
                  <p className="text-sm text-brand-muted">Clientes atendidas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-primary">8+</p>
                  <p className="text-sm text-brand-muted">Anos de experiência</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-primary">5.0</p>
                  <p className="text-sm text-brand-muted">Avaliação média</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={images.retrato}
                  alt="Vanessa Braz — Profissional de beleza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-20 bg-brand-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              O que nossas clientes dizem
            </h2>
            <p className="text-brand-muted">
              A satisfação de cada cliente é nossa maior recompensa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-accent text-brand-accent" />
                  ))}
                </div>
                <p className="text-brand-muted text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-brand-text text-sm">{t.name}</p>
                  <span className="text-xs text-brand-muted">{t.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria de Resultados */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Nossos Resultados
            </h2>
            <p className="text-brand-muted max-w-2xl mx-auto">
              Confira alguns dos nossos trabalhos. Cada procedimento é personalizado para realçar sua beleza natural.
            </p>
          </div>
          <Gallery images={galleryImages} columns={3} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-brand-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-brand-muted">
              Tire suas dúvidas sobre nossos serviços e agendamentos.
            </p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border border-brand-surface rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-brand-surface/30 transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-medium text-brand-text pr-4">{item.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp size={20} className="text-brand-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-brand-muted flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-brand-muted text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-16 md:py-20 bg-brand-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-primary mb-4">
              Onde nos encontrar
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <MapPin size={32} className="text-brand-primary mx-auto mb-3" />
              <h3 className="font-semibold text-brand-primary mb-2">Endereço</h3>
              <p className="text-sm text-brand-muted">{businessInfo.address || 'PENDENTE_DE_CONFIRMACAO'}</p>
              <p className="text-sm text-brand-muted">{businessInfo.city}, {businessInfo.state}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <Clock size={32} className="text-brand-primary mx-auto mb-3" />
              <h3 className="font-semibold text-brand-primary mb-2">Horários</h3>
              <p className="text-sm text-brand-muted">Seg a Sex: 9h - 19h/20h</p>
              <p className="text-sm text-brand-muted">Sábado: 9h - 16h</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <Phone size={32} className="text-brand-primary mx-auto mb-3" />
              <h3 className="font-semibold text-brand-primary mb-2">Contato</h3>
              <p className="text-sm text-brand-muted">{businessInfo.phone}</p>
              <p className="text-sm text-brand-muted flex items-center justify-center gap-1">
                <Instagram size={14} /> {businessInfo.instagram}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-brand-primary to-brand-wine text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Pronta para se sentir ainda mais bonita?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Agende seu horário e descubra como podemos realçar sua beleza natural com todo o cuidado que você merece.
          </p>
          <Link
            to="/agendar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary font-semibold rounded-full hover:bg-brand-surface transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Calendar size={20} />
            Agendar Meu Horário
          </Link>
        </div>
      </section>
    </div>
  );
}
