import { type ReisData, type KostData } from "../types.ts";
import type { Kost } from "./Kost.ts";

export class Reis {
    private _kosten: Kost[] = [];
    public readonly id: number;
    public readonly bestemming: string;
    public readonly jaar: number;

    public constructor(
        id: number,
        bestemming: string,
        jaar: number
    ) {
        this.id = id;
        this.bestemming = bestemming;
        this.jaar = jaar;
    }

    public voegKostToe(kost: Kost): void {
        this._kosten.push(kost);
    }

    public totaal(): number {
        return this._kosten.reduce((som: number, kost: Kost): number => som + kost.prijs, 0);
    }

    public toJSON(): ReisData {
        return {
            id: this.id,
            bestemming: this.bestemming,
            jaar: this.jaar,
            kosten: this._kosten.map((kost: Kost): KostData => kost.toJSON())
        };
    }
}
