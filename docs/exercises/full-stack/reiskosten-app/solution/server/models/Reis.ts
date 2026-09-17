import { ReisData, KostData } from "../types";
import { Kost } from "./Kost";

export class Reis {
    private _kosten: Kost[] = [];

    public constructor(
        public readonly id: number,
        public readonly bestemming: string,
        public readonly jaar: number
    ) {}

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
