import { Request, Response } from "express";
import { MappingService } from "./mapping.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const createMapping = async (req: Request, res: Response) => {
    const responseData = await MappingService.createMapping(req.body);
    res.status(201).json(ApiResponse.send(responseData));
}

const getAllMappings = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string || '1', 10);
    const recLimit = parseInt(req.query.recLimit as string || '10', 10);
    const studentId = req.query.studentId as string;
    const courseId = req.query.courseId as string;

    const responseData = await MappingService.getAllMappings(pageNumber, recLimit, studentId, courseId);
    res.json(ApiResponse.send(responseData));
}

const getMapping = async (req: Request, res: Response) => {
    const mappingId = req.params.mappingId as string;
    if (StringUtils.isEmpty(mappingId)) throw ApiError.badRequest("Invalid mapping id");

    const responseData = await MappingService.getMapping(mappingId);
    res.json(ApiResponse.send(responseData));
}

const deleteMapping = async (req: Request, res: Response) => {
    const mappingId = req.params.mappingId as string;
    if (StringUtils.isEmpty(mappingId)) throw ApiError.badRequest("Invalid mapping id");

    const responseData = await MappingService.deleteMapping(mappingId);
    res.json(ApiResponse.send(responseData));
}

export const MappingController = {
    createMapping,
    getAllMappings,
    getMapping,
    deleteMapping
}