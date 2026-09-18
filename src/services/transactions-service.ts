import { NotFoundError } from "../errors/domain-errors";
import { Transaction, TransactionCreate, TransactionDelete, TransactionUpdate } from "../models/transactions";
import { CategoriesRepository } from "../repository/categories-repository";
import { TransactionsRepository } from "../repository/transactions-repository";

export class TransactionsService {
    constructor(
        private transactionsRepository: TransactionsRepository,
        private categoriesRepository: CategoriesRepository,
    ) {}

    async getAll(user_id: Transaction["user_id"]) {
        return this.transactionsRepository.findAllByUserId(user_id)
    }

    async create({ amount, category_id, description, type, user_id }: TransactionCreate) {
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

    async update({ user_id, id, transaction }: { user_id: Transaction["user_id"], id: Transaction["id"], transaction: TransactionUpdate }) {
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

    async delete({ id, user_id }: TransactionDelete) {
        const transaction = await this.transactionsRepository.findByIdAndUserId({ id, user_id })

        if (!transaction) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        await this.transactionsRepository.delete(id)
    }
}
