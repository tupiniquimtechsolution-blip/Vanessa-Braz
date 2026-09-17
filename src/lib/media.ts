// Catálogo de mídias auditadas — Vanessa Braz
// WEB-v2 aprovado no gate visual; autorização de publicação permanece separada e pendente.

export interface MediaAsset {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  fallback: string;
  publicationAuthorization: 'PENDENTE_DE_CONFIRMACAO';
}

const MEDIA_SOURCE_BASE = '/media/source';

function video(name: string): string {
  return `${MEDIA_SOURCE_BASE}/videos/${encodeURIComponent(name)}`;
}

const heroAssetsInternal: MediaAsset[] = [
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.23.51-121a8bba.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.23.51-121a8bba-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.23.51-121a8bba-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.23.51-121a8bba.webp 1254w",
    "width": 1254,
    "height": 1254,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.23.51.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.24.30-df8e25a1.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.24.30-df8e25a1-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.24.30-df8e25a1.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.24.30.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  }
];

const galleryAssetsInternal: MediaAsset[] = [
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-606cc281.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.30-606cc281-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-606cc281.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.30.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.31-d476f468.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.31-d476f468-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.31-d476f468-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.31-d476f468.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.31.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-bde00ee6.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.32-bde00ee6-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-bde00ee6.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.32.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.34-a54adf88.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.34-a54adf88-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.34-a54adf88-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.34-a54adf88.webp 1254w",
    "width": 1254,
    "height": 1254,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.34.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.35-c4f9f102.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.35-c4f9f102-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.35-c4f9f102.webp 851w",
    "width": 851,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.35.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.38-799dfd8a.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.38-799dfd8a-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.38-799dfd8a.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.38.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.39-1-11d9d252.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.39-1-11d9d252-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.39-1-11d9d252.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.39 (1).jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.42-47d7cd6f.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.42-47d7cd6f-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.42-47d7cd6f.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.42.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.45-a928af47.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.45-a928af47-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.45-a928af47.webp 853w",
    "width": 853,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.45.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.47-1-97ffd28d.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.47-1-97ffd28d-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.47-1-97ffd28d.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.47 (1).jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.50-60105930.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.50-60105930-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.50-60105930.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.50.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.52-6435adab.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.52-6435adab-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.52-6435adab.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.52.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.04-8e7252c4.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.04-8e7252c4-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.04-8e7252c4.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.04.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.07-078bc554.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.07-078bc554-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.07-078bc554-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.07-078bc554.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.07.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.29-f75a326d.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.29-f75a326d-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.29-f75a326d.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.29.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.34-ba230c0d.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.34-ba230c0d-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.34-ba230c0d.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.34.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.38-fd056810.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.38-fd056810-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.38-fd056810.webp 722w",
    "width": 722,
    "height": 1114,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.38.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.44-e7aa07c8.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.44-e7aa07c8-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.44-e7aa07c8.webp 889w",
    "width": 889,
    "height": 759,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.44.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.45-7207267a.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.45-7207267a-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.45-7207267a-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.45-7207267a.webp 1080w",
    "width": 1080,
    "height": 1275,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.45.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.48-8112dfbb.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.48-8112dfbb-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.48-8112dfbb.webp 774w",
    "width": 774,
    "height": 1032,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.48.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  }
];

const detailAssetsInternal: MediaAsset[] = [
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-1-fc3283cf.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.30-1-fc3283cf-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.30-1-fc3283cf-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.30-1-fc3283cf.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.30 (1).jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-1-8e7b7802.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.32-1-8e7b7802-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.32-1-8e7b7802-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.32-1-8e7b7802.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.32 (1).jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.33-a1b70797.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.33-a1b70797-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.33-a1b70797.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.33.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.36-dc1b7dd0.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.36-dc1b7dd0-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.36-dc1b7dd0.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.36.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.40-47b249e5.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.40-47b249e5-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.40-47b249e5.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.40.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.43-bf400f40.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.43-bf400f40-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.43-bf400f40.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.43.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.46-8227416d.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.46-8227416d-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.46-8227416d-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.46-8227416d.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.46.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.49-51c5243a.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.49-51c5243a-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.49-51c5243a-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.49-51c5243a.webp 1280w",
    "width": 1280,
    "height": 960,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.49.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.51-73104450.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.51-73104450-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.51-73104450.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.51.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.54-022828e2.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.26.54-022828e2-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.26.54-022828e2.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.26.54.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  }
];

const environmentAssetsInternal: MediaAsset[] = [
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.05-c6b7d30e.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.05-c6b7d30e-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.05-c6b7d30e.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.05.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.06-3d66cfa0.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.06-3d66cfa0-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.06-3d66cfa0.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.06.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.08-13804368.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.08-13804368-640w.webp 640w, /media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.08-13804368-960w.webp 960w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.08-13804368.webp 1280w",
    "width": 1280,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.08.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.09-b128d12e.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.09-b128d12e-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.09-b128d12e.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.09.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.30-989d7b9a.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.30-989d7b9a-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.30-989d7b9a.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.30.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.31-017738a3.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.31-017738a3-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.31-017738a3.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.31.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.32-dfb6b026.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.32-dfb6b026-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.32-dfb6b026.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.32.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  },
  {
    "src": "/media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.33-c5f8bdd5.webp",
    "srcSet": "/media/optimized/web/responsive/WhatsApp-Image-2026-09-12-at-10.53.33-c5f8bdd5-640w.webp 640w, /media/optimized/web/WhatsApp-Image-2026-09-12-at-10.53.33-c5f8bdd5.webp 960w",
    "width": 960,
    "height": 1280,
    "fallback": "/media/source/images/WhatsApp Image 2026-09-12 at 10.53.33.jpeg",
    "publicationAuthorization": "PENDENTE_DE_CONFIRMACAO"
  }
];

export const heroAssets = heroAssetsInternal;
export const heroAsset = heroAssets[0];
export const detailAssets = detailAssetsInternal;
export const environmentAssets = environmentAssetsInternal;

export const media = {
  hero: heroAssets.map((item) => item.src),
  gallery: galleryAssetsInternal.map((item) => item.src),
  details: detailAssets.map((item) => item.src),
  environment: environmentAssets.map((item) => item.src),
  videos: [
    video('WhatsApp Video 2026-09-12 at 10.24.25.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.26.29.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.26.34.mp4'),
    video('WhatsApp Video 2026-09-12 at 10.53.29.mp4'),
  ],
};

export const heroImage = heroAsset.src;

export const galleryImages = galleryAssetsInternal.map((asset, index) => ({
  ...asset,
  alt: `Imagem do acervo Vanessa Braz — ${index + 1}`,
  category: 'Acervo',
}));

export const detailImages = detailAssets.map((item) => item.src);
export const environmentImages = environmentAssets.map((item) => item.src);

export const mediaStats = {
  total: 185,
  images: 157,
  videos: 28,
  optimizedFrontendUses: 40,
  visualGate: 'PASS',
  publicationGate: 'PENDENTE_DE_CONFIRMACAO',
  source: 'Google Drive → GitHub',
  importedAt: '2026-09-12T15:24:22.405828+00:00',
};
