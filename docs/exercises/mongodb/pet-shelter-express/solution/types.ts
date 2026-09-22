import type { ObjectId } from "mongodb";

export interface Pet {
    _id?: ObjectId;
    name: string;
    age: number;
    type: string;
    breed: string;

}