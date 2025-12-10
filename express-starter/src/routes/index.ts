import { Router } from "express";
import { healthRouter } from "./health.routes.js";

export const router = Router();

router.use("/health", healthRouter);

// Add more route modules here, e.g.:
// router.use("/users", usersRouter);
