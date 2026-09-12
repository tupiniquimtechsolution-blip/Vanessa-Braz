import { useState } from 'react';
import { Camera, Filter } from 'lucide-react';
import { galleryImages } from '../lib/media';
import Gallery from '../components/Gallery';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [...new Set(galleryImages.map(img => img.category).filter(Boolean))] as string[];

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
            <Camera size={28} className="text-brand-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-primary mb-4">
            Galeria de Resultados
          </h1>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">
            Confira nossos trabalhos e resultados. Cada procedimento é único e personalizado para realçar sua beleza natural.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <Filter size={16} className="text-brand-muted mr-2" />
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-brand-primary text-white'
                : 'bg-brand-surface text-brand-muted hover:bg-brand-secondary/30'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === cat
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-surface text-brand-muted hover:bg-brand-secondary/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <Gallery images={filteredImages} columns={3} />

        {/* Info */}
        <div className="mt-16 text-center bg-brand-surface/50 rounded-3xl p-8 md:p-12">
          <h2 className="font-display text-2xl font-bold text-brand-primary mb-4">
            Quer ter resultados como esses?
          </h2>
          <p className="text-brand-muted mb-6 max-w-lg mx-auto">
            Agende sua avaliação e descubra o procedimento ideal para você. 
            Cada tratamento é personalizado de acordo com suas características.
          </p>
          <a
            href="/agendar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-medium rounded-full hover:bg-brand-wine/90 transition-colors"
          >
            <Camera size={18} />
            Agendar Avaliação
          </a>
        </div>

        {/* Note about real photos */}
        <div className="mt-8 text-center">
          <p className="text-xs text-brand-muted">
            📸 Mais de 100 fotos de resultados reais disponíveis. 
            Fotos adicionais do Google Drive serão adicionadas em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
