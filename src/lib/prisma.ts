// Temporarily disabled Prisma to get the app running
// import { PrismaClient } from '@prisma/client'
// import { PrismaPg } from '@prisma/adapter-pg'

// const globalForPrisma = global as unknown as {
//     prisma: PrismaClient
// }

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// })

// const prisma = globalForPrisma.prisma || new PrismaClient({
//   adapter,
// })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Mock Prisma client - database features won't work but app will run
const prisma = {
  user: {
    findUnique: async () => null,
    create: async () => null,
    update: async () => null,
  },
  $connect: async () => {},
  $disconnect: async () => {},
} as any

export default prisma