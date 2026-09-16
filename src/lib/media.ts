// Catálogo de mídias do acervo fornecido — Vanessa Braz
// Originais em apps/web/public/media/source/.

const MEDIA_BASE = '/media/source';

function image(name: string): string {
  return `${MEDIA_BASE}/images/${encodeURIComponent(name)}`;
}

function video(name: string): string {
  return `${MEDIA_BASE}/videos/${encodeURIComponent(name)}`;
}

export const media = {
  hero: [
    image('WhatsApp Image 2026-09-12 at 10.23.51.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.24.30.jpeg'),
  ],
  gallery: [
    image('WhatsApp Image 2026-09-12 at 10.26.30.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.31.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.32.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.34.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.35.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.38.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.39 (1).jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.42.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.45.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.47 (1).jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.50.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.52.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.04.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.07.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.29.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.34.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.38.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.44.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.45.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.48.jpeg'),
  ],
  details: [
    image('WhatsApp Image 2026-09-12 at 10.26.30 (1).jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.32 (1).jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.33.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.36.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.40.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.43.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.46.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.49.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.51.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.26.54.jpeg'),
  ],
  environment: [
    image('WhatsApp Image 2026-09-12 at 10.53.05.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.06.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.08.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.09.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.30.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.31.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.32.jpeg'),
    image('WhatsApp Image 2026-09-12 at 10.53.33.jpeg'),
  ],
  videos: [
    video('WhatsApp Video 2026-09-12 at 10.24.25.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.26.29.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.26.34.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.53.29.mp4'),
  ],
};

export const heroImage = media.hero[0];

export const galleryImages = media.gallery.map((src, index) => ({
  src,
  alt: `Imagem do acervo Vanessa Braz — ${index + 1}`,
  category: 'Acervo',
}));

export const detailImages = media.details;
export const environmentImages = media.environment;

export const mediaStats = {
  total: 185,
  images: 157,
  videos: 28,
  source: 'Google Drive → GitHub',
  importedAt: '2026-09-12T15:24:22.405828+00:00',
};
