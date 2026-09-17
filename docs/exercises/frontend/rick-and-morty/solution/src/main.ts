import './style.css';
import {isRecord, errorMessage} from './api';
interface Character { id: number; name: string; status: string; species: string; gender: string; image: string; }
interface CharacterResponse { info: { count: number; pages: number }; results: Character[]; }
function isCharacter(value: unknown): value is Character {
  return isRecord(value) && typeof value.id === 'number' && typeof value.name === 'string'
    && typeof value.status === 'string' && typeof value.species === 'string'
    && typeof value.gender === 'string' && typeof value.image === 'string';
}
function isCharacterResponse(value: unknown): value is CharacterResponse {
  return isRecord(value) && isRecord(value.info)
    && typeof value.info.count === 'number' && Number.isInteger(value.info.count) && value.info.count >= 0
    && typeof value.info.pages === 'number' && Number.isInteger(value.info.pages) && value.info.pages >= 0
    && Array.isArray(value.results) && value.results.every((character: unknown): boolean => isCharacter(character));
}
function renderCharacters(characters: Character[], list: HTMLUListElement): void {
  list.replaceChildren();
  characters.forEach((character: Character): void => {
    const item: HTMLLIElement = document.createElement('li');
    item.classList.add('card');
    const title: HTMLHeadingElement = document.createElement('h2');
    title.textContent = character.name;
    const details: HTMLParagraphElement = document.createElement('p');
    details.textContent = `${character.status} | ${character.species} | ${character.gender}`;
    const image: HTMLImageElement = document.createElement('img');
    image.src = character.image; image.alt = character.name;
    item.append(title, image, details); list.appendChild(item);
  });
}
function main(): void {
  const form: HTMLFormElement | null = document.querySelector<HTMLFormElement>('#search');
  const input: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#name');
  const submit: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#submit');
  const previous: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#previous');
  const next: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#next');
  const status: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>('#status');
  const pageLabel: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#page');
  const results: HTMLUListElement | null = document.querySelector<HTMLUListElement>('#results');
  if (form === null || input === null || submit === null || previous === null || next === null || status === null || pageLabel === null || results === null) throw new Error('De HTML is onvolledig.');
  let currentPage: number = 1;
  let totalPages: number = 0;
  let currentName: string = '';
  let loading: boolean = false;
  const updateButtons: () => void = (): void => {
    submit.disabled = loading;
    previous.disabled = loading || currentPage <= 1 || totalPages === 0;
    next.disabled = loading || currentPage >= totalPages;
  };
  const load: (requestedPage: number, name: string) => Promise<void> = async (requestedPage: number, name: string): Promise<void> => {
    if (loading) return;
    loading = true; updateButtons();
    results.replaceChildren(); status.textContent = 'Personages laden…'; pageLabel.textContent = 'Laden…';
    try {
      const url: URL = new URL('https://rickandmortyapi.com/api/character');
      url.searchParams.set('page', String(requestedPage)); url.searchParams.set('name', name);
      const response: Response = await fetch(url);
      // Deze API gebruikt HTTP 404 wanneer een zoekopdracht geen resultaten heeft.
      if (response.status === 404) {
        currentPage = 1; totalPages = 0; currentName = name;
        status.textContent = 'Geen personages gevonden. 0 resultaten.'; pageLabel.textContent = 'Pagina 0 van 0';
        return;
      }
      if (!response.ok) throw new Error(`Ophalen mislukt: HTTP ${response.status}`);
      const data: unknown = await response.json();
      if (!isCharacterResponse(data)) throw new Error('Onverwacht antwoord van de personage-API.');
      currentPage = requestedPage; totalPages = data.info.pages; currentName = name;
      renderCharacters(data.results, results);
      status.textContent = `${data.info.count} resultaten.`;
      pageLabel.textContent = `Pagina ${totalPages === 0 ? 0 : currentPage} van ${totalPages}`;
    } catch (error: unknown) {
      currentPage = 1; totalPages = 0;
      status.textContent = errorMessage(error); pageLabel.textContent = 'Pagina 0 van 0';
    } finally { loading = false; updateButtons(); }
  };
  form.addEventListener('submit', (event: SubmitEvent): void => { event.preventDefault(); void load(1, input.value.trim()); });
  previous.addEventListener('click', (_event: MouseEvent): void => { if (currentPage > 1) void load(currentPage - 1, currentName); });
  next.addEventListener('click', (_event: MouseEvent): void => { if (currentPage < totalPages) void load(currentPage + 1, currentName); });
  void load(1, '');
}
main();
