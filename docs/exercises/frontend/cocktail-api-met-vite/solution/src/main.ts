import './style.css';
import {isRecord, fetchJson, errorMessage} from './api';
interface Cocktail { idDrink: string; strDrink: string; strInstructions: string | null; strDrinkThumb: string | null; }
interface CocktailResponse { drinks: Cocktail[] | null; }
function isCocktail(value: unknown): value is Cocktail {
  return isRecord(value) && typeof value.idDrink === 'string' && typeof value.strDrink === 'string'
    && (value.strInstructions === null || typeof value.strInstructions === 'string')
    && (value.strDrinkThumb === null || typeof value.strDrinkThumb === 'string');
}
function isCocktailResponse(value: unknown): value is CocktailResponse {
  return isRecord(value) && (value.drinks === null
    || (Array.isArray(value.drinks) && value.drinks.every((drink: unknown): boolean => isCocktail(drink))));
}
function renderCocktails(drinks: Cocktail[], target: HTMLDivElement): void {
  target.replaceChildren();
  drinks.forEach((drink: Cocktail): void => {
    const card: HTMLElement = document.createElement('article');
    card.classList.add('card');
    const title: HTMLHeadingElement = document.createElement('h2');
    title.textContent = drink.strDrink;
    const instructions: HTMLParagraphElement = document.createElement('p');
    instructions.textContent = drink.strInstructions ?? 'Geen instructies beschikbaar.';
    card.append(title, instructions);
    if (drink.strDrinkThumb !== null) {
      const image: HTMLImageElement = document.createElement('img');
      image.src = drink.strDrinkThumb;
      image.alt = drink.strDrink;
      card.appendChild(image);
    }
    target.appendChild(card);
  });
}
function main(): void {
  const form: HTMLFormElement | null = document.querySelector<HTMLFormElement>('#search');
  const input: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#name');
  const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#submit');
  const status: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>('#status');
  const results: HTMLDivElement | null = document.querySelector<HTMLDivElement>('#results');
  if (form === null || input === null || button === null || status === null || results === null) throw new Error('De HTML is onvolledig.');
  let loading: boolean = false;
  const search: () => Promise<void> = async (): Promise<void> => {
    if (loading) return;
    const term: string = input.value.trim();
    results.replaceChildren();
    if (term.length === 0) { status.textContent = 'Vul een zoekterm in.'; return; }
    loading = true;
    button.disabled = true;
    status.textContent = 'Cocktails laden…';
    try {
      const url: URL = new URL('https://www.thecocktaildb.com/api/json/v1/1/search.php');
      url.searchParams.set('s', term);
      const data: unknown = await fetchJson(url);
      if (!isCocktailResponse(data)) throw new Error('Onverwacht antwoord van de cocktail-API.');
      const drinks: Cocktail[] = data.drinks ?? [];
      renderCocktails(drinks, results);
      status.textContent = drinks.length === 0 ? 'Geen cocktails gevonden.' : `${drinks.length} cocktails gevonden.`;
    } catch (error: unknown) { status.textContent = errorMessage(error); }
    finally { loading = false; button.disabled = false; }
  };
  form.addEventListener('submit', (event: SubmitEvent): void => { event.preventDefault(); void search(); });
  void search();
}
main();
