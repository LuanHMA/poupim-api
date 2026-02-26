import { Domain } from "node:domain";

export class DomainError extends Error {
    public readonly status: number;
    public readonly details?: unknown;

    constructor(message: string, status: number = 500, details?: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.details = details
    }
}

export class NotFoundError extends DomainError {
    constructor(message: string = "Recurso não encontrado.") {
        super(message, 404);
    }
}

export class ConflictError extends DomainError {
    constructor(message: string = "O recurso já existe ou a operação causaria um conflito.") {
        super(message, 409);
    }
}

export class BadRequestError extends DomainError {
    constructor(message = "Requisição inválida.") {
        super(message, 400)
    }
}

export class UnauthorizedError extends DomainError {
    constructor(message = "Acesso não autorizado.") {
        super(message, 401)
    }
}