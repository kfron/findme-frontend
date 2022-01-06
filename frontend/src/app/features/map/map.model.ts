import { Position } from 'nativescript-google-maps-sdk';
export interface Finding {
    id: number,
    ad_id: number,
    user_id: number
    found_at: Date,
    prev_id: number | null,
    next_id: number | null,
    position: Position,
    name: string,
    image: string,
    age: number
}