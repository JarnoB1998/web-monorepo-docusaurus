import { Auto, Fiets, Voertuig } from "./voertuigen.js";

const bmw: Auto = new Auto("bmw", "BENZINE");
const tesla: Auto = new Auto("tesla", "ELEKTRISCH");
const koersfiets: Fiets = new Fiets("koersfiets", "GEEN");
const speedelec: Fiets = new Fiets("speedelec", "ELEKTRISCH");

const voertuigen: Voertuig[] = [bmw, tesla, koersfiets, speedelec];

for (const voertuig of voertuigen) {
    voertuig.rijden();
}
