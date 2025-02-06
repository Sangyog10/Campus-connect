import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function connectDb() {
  try {
    await prismaClient.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
}

export { connectDb, prismaClient };
