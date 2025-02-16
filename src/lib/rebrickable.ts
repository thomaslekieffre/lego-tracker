const API_BASE_URL = 'https://rebrickable.com/api/v3';
const API_KEY = process.env.NEXT_PUBLIC_REBRICKABLE_API_KEY;

if (!API_KEY) {
  throw new Error('Clé API Rebrickable non configurée');
}

type RebrickableResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type RebrickablePart = {
  part_num: string;
  name: string;
  part_img_url: string | null;
  part_url: string;
  print_of: string | null;
  external_ids: {
    BrickLink: string[];
    BrickOwl: string[];
    LEGO: string[];
  };
};

export type RebrickableColor = {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  external_ids: {
    BrickLink: {
      ext_ids: number[];
      ext_descrs: string[][];
    };
    LEGO: {
      ext_ids: number[];
      ext_descrs: string[][];
    };
    Peeron: {
      ext_ids: string[];
      ext_descrs: string[][];
    };
    LDraw: {
      ext_ids: number[];
      ext_descrs: string[][];
    };
  };
};

async function fetchFromAPI<T>(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;

  console.log('Rebrickable API call:', url);

  const response = await fetch(url, {
    headers: {
      Authorization: `key ${API_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Rebrickable API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Erreur API Rebrickable: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Rebrickable API response:', data);
  return data;
}

export const rebrickableClient = {
  async searchParts(query: string, pageSize = 10): Promise<RebrickablePart[]> {
    // Nettoyer la requête pour la recherche
    const cleanQuery = query.replace(/^#/, '').toLowerCase();

    // Normaliser le numéro de pièce pour la recherche
    const normalizedQuery = cleanQuery
      .replace(/pb/i, 'bpr') // Convertir pb en bpr
      .replace(/pr/i, 'bpr'); // Convertir pr en bpr

    // Si la requête ressemble à un numéro de pièce, essayer d'abord une recherche exacte
    if (/^\d+[a-z]?/.test(normalizedQuery)) {
      try {
        const exactData = await fetchFromAPI<RebrickablePart>(
          `/lego/parts/${encodeURIComponent(normalizedQuery)}/`
        );
        if (exactData) {
          return [exactData];
        }
      } catch (error) {
        console.log('Pas de correspondance exacte, tentative de recherche...');
      }
    }

    // Faire une recherche générale avec la requête originale
    const searchData = await fetchFromAPI<RebrickableResponse<RebrickablePart>>('/lego/parts/', {
      search: cleanQuery,
      page_size: pageSize.toString(),
    });

    // Si aucun résultat, essayer avec la version normalisée
    if (searchData.results.length === 0 && normalizedQuery !== cleanQuery) {
      const normalizedData = await fetchFromAPI<RebrickableResponse<RebrickablePart>>(
        '/lego/parts/',
        {
          search: normalizedQuery,
          page_size: pageSize.toString(),
        }
      );
      return normalizedData.results;
    }

    return searchData.results;
  },

  async getPartColors(partNum: string): Promise<RebrickableColor[]> {
    const data = await fetchFromAPI<RebrickableColor>(
      `/lego/parts/${encodeURIComponent(partNum)}/colors/`
    );
    return data.results;
  },

  async getPartDetails(partNum: string): Promise<RebrickablePart> {
    return fetchFromAPI(`/lego/parts/${encodeURIComponent(partNum)}/`);
  },
};
