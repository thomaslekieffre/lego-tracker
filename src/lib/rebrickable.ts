const REBRICKABLE_API_BASE = 'https://rebrickable.com/api/v3';
const REBRICKABLE_API_KEY = process.env.NEXT_PUBLIC_REBRICKABLE_API_KEY;

if (!REBRICKABLE_API_KEY) {
  throw new Error('Missing Rebrickable API key');
}

type RebrickableOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

export const rebrickableApi = async <T>(
  endpoint: string,
  options: RebrickableOptions = {}
): Promise<T> => {
  const { method = 'GET', body } = options;

  const response = await fetch(`${REBRICKABLE_API_BASE}${endpoint}`, {
    method,
    headers: {
      Authorization: `key ${REBRICKABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Rebrickable API error: ${response.statusText}`);
  }

  return response.json();
};
