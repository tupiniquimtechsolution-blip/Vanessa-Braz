import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

export default function Gallery({ images, columns = 3 }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  const goPrev = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className={`grid ${colClass} gap-2 md:gap-3`}>
        {images.map((image, index) => (
          <button
            key={image.src}
            onClick={() => openLightbox(index)}
            className="hair-card group relative aspect-square cursor-pointer overflow-hidden border border-brand-text/5 bg-brand-surface text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label={`Ver imagem: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-35 transition-opacity duration-300 group-hover:opacity-80" />
            {image.category && (
              <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.18em] text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
                {image.category}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/95 p-4 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização de imagem"
        >
          <button onClick={closeLightbox} className="absolute right-4 top-4 z-10 p-3 text-white/70 transition hover:text-white" aria-label="Fechar">
            <X size={28} />
          </button>

          <button
            onClick={(event) => { event.stopPropagation(); goPrev(); }}
            className="absolute left-3 z-10 border border-white/10 bg-black/20 p-3 text-white/70 transition hover:text-white"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={30} />
          </button>

          <img
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].alt}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            onClick={(event) => { event.stopPropagation(); goNext(); }}
            className="absolute right-3 z-10 border border-white/10 bg-black/20 p-3 text-white/70 transition hover:text-white"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={30} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.16em] text-white/45">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
