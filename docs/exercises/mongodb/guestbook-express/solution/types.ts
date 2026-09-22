import type { ObjectId } from "mongodb";

export interface GuestBookEntry {
    _id?: ObjectId;
    name: string;
    message: string;
    date: Date;
}