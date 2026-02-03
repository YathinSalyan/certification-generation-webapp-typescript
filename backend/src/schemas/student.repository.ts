import { json, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey, email } from "../lib/db/pg/util";
import { relations } from "drizzle-orm";
import { studentCourseMappings } from "./mapping.repository";

export const students = pgTable('students', {
    studentId: primaryKey('student_id'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    classYear: varchar('class_year', { length: 100 }),
    streamMajor: varchar('stream_major', { length: 100 }),
    collegeOrganization: varchar('college_organization', { length: 255 }).notNull(),
    email: email(),
    mobileNo: varchar('mobile_no', { length: 15 }),
    
    ...defaultTimestamps()
});

export const studentsRelations = relations(students, ({ many }) => ({
    mappings: many(studentCourseMappings)
}));

export type StudentSelect = typeof students.$inferSelect
export type StudentInsert = typeof students.$inferInsert