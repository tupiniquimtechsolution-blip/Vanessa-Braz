import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, MapPin, Menu, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import {
  businessInfo,
  businessMapsUrl,
  businessPhoneUrl,
  isPublicHandleConfigured,
  isWhatsAppConfigured,
} from '../lib/data';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/servicos', label: 'Serviços' },
    { to: '/galeria', label: 'Galeria' },
    { to: '/agendar', label: 'Agendar' },
    { to: '/contato', label: 'Contato' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-3 md:pt-4">
          <div className="pointer-events-auto border border-white/10 bg-brand-ink/90 backdrop-blur-xl shadow-2xl shadow-black/20">
            <div className="flex h-16 md:h-[72px] items-center justify-between px-4 md:px-6">
              <Link to="/" className="flex items-center gap-3 min-w-0" onClick={() => setMobileMenuOpen(false)}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-accent/40 bg-brand-accent/10 text-brand-secondary">
                  <Sparkles size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg md:text-xl font-light text-white">Vanessa Braz</span>
                  <span className="hidden sm:block text-[10px] uppercase tracking-[0.24em] text-white/45">Beleza & Autoestima</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
                {navLinks.map((link) => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <Link
                  to="/agendar"
                  className="hidden sm:inline-flex items-center border border-brand-accent/50 bg-brand-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink transition hover:bg-brand-secondary"
                >
                  Agendar
                </Link>
                <button
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="md:hidden p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/10 bg-brand-night animate-fade-in">
                <nav className="p-3" aria-label="Navegação mobile">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between border-b border-white/[0.06] px-3 py-3.5 text-sm transition-colors last:border-b-0 ${
                        location.pathname === link.to ? 'text-brand-secondary' : 'text-white/65 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <span aria-hidden className="text-white/25">↗</span>
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-3 block border border-white/10 px-3 py-3 text-center text-sm text-white/60 transition hover:text-white"
                  >
                    Minha Conta
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-[76px] md:pt-[88px]" role="main">{children}</main>

      <footer className="bg-brand-ink text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-brand-accent/35 text-brand-secondary">
                  <Sparkles size={17} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-light">Vanessa Braz</h2>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Beleza & Autoestima</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/45">
                Portfólio visual e informações confirmadas do atendimento. Serviços, valores e disponibilidade só aparecem quando validados na fonte do projeto.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="mb-6 text-[10px] uppercase tracking-[0.24em] text-brand-secondary/70">Navegação</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/servicos" className="text-white/60 transition hover:text-white">Serviços</Link></li>
                <li><Link to="/galeria" className="text-white/60 transition hover:text-white">Galeria</Link></li>
                <li><Link to="/agendar" className="text-white/60 transition hover:text-white">Agendar</Link></li>
                <li><Link to="/contato" className="text-white/60 transition hover:text-white">Contato</Link></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="mb-6 text-[10px] uppercase tracking-[0.24em] text-brand-secondary/70">Contato</h3>
              <ul className="space-y-3 text-sm text-white/60">
                {isPublicHandleConfigured(businessInfo.instagram) && (
                  <li>
                    <a href={businessInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                      <Instagram size={15} /> {businessInfo.instagram}
                    </a>
                  </li>
                )}
                <li>
                  <a href={businessPhoneUrl} className="inline-flex items-center gap-2 transition hover:text-white">
                    <Phone size={15} /> {businessInfo.phone}
                  </a>
                </li>
                <li>
                  <a href={businessMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-white">
                    <MapPin size={15} /> {businessInfo.address}
                  </a>
                </li>
                <li className="pt-2 text-xs text-white/30">Horários: PENDENTE_DE_CONFIRMACAO</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-xs text-white/25">© {new Date().getFullYear()} Vanessa Braz. Conteúdo comercial sujeito a confirmação.</p>
            <div className="flex items-center gap-6">
              <Link to="/politica-de-privacidade" className="text-xs text-white/30 transition hover:text-white/65">Privacidade</Link>
              <Link to="/termos" className="text-xs text-white/30 transition hover:text-white/65">Termos</Link>
            </div>
          </div>
        </div>
      </footer>

      {isWhatsAppConfigured(businessInfo.whatsapp) && (
        <a
          href={`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de informações sobre agendamento.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center border border-white/10 bg-brand-wine text-white shadow-2xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-brand-accent"
          aria-label="Contato via WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      )}
    </div>
  );
}
