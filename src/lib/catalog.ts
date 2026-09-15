import { services as demoServices } from './data';
import { tryGetSupabaseClient } from './supabase/client';

export interface CatalogService {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  priceCents: number;
  category: string;
  categoryId?: string;
}

export interface CatalogProfessional {
  id: string;
  name: string;
  bio: string;
}

const FALLBACK_PROFESSIONAL: CatalogProfessional = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Vanessa Braz',
  bio: 'Beleza & Autoestima',
};

const FALLBACK_SERVICES: CatalogService[] = demoServices.map((service, index) => ({
  id: `33333333-0000-4000-8000-00000000000${index + 1}`,
  name: service.name,
  slug: service.slug,
  description: service.description,
  duration: service.duration,
  price: service.price,
  priceCents: Math.round(service.price * 100),
  category: service.category,
}));

export async function loadCatalog(): Promise<{
  services: CatalogService[];
  professionals: CatalogProfessional[];
  source: 'supabase' | 'fallback';
}> {
  const supabase = tryGetSupabaseClient();
  if (!supabase) {
    return { services: FALLBACK_SERVICES, professionals: [FALLBACK_PROFESSIONAL], source: 'fallback' };
  }

  const [{ data: serviceRows, error: serviceError }, { data: professionalRows }] = await Promise.all([
    supabase
      .from('services')
      .select('id, name, slug, description, duration_minutes, price_cents, category_id, service_categories(name)')
      .eq('active', true)
      .order('sort_order'),
    supabase.from('professionals').select('id, display_name, bio').eq('active', true).order('sort_order'),
  ]);

  if (serviceError || !serviceRows?.length) {
    return { services: FALLBACK_SERVICES, professionals: [FALLBACK_PROFESSIONAL], source: 'fallback' };
  }

  const services: CatalogService[] = (serviceRows as Array<Record<string, unknown>>).map((row) => {
    const categoryRel = row.service_categories as { name?: string } | { name?: string }[] | null;
    const categoryName = Array.isArray(categoryRel) ? categoryRel[0]?.name : categoryRel?.name;
    return {
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: String(row.description ?? ''),
      duration: Number(row.duration_minutes),
      priceCents: Number(row.price_cents),
      price: Number(row.price_cents) / 100,
      category: categoryName || 'Serviços',
      categoryId: String(row.category_id),
    };
  });

  const professionals: CatalogProfessional[] = (professionalRows ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    name: String(row.display_name),
    bio: String(row.bio ?? ''),
  }));

  return {
    services,
    professionals: professionals.length ? professionals : [FALLBACK_PROFESSIONAL],
    source: 'supabase',
  };
}

export { FALLBACK_SERVICES, FALLBACK_PROFESSIONAL };
