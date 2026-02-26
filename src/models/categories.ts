export interface Categories {
    id: number
    name: string
    created_at: string
    user_id: number
    type: "INCOME" | "EXPENSE"
}

export type CategoryCreate = Omit<Categories, "id" | "created_at">

export type CategoryDelete = Pick<Categories, "id" | "user_id">

export type CategoryUpdate = Pick<Categories, "id" | "name" | "user_id" | 'type'>
