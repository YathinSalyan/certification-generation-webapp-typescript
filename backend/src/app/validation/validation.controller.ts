import { Request, Response } from "express";
import { ValidationService } from "./validation.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const validateCredential = async (req: Request, res: Response) => {
    const credentialId = req.params.credentialId as string;
    
    if (StringUtils.isEmpty(credentialId)) {
        throw ApiError.badRequest("Invalid credential ID");
    }

    const responseData = await ValidationService.validateCredential(credentialId);
    res.json(ApiResponse.send(responseData));
}

export const ValidationController = {
    validateCredential
}
