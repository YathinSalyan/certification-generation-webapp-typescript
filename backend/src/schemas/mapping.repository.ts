import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey } from "../lib/db/pg/util";
import { relations } from "drizzle-orm";
import { students } from "./student.repository";
import { courses } from "./course.repository";

export const studentCourseMappings = pgTable('student_course_mappings', {
    mappingId: primaryKey('mapping_id'),
    studentId: uuid('student_id').references(() => students.studentId).notNull(),
    courseId: uuid('course_id').references(() => courses.courseId).notNull(),
    credentialId: varchar('credential_id', { length: 255 }).unique().notNull(),
    completionDate: timestamp('completion_date', { mode: 'date' }).notNull(),
    
    ...defaultTimestamps()
});

export const studentCourseMappingsRelations = relations(studentCourseMappings, ({ one }) => ({
    student: one(students, {
        fields: [studentCourseMappings.studentId],
        references: [students.studentId]
    }),
    course: one(courses, {
        fields: [studentCourseMappings.courseId],
        references: [courses.courseId]
    })
}));

export type MappingSelect = typeof studentCourseMappings.$inferSelect
export type MappingInsert = typeof studentCourseMappings.$inferInsert