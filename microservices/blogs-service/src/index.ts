import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/prisma";
import blogsRouter from "./routes/blogs.router"
import { Request, Response } from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/health", (req:Request, res:Response) => res.json({ ok: true }));

// routes
app.use("/blogs", blogsRouter);

// global error handler (simple)
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 4000;

async function main() {
  await prisma.$connect();
  app.listen(PORT, () => {
    console.log(`Blogs service listening on ${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
