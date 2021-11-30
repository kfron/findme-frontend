export interface Ad {
    id: number,
    user_id: number,
    name: string,
    age: number,
    image: string,
    description: string,
    localizations: Array<Loc>
}

interface Loc {
    x: number,
    y: number
}