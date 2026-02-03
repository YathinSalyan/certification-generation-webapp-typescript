import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { AdminAuthController } from "./admin-auth.controller";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { AdminAuthValidators } from "./admin-auth.validator";
import { requireAuth, requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

// Public routes
router.post("/register", validateRequest(AdminAuthValidators.register), catchAsync(AdminAuthController.register));
router.post("/login", validateRequest(AdminAuthValidators.login), catchAsync(AdminAuthController.login));

// Protected routes
router.use(requireAuth);
router.use(requireRole(['admin']));
router.get("/me", catchAsync(AdminAuthController.getProfile));

export const AdminAuthRouter = router;