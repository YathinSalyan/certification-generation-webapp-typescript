
import express from "express";
import { AuthRouter } from "./auth/auth.route";
import { UserRouter } from "./user/user.route";
import { requireAuth, requireRole } from "../lib/middlewares/auth-middleware";
import { ConfigRouter } from "./config/config.route";

// CERTIFICATE SYSTEM IMPORTS
import { AdminAuthRouter } from "./admin-auth/admin-auth.route";
import { StudentRouter } from "./student/student.route";
import { CourseRouter } from "./course/course.route";
import { MappingRouter } from "./mapping/mapping.route";
import { CertificateRouter } from "./certificate/certificate.route";
import { ValidationRouter } from "./validation/validation.route";

const router = express.Router();

// ========== PUBLIC ROUTES (NO AUTH REQUIRED) ==========

// Public validation route (no auth)
router.use("/v1/validate", ValidationRouter);

// Admin authentication routes (login/register are public)
router.use("/v1/admin/auth", AdminAuthRouter);

// Existing auth routes
router.use("/v1/auth", AuthRouter);

// ========== PROTECTED ROUTES (REQUIRE AUTH) ==========

// User routes (require authentication)
router.use(requireAuth);
router.use("/v1/user", UserRouter);

// Config routes (admin only - existing)
router.use(requireRole(['admin']));
router.use("/v1/config", ConfigRouter);

// ========== CERTIFICATE SYSTEM ROUTES ==========
// IMPORTANT: These routes handle auth internally, don't apply middleware here!

router.use("/v1/students", StudentRouter);
router.use("/v1/courses", CourseRouter);
router.use("/v1/mappings", MappingRouter);
router.use("/v1/certificates", CertificateRouter);

export const ApiRouter = router;