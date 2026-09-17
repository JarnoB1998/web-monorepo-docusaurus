export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function fetchJson(url: URL): Promise<unknown> {
  const response: Response = await fetch(url);
  if (!response.ok) throw new Error(`Ophalen mislukt: HTTP ${response.status}`);
  const data: unknown = await response.json();
  return data;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Er ging iets mis bij het ophalen.';
}
