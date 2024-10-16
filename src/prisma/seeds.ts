import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const visitante = await prisma.user.upsert({
        where: { email: 'visitante@visitante' },
        update: {},
        create: {
            email: 'visitante@visitante',
            name: 'visitante',
            password: '123456',
            city: 'pompéia',
            farm: 'fazenda feliz',
        },
    })
    console.log({ visitante })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
