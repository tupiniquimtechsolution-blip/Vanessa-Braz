-- Deterministic catalog seed. Commercial fields marked pending stay pending.
-- One professional: the named business owner. No invented team.

insert into public.business_settings (
  id, name, tagline, description, phone, whatsapp, email, instagram,
  address, city, state, timezone, booking_slot_minutes, cancellation_hours, lgpd_policy_version
) values (
  '00000000-0000-4000-8000-000000000001',
  'Vanessa Braz',
  'Beleza & Autoestima',
  'Cuidar de você é minha missão. Ofereço serviços de beleza com técnica, carinho e produtos de alta qualidade para realçar sua beleza natural.',
  'PENDENTE_DE_CONFIRMACAO',
  '5511999999999',
  'contato@vanessabraz.com.br',
  '@vanessabraz.beleza',
  'PENDENTE_DE_CONFIRMACAO',
  'PENDENTE_DE_CONFIRMACAO',
  'SP',
  'America/Sao_Paulo',
  30,
  24,
  '1.0'
);

insert into public.professionals (id, display_name, bio, active, sort_order)
values (
  '11111111-1111-4111-8111-111111111111',
  'Vanessa Braz',
  'Beleza & Autoestima',
  true,
  1
);

insert into public.service_categories (id, name, slug, sort_order) values
  ('22222222-0000-4000-8000-000000000001', 'Sobrancelhas', 'sobrancelhas', 1),
  ('22222222-0000-4000-8000-000000000002', 'Cílios', 'cilios', 2),
  ('22222222-0000-4000-8000-000000000003', 'Facial', 'facial', 3),
  ('22222222-0000-4000-8000-000000000004', 'Corporal', 'corporal', 4);

insert into public.services (
  id, category_id, name, slug, description, duration_minutes, price_cents, sort_order
) values
  (
    '33333333-0000-4000-8000-000000000001',
    '22222222-0000-4000-8000-000000000001',
    'Design de Sobrancelhas',
    'design-sobrancelhas',
    'Design personalizado com técnica de henna ou linha, valorizando o formato natural do seu rosto.',
    45, 6000, 1
  ),
  (
    '33333333-0000-4000-8000-000000000002',
    '22222222-0000-4000-8000-000000000001',
    'Micropigmentação de Sobrancelhas',
    'micropigmentacao-sobrancelhas',
    'Técnica fio a fio com pigmentos de alta qualidade para sobrancelhas naturais e definidas.',
    120, 45000, 2
  ),
  (
    '33333333-0000-4000-8000-000000000003',
    '22222222-0000-4000-8000-000000000002',
    'Extensão de Cílios',
    'extensao-cilios',
    'Cílios fio a fio com efeito natural ou volume, para um olhar marcante e sofisticado.',
    90, 18000, 3
  ),
  (
    '33333333-0000-4000-8000-000000000004',
    '22222222-0000-4000-8000-000000000002',
    'Lash Lifting',
    'lash-lifting',
    'Curvatura natural dos seus cílios com tratamento nutritivo. Duração de 6 a 8 semanas.',
    60, 12000, 4
  ),
  (
    '33333333-0000-4000-8000-000000000005',
    '22222222-0000-4000-8000-000000000003',
    'Limpeza de Pele Profunda',
    'limpeza-pele',
    'Tratamento completo com extração, alta frequência e máscara calmante para uma pele renovada.',
    75, 15000, 5
  ),
  (
    '33333333-0000-4000-8000-000000000006',
    '22222222-0000-4000-8000-000000000003',
    'Peeling de Diamante',
    'peeling-diamante',
    'Microdermoabrasão suave que renova a pele, reduz manchas e linhas finas.',
    60, 20000, 6
  ),
  (
    '33333333-0000-4000-8000-000000000007',
    '22222222-0000-4000-8000-000000000004',
    'Massagem Relaxante',
    'massagem-relaxante',
    'Massagem corporal com óleos essenciais para alívio do estresse e tensão muscular.',
    60, 13000, 7
  ),
  (
    '33333333-0000-4000-8000-000000000008',
    '22222222-0000-4000-8000-000000000004',
    'Drenagem Linfática',
    'drenagem-linfatica',
    'Técnica manual que estimula o sistema linfático, reduzindo inchaço e retenção.',
    60, 14000, 8
  );

insert into public.professional_services (professional_id, service_id)
select '11111111-1111-4111-8111-111111111111', id from public.services;

-- 0 = Sunday … 6 = Saturday. Sunday closed.
insert into public.business_hours (professional_id, weekday, open_time, close_time) values
  (null, 1, '09:00', '19:00'),
  (null, 2, '09:00', '19:00'),
  (null, 3, '09:00', '19:00'),
  (null, 4, '09:00', '20:00'),
  (null, 5, '09:00', '20:00'),
  (null, 6, '09:00', '16:00');
