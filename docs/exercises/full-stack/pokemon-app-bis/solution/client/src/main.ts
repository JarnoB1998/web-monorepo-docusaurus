import "./style.css";
import { Pokemon, PokemonPage, PokemonLink } from "./types";
import { getPokedex, catchPokemon, releasePokemon } from "./pokedex";
import { getParty, addToParty, removeFromParty } from "./pokemonparty";

const pokedexElement = document.querySelector<HTMLDivElement>("#pokedex");
const partyElement = document.querySelector<HTMLDivElement>("#party");
const partyCount = document.querySelector<HTMLSpanElement>("#party-count");
const message = document.querySelector<HTMLParagraphElement>("#message");
if (!pokedexElement || !partyElement || !partyCount || !message)
    throw new Error("HTML-element ontbreekt.");
let pokemon: Pokemon[] = [];

const createCard = (item: Pokemon): HTMLElement => {
    const card: HTMLElement = document.createElement("article");
    const title: HTMLHeadingElement = document.createElement("h3");
    title.textContent = item.name;
    card.appendChild(title);
    if (item.sprites.front_default) {
        const image: HTMLImageElement = document.createElement("img");
        image.src = item.sprites.front_default;
        image.alt = item.name;
        card.appendChild(image);
    }
    return card;
};

const render = async (): Promise<void> => {
    const caught: number[] = await getPokedex();
    const party: number[] = await getParty();
    pokedexElement.replaceChildren();
    partyElement.replaceChildren();
    partyCount.textContent = `(${party.length}/6)`;
    for (const item of pokemon) {
        const card: HTMLElement = createCard(item);
        const isCaught: boolean = caught.includes(item.id);
        const inParty: boolean = party.includes(item.id);
        const status: HTMLParagraphElement = document.createElement("p");
        status.textContent = isCaught ? "Gevangen" : "Nog niet gevangen";
        card.appendChild(status);
        const catchButton: HTMLButtonElement = document.createElement("button");
        catchButton.textContent = isCaught ? "Laat los" : "Vang";
        catchButton.addEventListener("click", async (): Promise<void> => {
            catchButton.disabled = true;
            try {
                if (isCaught) await releasePokemon(item.id);
                else await catchPokemon(item.id);
                await render();
                message.textContent = isCaught ? "Pokémon vrijgelaten." : "Pokémon gevangen.";
            } catch (error: unknown) {
                console.error(error);
                message.textContent = "Vangstatus aanpassen mislukt.";
                catchButton.disabled = false;
            }
        });
        card.appendChild(catchButton);
        if (isCaught) {
            const partyButton: HTMLButtonElement = document.createElement("button");
            partyButton.textContent = inParty ? "Uit party" : "In party";
            partyButton.disabled = !inParty && party.length >= 6;
            partyButton.addEventListener("click", async (): Promise<void> => {
                partyButton.disabled = true;
                try {
                    if (inParty) await removeFromParty(item.id);
                    else await addToParty(item.id);
                    await render();
                    message.textContent = "Party aangepast.";
                } catch (error: unknown) {
                    console.error(error);
                    message.textContent =
                        "Party aanpassen mislukt. Een party bevat maximaal zes gevangen Pokémon.";
                    partyButton.disabled = false;
                }
            });
            card.appendChild(partyButton);
        }
        pokedexElement.appendChild(card);
        if (inParty) partyElement.appendChild(createCard(item));
    }
};

const main = async (): Promise<void> => {
    try {
        message.textContent = "Pokémon laden...";
        const response: Response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!response.ok) throw new Error("Pokédex ophalen mislukt.");
        const page: PokemonPage = await response.json();
        pokemon = await Promise.all(
            page.results.map(async (item: PokemonLink): Promise<Pokemon> => {
                const response: Response = await fetch(item.url);
                if (!response.ok) throw new Error("Pokémon ophalen mislukt.");
                const pokemon: Pokemon = await response.json();
                return pokemon;
            })
        );
        await render();
        message.textContent = "";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Pokémon ophalen mislukt. Controleer de API en herlaad de pagina.";
    }
};
main();
