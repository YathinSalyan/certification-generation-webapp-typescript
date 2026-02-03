import { z } from "zod";
import { optionalString } from "../../lib/zod/zod-schemas";

const certificateTemplateSchema = z.object({
    type: z.enum(['html', 'custom']),
    content: z.string().nonempty("Template content is required")
}).strict();

const createCourseBody = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").nonempty(),
    duration: z.string().nonempty("Duration is required"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    certificateTemplate: certificateTemplateSchema,
    description: optionalString
}).strict();

const updateCourseBody = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    duration: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    certificateTemplate: certificateTemplateSchema.optional(),
    description: optionalString
}).strict();

export type CreateCourse = z.infer<typeof createCourseBody>
export type UpdateCourse = z.infer<typeof updateCourseBody>

export const CourseValidators = {
    create: createCourseBody,
    update: updateCourseBody
}