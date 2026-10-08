import { NotFoundError } from "../../errors/domain-errors";
import { getTransactionPeriod } from "../../utils/transaction-period";
import { CategoriesRepository } from "../categories/categories.repository";
import {
    TransactionsCreateInput,
    TransactionsCreateOutput,
    TransactionsDeleteInput,
    TransactionsDeleteOutput,
    TransactionsGetAllInput,
    TransactionsGetAllOutput,
    TransactionsUpdateInput,
    TransactionsUpdateOutput
} from "./transactions.contracts";
import { TransactionsRepository } from "./transactions.repository";

export class TransactionsService {
    constructor(
        private transactionsRepository: TransactionsRepository,
        private categoriesRepository: CategoriesRepository,
    ) { }

    async getAll(filters: TransactionsGetAllInput): Promise<TransactionsGetAllOutput> {
        return this.transactionsRepository.findManyByMonthAndYear(filters)
    }

    async create({ user_id, date, observation, ...transaction }: TransactionsCreateInput): Promise<TransactionsCreateOutput> {
        const category = await this.categoriesRepository.findById(transaction.category_id)

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        const { month, year } = getTransactionPeriod(date)

        await this.transactionsRepository.create({
            ...transaction,
            user_id,
            transaction_date: date,
            month,
            year,
            observation: observation ?? "",
            category_id: category.id
        })
    }

    async update({ user_id, id, date, observation, ...transaction }: TransactionsUpdateInput): Promise<TransactionsUpdateOutput> {
        const existing = await this.transactionsRepository.findByIdAndUserId({ id, user_id })

        if (!existing) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        const category = await this.categoriesRepository.findById(transaction.category_id)

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        const { month, year } = getTransactionPeriod(date)

        await this.transactionsRepository.update({
            id,
            data: {
                ...transaction,
                transaction_date: date,
                month,
                year,
                ignore: transaction.status !== "PENDING" && existing.ignore ? false : transaction.ignore,
                observation: observation ?? "",
            },
        })
    }

    async delete({ id, user_id }: TransactionsDeleteInput): Promise<TransactionsDeleteOutput> {
        const transaction = await this.transactionsRepository.findByIdAndUserId({ id, user_id })

        if (!transaction) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        await this.transactionsRepository.delete({ id })
    }
}
