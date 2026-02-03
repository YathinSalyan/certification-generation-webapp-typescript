import { z } from "zod";
import { emailSchema, optionalString } from "../../lib/zod/zod-schemas";

const createStudentBody = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters").nonempty(),
    classYear: optionalString,
    streamMajor: optionalString,
    collegeOrganization: z.string().nonempty("College/Organization is required"),
    email: emailSchema.optional().nullable(),
    mobileNo: z.string().optional().nullable(),
}).strict();

const updateStudentBody = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters").optional(),
    classYear: optionalString,
    streamMajor: optionalString,
    collegeOrganization: z.string().optional(),
    email: emailSchema.optional().nullable(),
    mobileNo: z.string().optional().nullable(),
}).strict();

export type CreateStudent = z.infer<typeof createStudentBody>
export type UpdateStudent = z.infer<typeof updateStudentBody>

export const StudentValidators = {
    create: createStudentBody,
    update: updateStudentBody
}