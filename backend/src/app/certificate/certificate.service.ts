import { eq } from "drizzle-orm";
import { db } from "../../config/db";  // ✅ CORRECT
import { ApiError } from "../../lib/types/api-error";
import { studentCourseMappings } from "../../schemas/mapping.repository";
import { PdfGenerator } from "../../lib/pdf/pdf-generator";
import { QRGenerator } from "../../lib/pdf/qr-generator";
import { TemplateRenderer } from "../../lib/pdf/template-renderer";
import { DateUtil } from "../../lib/utils/date-util";
import { EnvVariables } from "../../config/env-helper";

const generateCertificate = async (mappingId: string): Promise<Buffer> => {
    // Fetch mapping with student and course details
    const mapping = await db.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.mappingId, mappingId),
        with: {
            student: true,
            course: true
        }
    });

    if (!mapping) throw ApiError.notFound("Mapping not found!");
    if (!mapping.student) throw ApiError.notFound("Student data not found!");
    if (!mapping.course) throw ApiError.notFound("Course data not found!");

    // Generate validation URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const validationUrl = `${frontendUrl}/validate/${mapping.credentialId}`;

    // Generate QR code
    const qrCodeDataURL = await QRGenerator.generateQRCodeDataURL(validationUrl);

    // Prepare template data
    const templateData = {
        studentName: mapping.student.fullName,
        courseTitle: mapping.course.title,
        courseDuration: mapping.course.duration,
        completionDate: DateUtil.formatDate(mapping.completionDate.toISOString()),
        credentialId: mapping.credentialId,
        validationUrl,
        qrCodeDataURL,
        collegeOrganization: mapping.student.collegeOrganization,
        startDate: DateUtil.formatDate(mapping.course.startDate.toISOString()),
        endDate: DateUtil.formatDate(mapping.course.endDate.toISOString())
    };

    // Get template from course or use default
    let template = TemplateRenderer.getDefaultTemplate();
    if (mapping.course.certificateTemplate?.content) {
        template = mapping.course.certificateTemplate.content;
    }

    // Render template with data
    const renderedHtml = TemplateRenderer.renderTemplate(template, templateData);

    // Generate PDF
    const pdfBuffer = await PdfGenerator.generatePdfFromHtml(renderedHtml, {
        format: 'A4',
        landscape: true,
        printBackground: true
    });

    return pdfBuffer;
}

const previewCertificate = async (mappingId: string): Promise<string> => {
    // Fetch mapping with student and course details
    const mapping = await db.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.mappingId, mappingId),
        with: {
            student: true,
            course: true
        }
    });

    if (!mapping) throw ApiError.notFound("Mapping not found!");
    if (!mapping.student) throw ApiError.notFound("Student data not found!");
    if (!mapping.course) throw ApiError.notFound("Course data not found!");

    // Generate validation URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const validationUrl = `${frontendUrl}/validate/${mapping.credentialId}`;

    // Generate QR code
    const qrCodeDataURL = await QRGenerator.generateQRCodeDataURL(validationUrl);

    // Prepare template data
    const templateData = {
        studentName: mapping.student.fullName,
        courseTitle: mapping.course.title,
        courseDuration: mapping.course.duration,
        completionDate: DateUtil.formatDate(mapping.completionDate.toISOString()),
        credentialId: mapping.credentialId,
        validationUrl,
        qrCodeDataURL,
        collegeOrganization: mapping.student.collegeOrganization,
        startDate: DateUtil.formatDate(mapping.course.startDate.toISOString()),
        endDate: DateUtil.formatDate(mapping.course.endDate.toISOString())
    };

    // Get template from course or use default
    let template = TemplateRenderer.getDefaultTemplate();
    if (mapping.course.certificateTemplate?.content) {
        template = mapping.course.certificateTemplate.content;
    }

    // Render template with data (return HTML for preview)
    const renderedHtml = TemplateRenderer.renderTemplate(template, templateData);

    return renderedHtml;
}

export const CertificateService = {
    generateCertificate,
    previewCertificate
}