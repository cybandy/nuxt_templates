import { sqliteTable, text, integer, primaryKey, sqliteView } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// -- CORE TABLES --

/**
 * Members Table
 * This is the central table for every person in the church directory.
 * It stores personal information and status. We'll call it 'users'
 * as that is a common convention, especially when adding authentication.
 */
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => generateId('user')),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  avatar: text('avatar'),
  email: text('email').notNull().unique(),
  password: text('password'),
  phoneNumber: text('phone_number'),
  address: text('address'),
  bio: text('bio'),
  nationality: text('nationality'),
  db: integer('db', { mode: 'timestamp' }),
  status: text('status', { enum: ['active', 'inactive', 'visitor'] }).default('active').notNull(),
  githubId: integer('github_id').unique(),
  githubToken: text('github_token'),
  googleId: text('google_id').unique(),
  googleToken: text('google_token'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
