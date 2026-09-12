import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, MapPin, Clock, MessageCircle } from 'lucide-react';
import { businessInfo } from '../lib/data';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/servicos', label: 'Serviços' },
    { to: '/agendar', label: 'Agendar' },
    { to: '/contato', label: 'Contato' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-white font-display text-lg font-bold">V</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-semibold text-brand-primary leading-tight">
                  Vanessa Braz
                </h1>
                <p className="text-xs text-brand-muted leading-tight">Beleza & Autoestima</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                    location.pathname === link.to
                      ? 'text-brand-primary'
                      : 'text-brand-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-3">
              <Link
                to="/agendar"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-full hover:bg-brand-wine/90 transition-colors"
              >
                Agendar Agora
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-brand-muted hover:text-brand-primary"
                aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-surface animate-fade-in">
            <nav className="px-4 py-4 space-y-2" aria-label="Navegação mobile">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-brand-surface text-brand-primary'
                      : 'text-brand-muted hover:bg-brand-surface/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-brand-muted hover:bg-brand-surface/50"
              >
                Minha Conta
              </Link>
              <Link
                to="/agendar"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-brand-primary text-white text-center rounded-lg text-sm font-medium"
              >
                Agendar Agora
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-primary text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-3">Vanessa Braz</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Beleza & Autoestima. Cuidando de você com técnica, carinho e produtos de alta qualidade.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-brand-accent">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/servicos" className="text-white/70 hover:text-white text-sm transition-colors">Serviços</Link></li>
                <li><Link to="/agendar" className="text-white/70 hover:text-white text-sm transition-colors">Agendar</Link></li>
                <li><Link to="/contato" className="text-white/70 hover:text-white text-sm transition-colors">Contato</Link></li>
                <li><Link to="/politica-de-privacidade" className="text-white/70 hover:text-white text-sm transition-colors">Privacidade</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-brand-accent">Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone size={14} />
                  <span>{businessInfo.phone}</span>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <Instagram size={14} />
                  <span>{businessInfo.instagram}</span>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin size={14} />
                  <span>{businessInfo.city}, {businessInfo.state}</span>
                </li>
                <li className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock size={14} />
                  <span>Seg-Sex: 9h-19h | Sáb: 9h-16h</span>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-brand-accent">Horários</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>Segunda a Quarta: 9h - 19h</li>
                <li>Quinta e Sexta: 9h - 20h</li>
                <li>Sábado: 9h - 16h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} Vanessa Braz — Beleza & Autoestima. Todos os direitos reservados.
            </p>
            <p className="text-white/50 text-xs">
              DEMO MODE — Dados demonstrativos
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${businessInfo.whatsapp}?text=Olá! Gostaria de agendar um horário.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse-soft"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
