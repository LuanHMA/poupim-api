import { NotFoundError } from "../../errors/domain-errors";
import { CategoriesRepository } from "../categories/categories.repository";
import {
    TransactionsCreateInput,
    TransactionsCreateOutput,
    TransactionsDeleteInput,
    TransactionsDeleteOutput,
    TransactionsGetAllInput,
    TransactionsGetAllOutput,
    TransactionsUpdateInput,
    TransactionsUpdateOutput,
} from "./transactions.contracts";
import { TransactionsRepository } from "./transactions.repository";

export class TransactionsService {
    constructor(
        private transactionsRepository: TransactionsRepository,
        private categoriesRepository: CategoriesRepository,
    ) {}

    async getAll({ user_id }: TransactionsGetAllInput): Promise<TransactionsGetAllOutput> {
        return this.transactionsRepository.findAllByUserId({ user_id })
    }

    async create({ amount, category_id, description, type, user_id }: TransactionsCreateInput): Promise<TransactionsCreateOutput> {
        const category = await this.categoriesRepository.findByIdAndUserId({ id: category_id, user_id })

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await this.transactionsRepository.create({
            amount,
            category_id,
            description,
            type,
            user_id,
        })
    }

    async update({ user_id, id, transaction }: TransactionsUpdateInput): Promise<TransactionsUpdateOutput> {
        const existing = await this.transactionsRepository.findByIdAndUserId({ id, user_id })

        if (!existing) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        if (transaction.category_id) {
            const category = await this.categoriesRepository.findByIdAndUserId({
                id: transaction.category_id,
                user_id,
            })

            if (!category) {
                throw new NotFoundError("Não existe nenhuma categoria com esse ID")
            }
        }

        await this.transactionsRepository.update({ id, data: transaction })
    }

    async delete({ id, user_id }: TransactionsDeleteInput): Promise<TransactionsDeleteOutput> {
        const transaction = await this.transactionsRepository.findByIdAndUserId({ id, user_id })

        if (!transaction) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        await this.transactionsRepository.delete({ id })
    }
}
