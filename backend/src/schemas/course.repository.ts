import { json, pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey } from "../lib/db/pg/util";
import { relations } from "drizzle-orm";
import { studentCourseMappings } from "./mapping.repository";

export type CertificateTemplate = {
    type: 'html' | 'custom';
    content: string;
}

export const courses = pgTable('courses', {
    courseId: primaryKey('course_id'),
    title: varchar('title', { length: 255 }).notNull(),
    duration: varchar('duration', { length: 100 }).notNull(),
    startDate: timestamp('start_date', { mode: 'date' }).notNull(),
    endDate: timestamp('end_date', { mode: 'date' }).notNull(),
    certificateTemplate: json('certificate_template').$type<CertificateTemplate>().notNull(),
    description: text('description'),
    
    ...defaultTimestamps()
});

export const coursesRelations = relations(courses, ({ many }) => ({
    mappings: many(studentCourseMappings)
}));

export type CourseSelect = typeof courses.$inferSelect
export type CourseInsert = typeof courses.$inferInsert