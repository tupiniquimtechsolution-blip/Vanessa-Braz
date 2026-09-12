// URLs das imagens geradas para o projeto
// Quando as fotos reais do Google Drive forem adicionadas, substituir estas URLs

export const images = {
  // Hero / Banner
  hero: 'https://image.qwenlm.ai/generated-images/8967a56a-c607-4f5c-a8ae-543ca3d527b6/_result.png',
  
  // Serviços
  sobrancelhas: 'https://image.qwenlm.ai/generated-images/1439688a-4d9f-4a28-8b2a-f1a60b93ac2d/_result.png',
  cilios: 'https://image.qwenlm.ai/generated-images/0be79705-d5fd-4e49-86e2-47e8a3e26403/_result.png',
  facial: 'https://image.qwenlm.ai/generated-images/60763c58-56bc-4b00-8b50-649c3161d7f0/_result.png',
  massagem: 'https://image.qwenlm.ai/generated-images/1f25482d-e58b-4ae9-ba4d-1e02be6a7865/_result.png',
  
  // Galeria / Resultados
  antesDepois: 'https://image.qwenlm.ai/generated-images/5dbef033-a7b0-4f36-aba3-95c4a38941b1/_result.png',
  retrato: 'https://image.qwenlm.ai/generated-images/08921b9a-bab7-41ad-a313-866072110638/_result.png',
};

// Imagens para a galeria de resultados
// NOTA: As fotos reais do Google Drive serão adicionadas aqui
// Link: https://drive.google.com/drive/folders/16dGWA3s7DInFaQQ1y76Sij8SWNpfEbMI
export const galleryImages = [
  { src: images.sobrancelhas, alt: 'Design de sobrancelhas - resultado natural', category: 'Sobrancelhas' },
  { src: images.cilios, alt: 'Extensão de cílios - fio a fio', category: 'Cílios' },
  { src: images.facial, alt: 'Tratamento facial - pele renovada', category: 'Facial' },
  { src: images.antesDepois, alt: 'Antes e depois - design de sobrancelhas', category: 'Sobrancelhas' },
  { src: images.massagem, alt: 'Ambiente de massagem relaxante', category: 'Corporal' },
  { src: images.retrato, alt: 'Cliente satisfeita - resultado final', category: 'Resultados' },
  { src: images.sobrancelhas, alt: 'Micropigmentação - técnica fio a fio', category: 'Sobrancelhas' },
  { src: images.cilios, alt: 'Lash lifting - curvatura natural', category: 'Cílios' },
  { src: images.facial, alt: 'Limpeza de pele profunda', category: 'Facial' },
];
