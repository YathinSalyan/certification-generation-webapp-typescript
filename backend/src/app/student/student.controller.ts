import { Request, Response } from "express";
import { StudentService } from "./student.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const createStudent = async (req: Request, res: Response) => {
    const responseData = await StudentService.createStudent(req.body);
    res.status(201).json(ApiResponse.send(responseData));
}

const getAllStudents = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string || '1', 10);
    const recLimit = parseInt(req.query.recLimit as string || '10', 10);
    const search = req.query.search as string;

    const responseData = await StudentService.getAllStudents(pageNumber, recLimit, search);
    res.json(ApiResponse.send(responseData));
}

const getStudent = async (req: Request, res: Response) => {
    const studentId = req.params.studentId as string;
    if (StringUtils.isEmpty(studentId)) throw ApiError.badRequest("Invalid student id");

    const responseData = await StudentService.getStudent(studentId);
    res.json(ApiResponse.send(responseData));
}

const updateStudent = async (req: Request, res: Response) => {
    const studentId = req.params.studentId as string;
    if (StringUtils.isEmpty(studentId)) throw ApiError.badRequest("Invalid student id");

    const responseData = await StudentService.updateStudent(studentId, req.body);
    res.json(ApiResponse.send(responseData));
}

const deleteStudent = async (req: Request, res: Response) => {
    const studentId = req.params.studentId as string;
    if (StringUtils.isEmpty(studentId)) throw ApiError.badRequest("Invalid student id");

    const responseData = await StudentService.deleteStudent(studentId);
    res.json(ApiResponse.send(responseData));
}

export const StudentController = {
    createStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
}