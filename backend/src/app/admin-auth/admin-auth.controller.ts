import { Request, Response } from "express";
import { AdminAuthService } from "./admin-auth.service";
import { ApiResponse } from "../../lib/types/api-response";

const register = async (req: Request, res: Response) => {
    const responseData = await AdminAuthService.register(req.body);
    res.status(201).json(ApiResponse.send(responseData));
}

const login = async (req: Request, res: Response) => {
    const responseData = await AdminAuthService.login(req.body);
    res.json(ApiResponse.send(responseData));
}

const getProfile = async (req: Request, res: Response) => {
    const adminId = req.getUserSession().getUserId();
    const responseData = await AdminAuthService.getProfile(adminId);
    res.json(ApiResponse.send(responseData));
}

export const AdminAuthController = {
    register,
    login,
    getProfile
}
