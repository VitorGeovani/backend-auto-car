import express from "express";
const router = express.Router();
import AdminController from "../controllers/AdminController.js";
import DashboardController from "../controllers/DashboardController.js";
import { adminMiddleware } from "../middlewares/middleware.js";

router.get("/admins", AdminController.listar);
router.post("/login", AdminController.login);

// Nova rota para obter estatísticas do dashboard
router.get("/dashboard", adminMiddleware, DashboardController.getStats);

export default router;
