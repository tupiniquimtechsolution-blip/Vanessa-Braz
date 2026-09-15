import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { setAuthenticated, saveClient, generateId, getClient } from '../lib/store';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (isRegister) {
      if (!name || !phone) {
        setError('Preencha todos os campos.');
        return;
      }
      if (!consent) {
        setError('Você precisa aceitar a política de privacidade.');
        return;
      }
      // Demo mode - save client locally
      const client = {
        id: generateId(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      };
      saveClient(client);
      setAuthenticated(true);
      navigate('/minha-conta');
    } else {
      // Demo mode - accept any credentials
      if (password.length < 4) {
        setError('Senha deve ter pelo menos 4 caracteres.');
        return;
      }
      const existingClient = getClient();
      if (!existingClient) {
        const client = {
          id: generateId(),
          name: 'Cliente',
          email,
          phone: '',
          createdAt: new Date().toISOString(),
        };
        saveClient(client);
      }
      setAuthenticated(true);
      navigate('/minha-conta');
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              {isRegister ? <UserPlus size={28} className="text-brand-primary" /> : <LogIn size={28} className="text-brand-primary" />}
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-primary">
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="text-sm text-brand-muted mt-2">
              {isRegister ? 'Crie sua conta para agendar online' : 'Acesse sua conta para ver seus agendamentos'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-1">
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
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
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
                E-mail *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
                Senha *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-surface rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="flex items-start gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-1 rounded border-brand-surface text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor="consent" className="text-xs text-brand-muted">
                  Li e concordo com a{' '}
                  <Link to="/politica-de-privacidade" className="text-brand-primary underline">
                    Política de Privacidade
                  </Link>
                  {' '}e os{' '}
                  <Link to="/termos" className="text-brand-primary underline">
                    Termos de Uso
                  </Link>
                  . Consentimento necessário para criação de conta (LGPD).
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 bg-brand-danger/10 text-brand-danger text-sm rounded-xl" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors"
            >
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
            >
              {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-3 bg-brand-accent/10 rounded-xl">
            <p className="text-xs text-brand-muted text-center">
              🔒 Modo demonstrativo — Autenticação local para testes. Em produção, utilizaremos Supabase Auth com segurança completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
