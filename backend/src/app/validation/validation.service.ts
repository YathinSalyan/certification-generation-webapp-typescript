import { eq } from "drizzle-orm";
import { db } from "../../config/db";  // ✅ CORRECT
import { ApiError } from "../../lib/types/api-error";
import { studentCourseMappings } from "../../schemas/mapping.repository";

const validateCredential = async (credentialId: string) => {
    const mapping = await db.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.credentialId, credentialId),
        with: {
            student: {
                columns: {
                    studentId: true,
                    fullName: true,
                    collegeOrganization: true
                }
            },
            course: {
                columns: {
                    courseId: true,
                    title: true,
                    duration: true,
                    startDate: true,
                    endDate: true
                }
            }
        }
    });

    if (!mapping) {
        return {
            isValid: false,
            message: "Credential Not Found or Invalid",
            certificate: null
        };
    }

    return {
        isValid: true,
        message: "Credential Valid",
        certificate: {
            credentialId: mapping.credentialId,
            student: {
                name: mapping.student?.fullName,
                organization: mapping.student?.collegeOrganization
            },
            course: {
                title: mapping.course?.title,
                duration: mapping.course?.duration,
                startDate: mapping.course?.startDate,
                endDate: mapping.course?.endDate
            },
            completionDate: mapping.completionDate,
            issuedDate: mapping.createdAt
        }
    };
}

export const ValidationService = {
    validateCredential
}