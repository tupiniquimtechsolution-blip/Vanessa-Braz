// Dados demonstrativos - PENDENTE_DE_CONFIRMACAO para dados reais
export const DEMO_MODE = true;

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number; // minutos
  price: number;
  category: string;
  image?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  clientName: string;
  clientPhone: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export const services: Service[] = [
  {
    id: '1',
    name: 'Design de Sobrancelhas',
    slug: 'design-sobrancelhas',
    description: 'Design personalizado com técnica de henna ou linha, valorizando o formato natural do seu rosto.',
    duration: 45,
    price: 60,
    category: 'Sobrancelhas',
  },
  {
    id: '2',
    name: 'Micropigmentação de Sobrancelhas',
    slug: 'micropigmentacao-sobrancelhas',
    description: 'Técnica fio a fio com pigmentos de alta qualidade para sobrancelhas naturais e definidas.',
    duration: 120,
    price: 450,
    category: 'Sobrancelhas',
  },
  {
    id: '3',
    name: 'Extensão de Cílios',
    slug: 'extensao-cilios',
    description: 'Cílios fio a fio com efeito natural ou volume, para um olhar marcante e sofisticado.',
    duration: 90,
    price: 180,
    category: 'Cílios',
  },
  {
    id: '4',
    name: 'Lash Lifting',
    slug: 'lash-lifting',
    description: 'Curvatura natural dos seus cílios com tratamento nutritivo. Duração de 6 a 8 semanas.',
    duration: 60,
    price: 120,
    category: 'Cílios',
  },
  {
    id: '5',
    name: 'Limpeza de Pele Profunda',
    slug: 'limpeza-pele',
    description: 'Tratamento completo com extração, alta frequência e máscara calmante para uma pele renovada.',
    duration: 75,
    price: 150,
    category: 'Facial',
  },
  {
    id: '6',
    name: 'Peeling de Diamante',
    slug: 'peeling-diamante',
    description: 'Microdermoabrasão suave que renova a pele, reduz manchas e linhas finas.',
    duration: 60,
    price: 200,
    category: 'Facial',
  },
  {
    id: '7',
    name: 'Massagem Relaxante',
    slug: 'massagem-relaxante',
    description: 'Massagem corporal com óleos essenciais para alívio do estresse e tensão muscular.',
    duration: 60,
    price: 130,
    category: 'Corporal',
  },
  {
    id: '8',
    name: 'Drenagem Linfática',
    slug: 'drenagem-linfatica',
    description: 'Técnica manual que estimula o sistema linfático, reduzindo inchaço e retenção.',
    duration: 60,
    price: 140,
    category: 'Corporal',
  },
];

export const categories = [...new Set(services.map(s => s.category))];

// Horário de funcionamento
export const businessHours = {
  monday: { open: '09:00', close: '19:00' },
  tuesday: { open: '09:00', close: '19:00' },
  wednesday: { open: '09:00', close: '19:00' },
  thursday: { open: '09:00', close: '20:00' },
  friday: { open: '09:00', close: '20:00' },
  saturday: { open: '09:00', close: '16:00' },
  sunday: null, // fechado
};

// Informações do negócio (DEMONSTRATIVOS)
export const businessInfo = {
  name: 'Vanessa Braz',
  tagline: 'Beleza & Autoestima',
  description: 'Cuidar de você é minha missão. Ofereço serviços de beleza com técnica, carinho e produtos de alta qualidade para realçar sua beleza natural.',
  phone: 'PENDENTE_DE_CONFIRMACAO',
  whatsapp: '5511999999999', // DADOS_DEMONSTRATIVOS
  email: 'contato@vanessabraz.com.br', // DADOS_DEMONSTRATIVOS
  instagram: '@vanessabraz.beleza', // DADOS_DEMONSTRATIVOS
  address: 'PENDENTE_DE_CONFIRMACAO',
  city: 'PENDENTE_DE_CONFIRMACAO',
  state: 'SP',
};

export const faqItems = [
  {
    question: 'Como faço para agendar um horário?',
    answer: 'Você pode agendar diretamente pelo nosso site, clicando em "Agendar Agora". Escolha o serviço, data e horário desejado.',
  },
  {
    question: 'Posso cancelar ou remarcar meu agendamento?',
    answer: 'Sim! Você pode cancelar ou remarcar com até 24 horas de antecedência sem custo. Basta acessar sua área do cliente.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos PIX, cartão de crédito, cartão de débito e dinheiro. Pagamento online disponível via Mercado Pago.',
  },
  {
    question: 'Os produtos utilizados são de qualidade?',
    answer: 'Sim! Trabalhamos exclusivamente com marcas reconhecidas e produtos de alta qualidade, todos regulamentados pela ANVISA.',
  },
  {
    question: 'Preciso de algum preparo antes do procedimento?',
    answer: 'Depende do serviço. Ao agendar, enviaremos orientações específicas. Em geral, evite exposição solar intensa 48h antes.',
  },
  {
    question: 'O espaço é acessível?',
    answer: 'Sim! Nosso espaço foi pensado para oferecer conforto e acessibilidade a todas as clientes.',
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Carolina M.',
    text: 'A Vanessa é incrível! Minha sobrancelha ficou perfeita, super natural. Recomendo demais!',
    rating: 5,
    service: 'Design de Sobrancelhas',
  },
  {
    id: '2',
    name: 'Fernanda S.',
    text: 'Ambiente acolhedor, profissional atenciosa e resultado maravilhoso. Virei cliente fiel!',
    rating: 5,
    service: 'Extensão de Cílios',
  },
  {
    id: '3',
    name: 'Juliana R.',
    text: 'A limpeza de pele foi maravilhosa! Minha pele nunca esteve tão bonita. Obrigada, Vanessa!',
    rating: 5,
    service: 'Limpeza de Pele',
  },
];
