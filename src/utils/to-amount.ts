export function toAmount(value: { toNumber(): number } | number | string) {
    if (typeof value === "number") {
        return value
    }

    if (typeof value === "string") {
        return Number(value)
    }

    return value.toNumber()
}
