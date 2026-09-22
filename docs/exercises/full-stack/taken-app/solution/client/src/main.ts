import "./style.css";
import type { Taak } from "./types";

const apiUrl: string = "http://localhost:3000";
const form = document.querySelector<HTMLFormElement>("#task-form");
const omschrijvingInput = document.querySelector<HTMLInputElement>("#omschrijving");
const naamInput = document.querySelector<HTMLInputElement>("#naam");
const urgentInput = document.querySelector<HTMLInputElement>("#urgent");
const executeButton = document.querySelector<HTMLButtonElement>("#execute");
const list = document.querySelector<HTMLOListElement>("#tasks");
const message = document.querySelector<HTMLParagraphElement>("#message");
if (
    !form ||
    !omschrijvingInput ||
    !naamInput ||
    !urgentInput ||
    !executeButton ||
    !list ||
    !message
)
    throw new Error("HTML-element ontbreekt.");

const loadTasks = async (): Promise<void> => {
    const response: Response = await fetch(`${apiUrl}/tasks`);
    if (!response.ok) throw new Error("Taken ophalen mislukt.");
    const taken: Taak[] = await response.json();
    list.replaceChildren();
    executeButton.disabled = taken.length === 0;
    for (const taak of taken) {
        const item: HTMLLIElement = document.createElement("li");
        item.textContent = `${taak.omschrijving} (${taak.naam})`;
        list.appendChild(item);
    }
};
form.addEventListener("submit", async (event: SubmitEvent): Promise<void> => {
    event.preventDefault();
    const path: string = urgentInput.checked ? "/task-urgent" : "/task";
    try {
        const response: Response = await fetch(apiUrl + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                omschrijving: omschrijvingInput.value.trim(),
                naam: naamInput.value.trim()
            })
        });
        if (!response.ok) throw new Error("Taak toevoegen mislukt.");
        form.reset();
        await loadTasks();
        message.textContent = "Taak toegevoegd.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De taak kon niet worden toegevoegd.";
    }
});
executeButton.addEventListener("click", async (): Promise<void> => {
    executeButton.disabled = true;
    try {
        const response: Response = await fetch(`${apiUrl}/task`, { method: "DELETE" });
        if (!response.ok) throw new Error("Geen taak beschikbaar.");
        const taak: Taak = await response.json();
        alert(`Uitgevoerd: ${taak.omschrijving} (${taak.naam})`);
        await loadTasks();
        message.textContent = "Taak uitgevoerd.";
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "De taak kon niet worden uitgevoerd.";
        executeButton.disabled = false;
    }
});
const main = async (): Promise<void> => {
    try {
        await loadTasks();
    } catch (error: unknown) {
        console.error(error);
        message.textContent = "Taken ophalen mislukt. Controleer de server.";
    }
};
main();
