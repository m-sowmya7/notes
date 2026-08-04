import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { prisma } from "./prisma/client"; //put this in root directory to remove build error
import pageRoutes from "./routes/documentRoutes";
import userRoutes from "./routes/userRoutes";
import shareRoutes from "./routes/shareRoutes";
import { startHocuspocusServer } from "./live/hocuspocus";
config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pages", pageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/share-links", shareRoutes);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connection established");

    // Keep Neon from auto-pausing (free tier pauses after 5 min inactivity)
    // setInterval(async () => {
    //   try { await prisma.$queryRaw`SELECT 1` } catch {}
    // }, 4 * 60 * 1000)

    const server = app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

    // Start listening for WebSocket upgrades on the same HTTP server the REST
    // API uses, so live clients connect to the API origin (reachable anywhere
    // the API is) instead of a hardcoded localhost port.
    startHocuspocusServer(server);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

void startServer();
