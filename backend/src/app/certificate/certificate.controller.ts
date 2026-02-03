import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";
import { ApiResponse } from "../../lib/types/api-response";
import { StringUtils } from "../../lib/utils/string-util";
import { ApiError } from "../../lib/types/api-error";

const generateCertificate = async (req: Request, res: Response) => {
    const mappingId = req.params.mappingId as string;
    if (StringUtils.isEmpty(mappingId)) throw ApiError.badRequest("Invalid mapping id");

    const pdfBuffer = await CertificateService.generateCertificate(mappingId);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${mappingId}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
}

const previewCertificate = async (req: Request, res: Response) => {
    const mappingId = req.params.mappingId as string;
    if (StringUtils.isEmpty(mappingId)) throw ApiError.badRequest("Invalid mapping id");

    const htmlContent = await CertificateService.previewCertificate(mappingId);

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
}

export const CertificateController = {
    generateCertificate,
    previewCertificate
}