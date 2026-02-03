import { Request, Response } from "express";
import { CourseService } from "./course.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const createCourse = async (req: Request, res: Response) => {
    const responseData = await CourseService.createCourse(req.body);
    res.status(201).json(ApiResponse.send(responseData));
}

const getAllCourses = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string || '1', 10);
    const recLimit = parseInt(req.query.recLimit as string || '10', 10);
    const search = req.query.search as string;

    const responseData = await CourseService.getAllCourses(pageNumber, recLimit, search);
    res.json(ApiResponse.send(responseData));
}

const getCourse = async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (StringUtils.isEmpty(courseId)) throw ApiError.badRequest("Invalid course id");

    const responseData = await CourseService.getCourse(courseId);
    res.json(ApiResponse.send(responseData));
}

const updateCourse = async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (StringUtils.isEmpty(courseId)) throw ApiError.badRequest("Invalid course id");

    const responseData = await CourseService.updateCourse(courseId, req.body);
    res.json(ApiResponse.send(responseData));
}

const deleteCourse = async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    if (StringUtils.isEmpty(courseId)) throw ApiError.badRequest("Invalid course id");

    const responseData = await CourseService.deleteCourse(courseId);
    res.json(ApiResponse.send(responseData));
}

export const CourseController = {
    createCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    deleteCourse
}