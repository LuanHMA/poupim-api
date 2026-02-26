export interface Users {
    id: number;
    name: string;
    email: string;
    password: string;
}

export type UserCreate = Omit<Users, 'id'>

export type UserLogin = Pick<Users, "email" | "password">