export const APP_TIME_ZONE = "America/Sao_Paulo"

const periodFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

/**
 * Mês e ano a que a transação pertence, resolvidos no fuso da aplicação.
 * Usar os getters UTC colocaria uma transação do fim do dia 30/09 (23:00 em UTC-3) em outubro.
 */
export function getTransactionPeriod(date: Date) {
    const [year, month] = periodFormatter.format(date).split("-").map(Number)

    return { month, year }
}
