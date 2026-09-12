import { Link } from 'react-router-dom';
import { Calendar, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import { services, categories } from '../lib/data';
import { formatCurrency } from '../lib/store';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Nossos Serviços
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">
            Conheça todos os nossos tratamentos e encontre o ideal para você.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <Filter size={16} className="text-brand-muted mr-2" />
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface text-brand-muted hover:bg-brand-secondary/30'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-surface text-brand-muted hover:bg-brand-secondary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-brand-surface/50 group"
            >
              <div className="h-48 bg-gradient-to-br from-brand-secondary/20 to-brand-accent/10 flex items-center justify-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={28} className="text-brand-primary" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-brand-primary text-xs font-medium rounded-full">
                    {service.category}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-brand-primary mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-brand-muted mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-brand-surface">
                  <div>
                    <p className="text-xl font-bold text-brand-primary">
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-xs text-brand-muted flex items-center gap-1">
                      <Clock size={12} />
                      {service.duration} minutos
                    </p>
                  </div>
                  <Link
                    to={`/agendar?service=${service.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-wine/90 transition-colors"
                  >
                    <Calendar size={14} />
                    Agendar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-brand-surface/50 rounded-3xl p-8 md:p-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-primary mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-brand-muted mb-6 max-w-lg mx-auto">
            Entre em contato conosco pelo WhatsApp. Teremos prazer em tirar suas dúvidas e encontrar o tratamento ideal para você.
          </p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
