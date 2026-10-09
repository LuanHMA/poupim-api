import { TZDate } from "@date-fns/tz"
import { getDate, getDaysInMonth, getMonth, getYear, subMonths } from "date-fns"

export type AppPeriod = {
    month: number
    year: number
}

export type AppCalendar = AppPeriod & {
    day: number
}

export class AppDate {
    static readonly TIME_ZONE = "America/Sao_Paulo"

    static calendar(date: Date = new Date()): AppCalendar {
        const zonedDate = TZDate.tz(this.TIME_ZONE, date)

        return {
            day: getDate(zonedDate),
            month: getMonth(zonedDate) + 1,
            year: getYear(zonedDate),
        }
    }

    static currentPeriod(): AppPeriod {
        const { month, year } = this.calendar()

        return { month, year }
    }

    static period(date: Date): AppPeriod {
        const { month, year } = this.calendar(date)

        return { month, year }
    }

    static periodsUntil({ month, year }: AppPeriod, quantity: number): AppPeriod[] {
        const requestedPeriod = TZDate.tz(this.TIME_ZONE, year, month - 1, 1)

        return Array.from({ length: quantity }, (_, index) => {
            const period = subMonths(requestedPeriod, quantity - index - 1)

            return {
                month: getMonth(period) + 1,
                year: getYear(period),
            }
        })
    }

    static daysInMonth({ month, year }: AppPeriod): number {
        return getDaysInMonth(TZDate.tz(this.TIME_ZONE, year, month - 1, 1))
    }

    static day(date: Date = new Date()): number {
        return this.calendar(date).day
    }

    static isCurrentPeriod({ month, year }: AppPeriod): boolean {
        const current = this.currentPeriod()

        return current.month === month && current.year === year
    }
}
