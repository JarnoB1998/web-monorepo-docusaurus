import "./style.css";
import { Pokemon, PokemonPage, PokemonLink, OwnedPokemon } from "./types";

const apiUrl: string = "http://localhost:3000/pokemon";
const pageSize: number = 20;
let page: number = 1;
const overview = document.querySelector<HTMLDivElement>("#overview");
const owned = document.querySelector<HTMLDivElement>("#owned");
const overviewSection = document.querySelector<HTMLElement>("#overview-section");
const ownedSection = document.querySelector<HTMLElement>("#owned-section");
const showOverview = document.querySelector<HTMLButtonElement>("#show-overview");
const showOwned = document.querySelector<HTMLButtonElement>("#show-owned");
const previous = document.querySelector<HTMLButtonElement>("#previous");
const next = document.querySelector<HTMLButtonElement>("#next");
const pageNumber = document.querySelector<HTMLSpanElement>("#page-number");
const message = document.querySelector<HTMLParagraphElement>("#message");
if (
    !overview ||
    !owned ||
    !overviewSection ||
    !ownedSection ||
    !showOverview ||
    !showOwned ||
    !previous ||
    !next ||
    !pageNumber ||
    !message
)
    throw new Error("HTML-element ontbreekt.");

const getPokemon = async (url: string): Promise<Pokemon> => {
    const response: Response = await fetch(url);
    if (!response.ok) throw new Error("Pokémon ophalen mislukt.");
    return await response.json();
};
const createCard = (pokemon: Pokemon): HTMLElement => {
    const card: HTMLElement = document.createElement("article");
    const title: HTMLHeadingElement = document.createElement("h3");
    title.textContent = pokemon.name;
    card.appendChild(title);
    if (pokemon.sprites.front_default) {
        const image: HTMLImageElement = document.createElement("img");
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;
        card.appendChild(image);
    }
    return card;
};
const loadPokemon = async (): Promise<void> => {
    previous.disabled = true;
    next.disabled = true;
    const pageOffset: number = (page - 1) * pageSize;
    const response: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${pageOffset}`
    );
    if (!response.ok) throw new Error("Pokédex ophalen mislukt.");
    const result: PokemonPage = await response.json();
    const ownedResponse: Response = await fetch(apiUrl);
    if (!ownedResponse.ok) throw new Error("Gevangen Pokémon ophalen mislukt.");
    const saved: OwnedPokemon[] = await ownedResponse.json();
    const pokemon: Pokemon[] = await Promise.all(
        result.results.map(
            async (item: PokemonLink): Promise<Pokemon> => await getPokemon(item.url)
        )
    );
    const savedPokemon: Pokemon[] = await Promise.all(
        saved.map(
            async (item: OwnedPokemon): Promise<Pokemon> =>
                await getPokemon(`https://pokeapi.co/api/v2/pokemon/${item.id}`)
        )
    );
    overview.replaceChildren();
    owned.replaceChildren();
    for (const item of pokemon) {
        const card: HTMLElement = createCard(item);
        if (!saved.find((caught: OwnedPokemon): boolean => caught.id === item.id)) {
            const button: HTMLButtonElement = document.createElement("button");
            button.textContent = "Gevangen";
            button.addEventListener("click", async (): Promise<void> => {
                button.disabled = true;
                try {
                    const response: Response = await fetch(apiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id, name: item.name })
                    });
                    if (!response.ok) throw new Error("Vangen mislukt.");
                    await loadPokemon();
                    message.textContent = "Pokémon gevangen.";
                } catch (error: unknown) {
                    console.error(error);
                    message.textContent = "Vangen mislukt.";
                    button.disabled = false;
                }
            });
            card.appendChild(button);
        }
        overview.appendChild(card);
    }
    for (const item of savedPokemon) {
        const card: HTMLElement = createCard(item);
        const button: HTMLButtonElement = document.createElement("button");
        button.textContent = "Vrijlaten";
        button.addEventListener("click", async (): Promise<void> => {
            button.disabled = true;
            try {
                const response: Response = await fetch(`${apiUrl}/${item.id}`, {
                    method: "DELETE"
                });
                if (!response.ok) throw new Error("Vrijlaten mislukt.");
                await loadPokemon();
                message.textContent = "Pokémon vrijgelaten.";
            } catch (error: unknown) {
                console.error(error);
                message.textContent = "Vrijlaten mislukt.";
                button.disabled = false;
            }
        });
        card.appendChild(button);
        owned.appendChild(card);
    }
    pageNumber.textContent = `Pagina ${page}`;
    previous.disabled = page === 1;
    next.disabled = page * pageSize >= result.count;
};
const refresh = async (): Promise<void> => {
    try {
        await loadPokemon();
        message.textContent = "";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Ophalen mislukt. Controleer de API en herlaad de pagina.";
    }
};
previous.addEventListener("click", async (): Promise<void> => {
    if (page > 1) {
        page--;
        await refresh();
    }
});
next.addEventListener("click", async (): Promise<void> => {
    page++;
    await refresh();
});
showOverview.addEventListener("click", (): void => {
    overviewSection.hidden = false;
    ownedSection.hidden = true;
});
showOwned.addEventListener("click", (): void => {
    overviewSection.hidden = true;
    ownedSection.hidden = false;
});
refresh();
