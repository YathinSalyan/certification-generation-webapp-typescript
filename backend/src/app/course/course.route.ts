import express from "express";
import { catchAsync } from "../../lib/middlewares/catch-async";
import { CourseController } from "./course.controller";
import { validateRequest } from "../../lib/middlewares/validator-middleware";
import { CourseValidators } from "./course.validator";
import { requireAuth, requireRole } from "../../lib/middlewares/auth-middleware";

const router = express.Router();

// All course routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(['admin']));

router.route("")
    .post(validateRequest(CourseValidators.create), catchAsync(CourseController.createCourse))
    .get(catchAsync(CourseController.getAllCourses));

router.route("/:courseId")
    .get(catchAsync(CourseController.getCourse))
    .put(validateRequest(CourseValidators.update), catchAsync(CourseController.updateCourse))
    .delete(catchAsync(CourseController.deleteCourse));

export const CourseRouter = router;