import { and, asc, desc, eq, SQL } from "drizzle-orm";
import { db } from "../../config/db";  // ✅ CORRECT
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { offSet, getTableCount } from "../../lib/db/pg/util";
import { ApiError } from "../../lib/types/api-error";
import { studentCourseMappings, MappingInsert } from "../../schemas/mapping.repository";
import { students } from "../../schemas/student.repository";
import { courses } from "../../schemas/course.repository";
import { CreateMapping } from "./mapping.validator";
import { UUIDUtil } from "../../lib/utils/uuid-generator";
import { DB } from "../../lib/db/pg/connection";

const createMapping = async (tnx: Tnx, body: CreateMapping) => {
    // Verify student exists
    const student = await tnx.query.students.findFirst({
        where: eq(students.studentId, body.studentId)
    });

    if (!student) throw ApiError.notFound("Student not found!");

    // Verify course exists
    const course = await tnx.query.courses.findFirst({
        where: eq(courses.courseId, body.courseId)
    });

    if (!course) throw ApiError.notFound("Course not found!");

    // Check if mapping already exists
    const existingMapping = await tnx.query.studentCourseMappings.findFirst({
        where: and(
            eq(studentCourseMappings.studentId, body.studentId),
            eq(studentCourseMappings.courseId, body.courseId)
        )
    });

    if (existingMapping) {
        throw ApiError.badRequest("This student is already mapped to this course!");
    }

    // Generate unique credential ID
    const credentialId = `CERT-${UUIDUtil.generate().toUpperCase().replace(/-/g, '').substring(0, 16)}`;

    const mappingData: MappingInsert = {
        studentId: body.studentId,
        courseId: body.courseId,
        credentialId,
        completionDate: new Date(body.completionDate)
    };

    const [mapping] = await tnx.insert(studentCourseMappings).values(mappingData).returning();

    if (!mapping) throw ApiError.internalServerError("Error while creating mapping");

    // Fetch complete mapping with relations
    const completeMapping = await tnx.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.mappingId, mapping.mappingId),
        with: {
            student: true,
            course: true
        }
    });

    return { mapping: completeMapping };
}

const getAllMappings = async (pageNumber: number, recLimit: number, studentId?: string, courseId?: string) => {
    const conditions: SQL<unknown>[] = [];
    const orderBy = [desc(studentCourseMappings.createdAt), asc(studentCourseMappings.mappingId)];

    if (studentId) {
        conditions.push(eq(studentCourseMappings.studentId, studentId));
    }

    if (courseId) {
        conditions.push(eq(studentCourseMappings.courseId, courseId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const mappingsList = await db.query.studentCourseMappings.findMany({
        where,
        with: {
            student: true,
            course: true
        },
        limit: recLimit ? recLimit : undefined,
        offset: offSet(pageNumber, recLimit),
        orderBy
    });

    const records = pageNumber === 1 ? await getTableCount(db, studentCourseMappings, where) : 0;

    return { mappings: mappingsList, records };
}

const getMappingById = async (db: DB | Tnx, mappingId: string) => {
    const mapping = await db.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.mappingId, mappingId),
        with: {
            student: true,
            course: true
        }
    });

    if (!mapping) throw ApiError.notFound("Mapping not found!");

    return { mapping };
}

const deleteMapping = async (tnx: Tnx, mappingId: string) => {
    const mapping = await tnx.query.studentCourseMappings.findFirst({
        where: eq(studentCourseMappings.mappingId, mappingId)
    });

    if (!mapping) throw ApiError.notFound("Mapping not found!");

    const [deletedMapping] = await tnx.delete(studentCourseMappings)
        .where(eq(studentCourseMappings.mappingId, mappingId))
        .returning();

    if (!deletedMapping) throw ApiError.internalServerError("Error deleting mapping");

    return { mappingId: deletedMapping.mappingId };
}

export const MappingService = {
    createMapping: withTransaction(createMapping),
    getAllMappings,
    getMapping: (mappingId: string) => getMappingById(db, mappingId),
    deleteMapping: withTransaction(deleteMapping)
}