import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey, email } from "../lib/db/pg/util";

export const admins = pgTable('admins', {
    adminId: primaryKey('admin_id'),
    username: varchar('username', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    email: email().notNull().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    
    ...defaultTimestamps()
});

export type AdminSelect = typeof admins.$inferSelect
export type AdminInsert = typeof admins.$inferInsert