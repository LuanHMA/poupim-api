export interface Categories {
    id: number
    name: string
    created_at: string
    userId: number
}

export type CategoryCreate = Omit<Categories, "id" | "created_at">

export type CategoryDelete = Pick<Categories, "id" | "userId">

export type CategoryUpdate = Pick<Categories, "id" | "name" | "userId">
