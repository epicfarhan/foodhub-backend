import express, { Application } from "express"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "https://localhost:5000",
    credentials: true
}))

app.use(express.json())

app.all("/api/auth/*splat", toNodeHandler(auth));
export default app;