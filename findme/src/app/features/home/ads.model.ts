export interface Ad {
    id: number,
    name: string,
    age: number,
    imgUrl: string,
    localizations: Array<Loc>
}

interface Loc {
    x: number,
    y: number
}