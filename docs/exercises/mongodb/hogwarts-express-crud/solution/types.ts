// https://sampleapis.assimilate.be/harrypotter/spells
import type { ObjectId } from "mongodb";

export type SpellType = "Charm" | "Curse" | "Jinx" | "Hex" | "Transfiguration" | "Healing" | "Conjuration";

export interface Spell {
    _id?: ObjectId;
    id: number;
    name: string;
    type: SpellType;
    mana: number;
    description: string;
}

type SpellFieldType = "text" | "number" | "spelltype";

export interface SpellField {
    name: string;
    readonly?: boolean;
    type: SpellFieldType
}