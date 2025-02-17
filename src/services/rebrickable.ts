import { RebrickableResponse, RebrickableSet } from '@/types/rebrickable';

const API_KEY = process.env.NEXT_PUBLIC_REBRICKABLE_API_KEY;
const BASE_URL = 'https://rebrickable.com/api/v3/lego';

type SearchParams = {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  min_parts?: number;
  max_parts?: number;
  min_year?: number;
  max_year?: number;
  theme_id?: number;
};

export const searchLegoSets = async ({
  search = '',
  page = 1,
  page_size = 12,
  ordering = '-year',
  min_parts,
  max_parts,
  min_year,
  max_year,
  theme_id,
}: SearchParams = {}): Promise<RebrickableResponse> => {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    page_size: page_size.toString(),
    ordering,
    ...(min_parts && { min_parts: min_parts.toString() }),
    ...(max_parts && { max_parts: max_parts.toString() }),
    ...(min_year && { min_year: min_year.toString() }),
    ...(max_year && { max_year: max_year.toString() }),
    ...(theme_id && { theme_id: theme_id.toString() }),
  });

  const response = await fetch(`${BASE_URL}/sets/?${params.toString()}`, {
    headers: {
      Authorization: `key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la recherche des sets Lego');
  }

  return response.json();
};

export const getLegoSetByNumber = async (setNumber: string): Promise<RebrickableSet> => {
  const response = await fetch(`${BASE_URL}/sets/${setNumber}/`, {
    headers: {
      Authorization: `key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Set Lego non trouvé');
  }

  return response.json();
};
