export interface Account {
    id: string,
    title: string,
    type: string,
    color: string,
    Methods?: Method[]
}


export interface Method {
    id: string,
    title: string,
    cardType: string
    idAccount?: string
}