import express from "express"
import cors from "cors"
import { config } from "dotenv"
import { prisma } from "../prisma/client" //put this in root directory to remove error
import pageRoutes from "./routes/documentRoutes"
import userRoutes from "./routes/userRoutes"
import shareRoutes from "./routes/shareRoutes"
import { startHocuspocusServer } from "./live/hocuspocus"
config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/pages", pageRoutes);
app.use('/api/users', userRoutes);
app.use("/api/share-links", shareRoutes);

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connection established")

    // Keep Neon from auto-pausing (free tier pauses after 5 min inactivity)
    // setInterval(async () => {
    //   try { await prisma.$queryRaw`SELECT 1` } catch {}
    // }, 4 * 60 * 1000)

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
    })

    startHocuspocusServer()
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
