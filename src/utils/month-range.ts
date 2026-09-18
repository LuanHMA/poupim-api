export function monthRange(year: number, month: number) {
    return {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
    }
}
