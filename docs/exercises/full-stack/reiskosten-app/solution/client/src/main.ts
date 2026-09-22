import "./style.css";
import type { ReisData, KostData } from "./types";

const apiUrl: string = "http://localhost:3000";
const reisForm = document.querySelector<HTMLFormElement>("#reis-form");
const bestemmingInput = document.querySelector<HTMLInputElement>("#bestemming");
const jaarInput = document.querySelector<HTMLInputElement>("#jaar");
const reizenTable = document.querySelector<HTMLTableSectionElement>("#reizen");
const kostenSection = document.querySelector<HTMLElement>("#kosten-section");
const kostenTitle = document.querySelector<HTMLHeadingElement>("#kosten-title");
const kostForm = document.querySelector<HTMLFormElement>("#kost-form");
const uitgaveInput = document.querySelector<HTMLInputElement>("#uitgave");
const prijsInput = document.querySelector<HTMLInputElement>("#prijs");
const kostenTable = document.querySelector<HTMLTableSectionElement>("#kosten");
const totaal = document.querySelector<HTMLParagraphElement>("#totaal");
const message = document.querySelector<HTMLParagraphElement>("#message");
if (
    !reisForm ||
    !bestemmingInput ||
    !jaarInput ||
    !reizenTable ||
    !kostenSection ||
    !kostenTitle ||
    !kostForm ||
    !uitgaveInput ||
    !prijsInput ||
    !kostenTable ||
    !totaal ||
    !message
)
    throw new Error("HTML-element ontbreekt.");
let selectedId: number | undefined;

const loadKosten = async (id: number): Promise<void> => {
    const response: Response = await fetch(`${apiUrl}/reis/${id}`);
    if (!response.ok) throw new Error("De reis kon niet worden geladen.");
    const reis: ReisData = await response.json();
    selectedId = id;
    kostenTitle.textContent = `Kosten voor ${reis.bestemming}`;
    kostenSection.hidden = false;
    kostenTable.replaceChildren();
    for (const kost of reis.kosten) {
        const row: HTMLTableRowElement = document.createElement("tr");
        const uitgave: HTMLTableCellElement = document.createElement("td");
        uitgave.textContent = kost.uitgave;
        const prijs: HTMLTableCellElement = document.createElement("td");
        prijs.textContent = kost.prijs.toFixed(2);
        row.append(uitgave, prijs);
        kostenTable.appendChild(row);
    }
    const totalResponse: Response = await fetch(`${apiUrl}/reis/${id}/kosten`);
    if (!totalResponse.ok) throw new Error("Het totaal kon niet worden geladen.");
    const sum: number = await totalResponse.json();
    totaal.textContent = `Totaal: € ${sum.toFixed(2)}`;
};

const loadReizen = async (): Promise<void> => {
    const response: Response = await fetch(`${apiUrl}/reizen`);
    if (!response.ok) throw new Error("De reizen konden niet worden geladen.");
    const reizen: ReisData[] = await response.json();
    reizenTable.replaceChildren();
    for (const reis of reizen) {
        const row: HTMLTableRowElement = document.createElement("tr");
        const bestemming: HTMLTableCellElement = document.createElement("td");
        bestemming.textContent = reis.bestemming;
        const jaar: HTMLTableCellElement = document.createElement("td");
        jaar.textContent = String(reis.jaar);
        const actions: HTMLTableCellElement = document.createElement("td");
        const button: HTMLButtonElement = document.createElement("button");
        button.textContent = "Kosten bekijken";
        button.addEventListener("click", async (): Promise<void> => {
            try {
                await loadKosten(reis.id);
                message.textContent = "";
            } catch (error: unknown) {
                console.error(error);
                message.textContent = "De kosten konden niet worden geladen.";
            }
        });
        actions.appendChild(button);
        row.append(bestemming, jaar, actions);
        reizenTable.appendChild(row);
    }
};

reisForm.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    try {
        const response: Response = await fetch(`${apiUrl}/reis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bestemming: bestemmingInput.value.trim(),
                jaar: Number(jaarInput.value)
            })
        });
        if (!response.ok) throw new Error("Ongeldige reis.");
        const reis: ReisData = await response.json();
        reisForm.reset();
        await loadReizen();
        await loadKosten(reis.id);
        message.textContent = "Reis toegevoegd.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De reis kon niet worden toegevoegd.";
    }
});
kostForm.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    if (selectedId === undefined) return;
    const id: number = selectedId;
    const kost: KostData = { uitgave: uitgaveInput.value.trim(), prijs: Number(prijsInput.value) };
    try {
        const response: Response = await fetch(`${apiUrl}/reis/${id}/kost`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(kost)
        });
        if (!response.ok) throw new Error("Ongeldige kost.");
        kostForm.reset();
        await loadKosten(id);
        message.textContent = "Kost toegevoegd.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De kost kon niet worden toegevoegd.";
    }
});
const main = async (): Promise<void> => {
    try {
        await loadReizen();
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De reizen konden niet worden geladen. Controleer de server.";
    }
};
main();
