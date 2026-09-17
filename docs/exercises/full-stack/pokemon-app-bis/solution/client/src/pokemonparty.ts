const apiUrl: string = "http://localhost:3000/party";

export async function getParty(): Promise<number[]> {
    const response: Response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Ophalen mislukt.");
    const ids: number[] = await response.json();
    return ids;
}

export async function addToParty(id: number): Promise<void> {
    const response: Response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error("Toevoegen mislukt.");
}

export async function removeFromParty(id: number): Promise<void> {
    const response: Response = await fetch(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error("Verwijderen mislukt.");
}
