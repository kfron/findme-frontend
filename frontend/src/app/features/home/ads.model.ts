import { Position } from "nativescript-google-maps-sdk";

export interface Ad {
    id: number,
    user_id: number,
    name: string,
    age: number,
    image: string,
    description: string,
    found_at: Date,
    lastKnownPosition: Position
}