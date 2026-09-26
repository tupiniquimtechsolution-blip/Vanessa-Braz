import { ArrowRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryImages } from '../lib/media';
import Gallery from '../components/Gallery';

export default function GalleryPage() {
  return (
    <div className="bg-brand-background">
      <section className="salon-grid bg-brand-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-brand-secondary">
              <Camera size={19} />
              <p className="text-[10px] uppercase tracking-[0.24em]">Portfólio</p>
            </div>
            <h1 className="font-display text-5xl font-light leading-[1.02] md:text-6xl">Acervo visual curado</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
              Seleção pública com prioridade para cabelos já finalizados e outros registros de beleza adequados à vitrine. Fotos de processo com cabelo desalinhado permanecem no acervo, mas não entram nesta galeria padrão.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Gallery images={galleryImages} columns={3} />

          <div className="mx-auto mt-20 max-w-2xl border-t border-brand-text/10 pt-10 text-center">
            <p className="text-sm leading-relaxed text-brand-muted">
              Esta seleção reúne {galleryImages.length} imagens do acervo público curado. Procedimentos, resultados, preços e demais afirmações comerciais só são associados às imagens quando houver confirmação documental e autorização de publicação aplicável.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-2 bg-brand-wine px-7 py-4 text-sm font-medium text-white transition hover:bg-brand-accent"
              >
                Agendar horário <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-brand-text/15 px-7 py-4 text-sm text-brand-text transition hover:border-brand-wine hover:text-brand-wine"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
