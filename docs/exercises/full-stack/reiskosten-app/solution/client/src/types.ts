export interface KostData {
    uitgave: string;
    prijs: number;
}
export interface ReisRecord {
    id: number;
    bestemming: string;
    jaar: number;
}
export interface ReisData {
    id: number;
    bestemming: string;
    jaar: number;
    kosten: KostData[];
}
