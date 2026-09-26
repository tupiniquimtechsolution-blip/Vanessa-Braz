import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import GalleryPage from './pages/Gallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/servicos" element={<Layout><Services /></Layout>} />
        <Route path="/servicos/:slug" element={<Layout><Services /></Layout>} />
        <Route path="/galeria" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/agendar" element={<Layout><Booking /></Layout>} />
        <Route path="/contato" element={<Layout><Contact /></Layout>} />
        <Route path="/localizacao" element={<Layout><Contact /></Layout>} />
        <Route path="/politica-de-privacidade" element={<Layout><Privacy /></Layout>} />
        <Route path="/termos" element={<Layout><Terms /></Layout>} />

        {/* Identidade e áreas autenticadas serão fornecidas pelo Sistema-SaaS-Geral. */}
        <Route path="/login" element={<Navigate to="/agendar" replace />} />
        <Route path="/cadastro" element={<Navigate to="/agendar" replace />} />
        <Route path="/recuperar-senha" element={<Navigate to="/agendar" replace />} />
        <Route path="/minha-conta/*" element={<Navigate to="/agendar" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />

        <Route path="*" element={
          <Layout>
            <div className="py-20 text-center">
              <h1 className="mb-4 font-display text-4xl font-bold text-brand-primary">404</h1>
              <p className="mb-6 text-brand-muted">Página não encontrada</p>
              <a href="/" className="inline-flex items-center bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-brand-wine/90">
                Voltar ao início
              </a>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
