import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { StudentController } from "./student.controller";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { StudentValidators } from "./student.validator";
import { requireAuth, requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

// All student routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

router.route("")
    .post(validateRequest(StudentValidators.create), catchAsync(StudentController.createStudent))
    .get(catchAsync(StudentController.getAllStudents));

router.route("/:studentId")
    .get(catchAsync(StudentController.getStudent))
    .put(validateRequest(StudentValidators.update), catchAsync(StudentController.updateStudent))
    .delete(catchAsync(StudentController.deleteStudent));

export const StudentRouter = router;