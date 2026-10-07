import "dotenv/config"
import { CATEGORY_ICONS } from "../modules/categories/category-icons"
import { prisma } from "./prisma"

const RENAMES = [
    { from: "Poupança", to: "Caixinha" },
    { from: "Ônibus", to: "Transporte" },
]

async function main() {
    for (const rename of RENAMES) {
        await prisma.category.updateMany({
            where: { name: rename.from },
            data: { name: rename.to },
        })
    }

    for (const category of CATEGORY_ICONS) {
        const existing = await prisma.category.findFirst({
            where: { name: category.label },
        })

        if (existing) {
            await prisma.category.update({
                where: { id: existing.id },
                data: {
                    icon: category.name,
                    color: category.color,
                },
            })
            continue
        }

        await prisma.category.create({
            data: {
                name: category.label,
                icon: category.name,
                color: category.color,
            },
        })
    }
}

main()
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
