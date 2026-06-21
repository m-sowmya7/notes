import express from "express"
import cors from "cors"
import { config } from "dotenv"
import { PrismaClient } from "./generated/prisma/client"
import pageRoutes from "./routes/documentRoutes"
import userRoutes from "./routes/userRoutes"
import shareRoutes from "./routes/shareRoutes"
import userShareRoutes from "./routes/userShareRoutes"
config()

const PORT = process.env.PORT || 5000
const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use("/api/pages", pageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shares', userShareRoutes);
app.use("/api/share-links", shareRoutes);

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connection established")

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
    })
  } catch (error) {
    console.error("Database connection failed")
    console.error(error)
    process.exit(1)
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await prisma.$disconnect()
  process.exit(0)
})

void startServer()
