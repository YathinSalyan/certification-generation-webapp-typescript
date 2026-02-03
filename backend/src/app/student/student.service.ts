import { and, asc, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { db } from "../../config/db";  // ✅ CORRECT
import { Tnx, withTransaction } from "../../lib/db/pg/transaction";
import { offSet, getTableCount } from "../../lib/db/pg/util";
import { ApiError } from "../../lib/types/api-error";
import { StringUtils } from "../../lib/utils/string-util";
import { students, StudentInsert } from "../../schemas/student.repository";
import { CreateStudent, UpdateStudent } from "./student.validator";
import { DB } from "../../lib/db/pg/connection";

const createStudent = async (tnx: Tnx, body: CreateStudent) => {
    const studentData: StudentInsert = {
        fullName: body.fullName,
        classYear: body.classYear || null,
        streamMajor: body.streamMajor || null,
        collegeOrganization: body.collegeOrganization,
        email: body.email || null,
        mobileNo: body.mobileNo || null
    };

    const [student] = await tnx.insert(students).values(studentData).returning();

    if (!student) throw ApiError.internalServerError("Error while creating student");

    return { student };
}

const getAllStudents = async (pageNumber: number, recLimit: number, search?: string) => {
    const conditions: SQL<unknown>[] = [];
    const orderBy = [desc(students.createdAt), asc(students.studentId)];

    if (StringUtils.isNotEmpty(search)) {
        const searchPattern = `%${search}%`;

        const searchCondition = or(
            ilike(students.fullName, searchPattern),
            ilike(students.collegeOrganization, searchPattern),
            ilike(students.email, searchPattern)
        );

        if (searchCondition) conditions.push(searchCondition);
        orderBy.unshift(asc(students.fullName));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const studentsList = await db.query.students.findMany({
        where,
        limit: recLimit ? recLimit : undefined,
        offset: offSet(pageNumber, recLimit),
        orderBy
    });

    const records = pageNumber === 1 ? await getTableCount(db, students, where) : 0;

    return { students: studentsList, records };
}

const getStudentById = async (db: DB | Tnx, studentId: string) => {
    const student = await db.query.students.findFirst({
        where: eq(students.studentId, studentId),
        with: {
            mappings: {
                with: {
                    course: true
                }
            }
        }
    });

    if (!student) throw ApiError.notFound("Student not found!");

    return { student };
}

const updateStudent = async (tnx: Tnx, studentId: string, body: UpdateStudent) => {
    const currentStudent = await tnx.query.students.findFirst({
        where: eq(students.studentId, studentId)
    });

    if (!currentStudent) throw ApiError.notFound("Student not found!");

    const [updatedStudent] = await tnx.update(students)
        .set(body)
        .where(eq(students.studentId, studentId))
        .returning();

    if (!updatedStudent) throw ApiError.internalServerError("Error updating student");

    return { student: updatedStudent };
}

const deleteStudent = async (tnx: Tnx, studentId: string) => {
    const student = await tnx.query.students.findFirst({
        where: eq(students.studentId, studentId)
    });

    if (!student) throw ApiError.notFound("Student not found!");

    const [deletedStudent] = await tnx.delete(students)
        .where(eq(students.studentId, studentId))
        .returning();

    if (!deletedStudent) throw ApiError.internalServerError("Error deleting student");

    return { studentId: deletedStudent.studentId };
}

export const StudentService = {
    createStudent: withTransaction(createStudent),
    getAllStudents,
    getStudent: (studentId: string) => getStudentById(db, studentId),
    updateStudent: withTransaction(updateStudent),
    deleteStudent: withTransaction(deleteStudent)
}