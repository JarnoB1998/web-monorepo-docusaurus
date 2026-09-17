export type Brandstof = "BENZINE" | "ELEKTRISCH" | "GEEN";

export class Voertuig {
    public constructor(
        protected readonly naam: string,
        protected readonly brandstof: Brandstof,
    ) {}

    public rijden(): void {
        console.log(`${this.naam} rijdt met brandstof ${this.brandstof}`);
    }
}

export class Auto extends Voertuig {
    public constructor(naam: string, brandstof: Brandstof) {
        super(naam, brandstof);
    }

    public override rijden(): void {
        console.log(`${this.naam} rijdt op de weg met brandstof ${this.brandstof}`);
    }
}

export class Fiets extends Voertuig {
    public constructor(naam: string, brandstof: Brandstof) {
        super(naam, brandstof);
    }

    public override rijden(): void {
        console.log(`${this.naam} rijdt op het fietspad met brandstof ${this.brandstof}`);
    }
}
