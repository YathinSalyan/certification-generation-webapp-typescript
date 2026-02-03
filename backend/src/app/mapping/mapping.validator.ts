import { z } from "zod";

const createMappingBody = z.object({
    studentId: z.string().uuid("Invalid student ID").nonempty(),
    courseId: z.string().uuid("Invalid course ID").nonempty(),
    completionDate: z.string().nonempty("Completion date is required")
}).strict();

export type CreateMapping = z.infer<typeof createMappingBody>

export const MappingValidators = {
    create: createMappingBody
}