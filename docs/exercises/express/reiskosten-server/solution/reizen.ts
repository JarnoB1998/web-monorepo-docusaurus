import { Reis } from "./models/Reis";
import { Kost } from "./models/Kost";

const reizen: Reis[] = [];
let volgendId: number = 1;

export function getReizen(): Reis[] {
    return reizen;
}
export function getReisById(id: number): Reis | undefined {
    return reizen.find((reis: Reis): boolean => reis.id === id);
}
export function createReis(bestemming: string, jaar: number): Reis {
    const reis: Reis = new Reis(volgendId, bestemming, jaar);
    volgendId++;
    reizen.push(reis);
    return reis;
}
export function addKost(id: number, uitgave: string, prijs: number): Reis | undefined {
    const reis: Reis | undefined = getReisById(id);
    if (reis) reis.voegKostToe(new Kost(uitgave, prijs));
    return reis;
}
