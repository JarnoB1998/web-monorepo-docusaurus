import type { ObjectId } from "mongodb";

export interface Beer {
    id: number;
    name: string;
    alcoholPercentage: number;
    description: string;
    type: string;
    logo: string;
}

export interface Bar {
    id: number;
    name: string;
    location: string;
    description: string;
    images: string[];
    rating: number;
}

export interface Checkin {
    _id?: ObjectId;
    id?: number;
    barId?: number;
    beerId?: number;
    bar: Bar;
    beer: Beer;
    name: string;
    comment: string;
    date: Date;
    image: string;
}

export interface CheckinForm {
    barId: number;
    beerId: number;
    comment: string;
    date: Date;
}

export interface FlashMessage {
    type: "error" | "success";
    message: string;
}


export interface User {
    username: string;
    fullname: string;
    password?: string;
}