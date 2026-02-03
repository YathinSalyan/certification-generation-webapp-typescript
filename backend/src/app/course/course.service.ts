import { and, asc, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "../../config/db";  // ✅ CORRECT
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { offSet, getTableCount } from "../../lib/db/pg/util";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";
import { courses, CourseInsert } from "../../schemas/course.repository";
import { CreateCourse, UpdateCourse } from "./course.validator";
import { DB } from "../../lib/db/pg/connection";

const createCourse = async (tnx: Tnx, body: CreateCourse) => {
    const courseData: CourseInsert = {
        title: body.title,
        duration: body.duration,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        certificateTemplate: body.certificateTemplate,
        description: body.description || null
    };

    const [course] = await tnx.insert(courses).values(courseData).returning();

    if (!course) throw ApiError.internalServerError("Error while creating course");

    return { course };
}

const getAllCourses = async (pageNumber: number, recLimit: number, search?: string) => {
    const conditions: SQL<unknown>[] = [];
    const orderBy = [desc(courses.createdAt), asc(courses.courseId)];

    if (StringUtils.isNotEmpty(search)) {
        const searchPattern = `%${search}%`;

        const searchCondition = or(
            ilike(courses.title, searchPattern),
            ilike(courses.description, searchPattern)
        );

        if (searchCondition) conditions.push(searchCondition);
        orderBy.unshift(asc(courses.title));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const coursesList = await db.query.courses.findMany({
        where,
        limit: recLimit ? recLimit : undefined,
        offset: offSet(pageNumber, recLimit),
        orderBy
    });

    const records = pageNumber === 1 ? await getTableCount(db, courses, where) : 0;

    return { courses: coursesList, records };
}

const getCourseById = async (db: DB | Tnx, courseId: string) => {
    const course = await db.query.courses.findFirst({
        where: eq(courses.courseId, courseId),
        with: {
            mappings: {
                with: {
                    student: true
                }
            }
        }
    });

    if (!course) throw ApiError.notFound("Course not found!");

    return { course };
}

const updateCourse = async (tnx: Tnx, courseId: string, body: UpdateCourse) => {
    const currentCourse = await tnx.query.courses.findFirst({
        where: eq(courses.courseId, courseId)
    });

    if (!currentCourse) throw ApiError.notFound("Course not found!");

    const updateData: any = { ...body };
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);

    const [updatedCourse] = await tnx.update(courses)
        .set(updateData)
        .where(eq(courses.courseId, courseId))
        .returning();

    if (!updatedCourse) throw ApiError.internalServerError("Error updating course");

    return { course: updatedCourse };
}

const deleteCourse = async (tnx: Tnx, courseId: string) => {
    const course = await tnx.query.courses.findFirst({
        where: eq(courses.courseId, courseId)
    });

    if (!course) throw ApiError.notFound("Course not found!");

    const [deletedCourse] = await tnx.delete(courses)
        .where(eq(courses.courseId, courseId))
        .returning();

    if (!deletedCourse) throw ApiError.internalServerError("Error deleting course");

    return { courseId: deletedCourse.courseId };
}

export const CourseService = {
    createCourse: withTransaction(createCourse),
    getAllCourses,
    getCourse: (courseId: string) => getCourseById(db, courseId),
    updateCourse: withTransaction(updateCourse),
    deleteCourse: withTransaction(deleteCourse)
}
