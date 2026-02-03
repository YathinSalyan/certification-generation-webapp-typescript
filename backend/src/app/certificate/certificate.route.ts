import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { CertificateController } from "./certificate.controller";
import { requireAuth, requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

// All certificate routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

router.get("/preview/:mappingId", catchAsync(CertificateController.previewCertificate));
router.get("/download/:mappingId", catchAsync(CertificateController.generateCertificate));

export const CertificateRouter = router;