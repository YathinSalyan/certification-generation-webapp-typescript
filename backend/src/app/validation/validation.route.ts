import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { ValidationController } from "./validation.controller";

const router = express.Router();

// Public route - no authentication required
router.get("/:credentialId", catchAsync(ValidationController.validateCredential));

export const ValidationRouter = router;