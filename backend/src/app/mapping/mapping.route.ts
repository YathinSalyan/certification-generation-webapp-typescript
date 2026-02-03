import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { MappingController } from "./mapping.controller";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { MappingValidators } from "./mapping.validator";
import { requireAuth, requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

// All mapping routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

router.route("")
    .post(validateRequest(MappingValidators.create), catchAsync(MappingController.createMapping))
    .get(catchAsync(MappingController.getAllMappings));

router.route("/:mappingId")
    .get(catchAsync(MappingController.getMapping))
    .delete(catchAsync(MappingController.deleteMapping));

export const MappingRouter = router;