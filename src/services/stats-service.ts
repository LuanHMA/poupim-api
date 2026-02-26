import { RowDataPacket } from "mysql2/promise"
import { db } from "../config/database"
import { BasesStats, CategoryStats, CreateStats, TransactionSummary } from "../models/stats"

export class StatsService {
    async getTransactionsSummary({ month, year, user_id }: CreateStats): Promise<TransactionSummary> {
        // Retorna o resumo das transações: total de receitas, total de despesas e saldo
        const query = `
            SELECT 
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_expense,
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) AS balance
            FROM transactions
            WHERE user_id = ? AND MONTH(created_at) = ? AND YEAR (created_at) = ?
        `

        const [transactionsSummary] = await db.execute<RowDataPacket[]>(query, [user_id, month, year])
        return {
            total_income: transactionsSummary[0].total_income ?? 0,
            total_expense: transactionsSummary[0].total_expense ?? 0,
            balance: transactionsSummary[0].balance ?? 0
        }
    }

    async getOverview({ month, year, user_id }: CreateStats) {
        // Retorna um overview completo das transações
        const [basesStats, categoryStats] = await Promise.all([
            this.getBasesStats({ month, year, user_id }),
            this.getCategoryStats({ month, year, user_id }),
        ])

        const month_insights = this.generateInsights(
            basesStats,
            categoryStats,
            year,
            month
        )

        return {
            basesStats,
            categoryStats,
            month_insights
        }
    }

    private async getBasesStats({ month, year, user_id }: CreateStats): Promise<BasesStats> {
        const query = `
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
                count(*) AS transactions_total,
                MAX(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS highest_expense
            FROM transactions   
            wHERE user_id = ? AND MONTH(created_at) = ? AND YEAR (created_at) = ?
        `

        const [basesStats] = await db.execute<RowDataPacket[]>(query, [user_id, month, year])

        const daysInMonth = new Date(year, month, 0).getDate()

        const average_daily_expense = daysInMonth > 0 ? Number((basesStats[0].total_expense / daysInMonth).toFixed(2)) : 0

        return {
            total_income: basesStats[0].total_income ?? 0,
            total_expense: basesStats[0].total_expense ?? 0,
            balance: basesStats[0].balance ?? 0,
            transactions_total: basesStats[0].transactions_total ?? 0,
            highest_expense: basesStats[0].highest_expense ?? 0,
            average_daily_expense
        }
    }

    private async getCategoryStats({ month, year, user_id }: CreateStats): Promise<CategoryStats[]> {
        const query = `
            SELECT 
                c.name AS category,
                sum(t.amount) AS total_amount
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND MONTH(t.created_at) = ? AND YEAR(t.created_at) = ?
            GROUP BY c.name;
        `

        const [rows] = await db.execute<RowDataPacket[]>(query, [user_id, month, year])

        const totalExpense = rows.reduce((acc, curr) => {
            return acc + Number(curr.total_amount)
        }, 0)

        const categoryStats = rows.map((item) => {
            const total = Number(item.total_amount)

            return {
                category: item.category,
                total_amount: total,
                percentage: totalExpense > 0
                    ? Number(((total / totalExpense) * 100).toFixed(2))
                    : 0
            }
        })

        return categoryStats as CategoryStats[]
    }

    private generateInsights(
        basesStats: BasesStats,
        categoryStats: CategoryStats[],
        year: number,
        month: number,
    ) {
        const { average_daily_expense, transactions_total, balance, total_expense, total_income } = basesStats

        const daysInMonth = new Date(year, month, 0).getDate()

        /* 
           🥇 Percentual da renda usada
           (total_expense / total_income) * 100
        */
        const expenseRatio =
            total_income > 0
                ? Number(((total_expense / total_income) * 100).toFixed(2))
                : 0

        const expenseRatioType =
            expenseRatio <= 70
                ? "positive"
                : expenseRatio <= 90
                    ? "neutral"
                    : "warning"

        /*
           🥈 Resultado do mês
           balance = income - expense
        */
        const savingsType =
            balance > 0 ? "positive" : balance < 0 ? "warning" : "neutral"

        /*
           🥉 Maior categoria de gasto
        */
        const topCategory =
            categoryStats.length > 0
                ? categoryStats.reduce((prev, current) =>
                    current.total_amount > prev.total_amount ? current : prev
                )
                : null

        /*
           🏅 Frequência de movimentações
           transactions_total / daysInMonth
        */
        const transactionsPerDay =
            daysInMonth > 0
                ? Number((transactions_total / daysInMonth).toFixed(2))
                : 0

        const spendingFrequencyType =
            transactionsPerDay > 1.5
                ? "warning"
                : transactionsPerDay < 0.5
                    ? "positive"
                    : "neutral"

        /*
           🎯 Média diária de gasto
        */
        const averageDailySpending = Number(
            average_daily_expense.toFixed(2)
        )

        return {
            savingsPerformance: {
                id: "savingsPerformance",
                question: "Eu economizei ou gastei mais do que ganhei? (R$)",
                type: savingsType,
                value: balance
                //Você conseguiu guardar R$ X este mês.
            },

            expenseRatio: {
                id: "expenseRatio",
                question: "Quanto da minha renda eu utilizei este mês? (%)",
                type: expenseRatioType,
                value: expenseRatio
                //Você utilizou X% do que ganhou este mês.
                //Quase toda a sua renda foi consumida este mês (X%).
            },

            topExpenseCategory: topCategory
                ? {
                    id: "topExpenseCategory",
                    question: "Onde eu mais gastei dinheiro este mês?",
                    type: "info",
                    category: topCategory.category,
                    value: topCategory.total_amount
                }
                : null,
            //Seu maior gasto foi com {categoria}, totalizando R$ X.

            spendingFrequency: {
                id: "spendingFrequency",
                question: "Com que frequência eu movimentei dinheiro este mês? (Dias)",
                type: spendingFrequencyType,
                total_transactions: transactions_total,
                transactions_per_day: transactionsPerDay
                //Você realizou X movimentações este mês.
                //Em média, você movimentou seu dinheiro X vezes por dia.
            },

            averageDailySpending: {
                id: "averageDailySpending",
                question: "Quanto eu gasto por dia, em média? (R$)",
                type: "info",
                value: averageDailySpending
                //Em média, você gastou R$ X por dia neste mês.
            },
        }
    }
}