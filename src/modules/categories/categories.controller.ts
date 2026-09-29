import { FastifyReply, FastifyRequest } from "fastify";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

    async getAll(_request: FastifyRequest, reply: FastifyReply) {
        const categories = await this.categoriesService.getAll()

        return reply.status(200).send({ message: "Categorias buscadas com sucesso!", categories })
    }
}
