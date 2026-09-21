import { type KostData } from "../types.ts";

export class Kost {
    public readonly uitgave: string;
    public readonly prijs: number;

    public constructor(
        uitgave: string,
        prijs: number
    ) {
        this.uitgave = uitgave;
        this.prijs = prijs;
    }

    public toJSON(): KostData {
        return { uitgave: this.uitgave, prijs: this.prijs };
    }
}
