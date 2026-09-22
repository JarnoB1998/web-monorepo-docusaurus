import type { KostData } from "../types";

export class Kost {
    public constructor(
        public readonly uitgave: string,
        public readonly prijs: number
    ) {}

    public toJSON(): KostData {
        return { uitgave: this.uitgave, prijs: this.prijs };
    }
}
