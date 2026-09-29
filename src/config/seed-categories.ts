import "dotenv/config"
import { CATEGORY_ICONS } from "../modules/categories/category-icons"
import { prisma } from "./prisma"

async function main() {
    const existing = await prisma.category.count()

    if (existing > 0) {
        return
    }

    await prisma.category.createMany({
        data: CATEGORY_ICONS.map((category) => ({
            name: category.label,
            icon: category.name,
            color: category.color,
        })),
    })
}

main()
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
