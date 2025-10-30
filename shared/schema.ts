import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("peer"), // peer, company, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Professional profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  bio: text("bio"),
  location: varchar("location"),
  skills: text("skills").array(),
  experience: integer("experience"), // years of experience
  hourlyRate: integer("hourly_rate"),
  availability: varchar("availability"), // available, busy, not_available
  certifications: text("certifications").array(),
  portfolioUrl: varchar("portfolio_url"),
  linkedinUrl: varchar("linkedin_url"),
  githubUrl: varchar("github_url"),
  isPublic: boolean("is_public").default(true),
  completionScore: integer("completion_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  website: varchar("website"),
  industry: varchar("industry"),
  size: varchar("size"), // startup, small, medium, large, enterprise
  location: varchar("location"),
  logoUrl: varchar("logo_url"),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job postings
export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  skills: text("skills").array(),
  location: varchar("location"),
  type: varchar("type").notNull(), // full-time, part-time, contract, remote
  experienceLevel: varchar("experience_level"), // entry, mid, senior, expert
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryType: varchar("salary_type"), // yearly, hourly, daily, project
  
  // Databricks-specific fields
  databricksUsage: text("databricks_usage"), // How will Databricks be used in this project
  projectVision: text("project_vision"), // High-level project vision and goals
  projectScope: text("project_scope"), // Detailed project scope description
  projectDuration: varchar("project_duration"), // Expected project timeline
  databricksComponents: text("databricks_components").array(), // Which Databricks components will be used
  dataVolume: varchar("data_volume"), // Expected data volume/scale
  
  // Team and decision makers
  keyTeamMembers: text("key_team_members").array(), // Key team member names and roles
  decisionMakers: text("decision_makers").array(), // Decision maker names and titles
  technicalContact: varchar("technical_contact"), // Primary technical contact
  hiringManager: varchar("hiring_manager"), // Hiring manager name
  
  // Verification and status
  verificationStatus: varchar("verification_status").notNull().default("pending"), // pending, approved, rejected
  verificationNotes: text("verification_notes"), // Admin notes for verification
  verifiedById: varchar("verified_by_id").references(() => users.id), // Who verified the job
  verifiedAt: timestamp("verified_at"),
  
  isActive: boolean("is_active").default(true),
  applicationCount: integer("application_count").default(0),
  viewCount: integer("view_count").default(0),
  postedById: varchar("posted_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job applications
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  coverLetter: text("cover_letter"),
  status: varchar("status").notNull().default("pending"), // pending, reviewing, interview, rejected, accepted
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Profile views tracking
export const profileViews = pgTable("profile_views", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  viewerId: varchar("viewer_id"), // nullable for anonymous views
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Job views tracking
export const jobViews = pgTable("job_views", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  viewerId: varchar("viewer_id"), // nullable for anonymous views
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Consultant applications (separate from general profiles for specialized signup)
export const consultants = pgTable("consultants", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  handle: varchar("handle").notNull().unique(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone"),
  linkedin: varchar("linkedin"),
  location: varchar("location"),
  cvPath: varchar("cv_path"), // Path to uploaded CV file
  yearsExperience: varchar("years_experience").notNull(), // '1-2', '3-5', '6-10', '10+'
  specialization: varchar("specialization").notNull(), // 'data-engineering', 'machine-learning', 'data-architecture', 'analytics', 'migration'
  hourlyRateRange: varchar("hourly_rate_range"), // '50-75', '75-100', '100-150', '150-200', '200+'
  availability: varchar("availability"), // 'full-time', 'part-time', 'project-based', 'limited'
  certifications: text("certifications").array(),
  skills: text("skills").array().notNull(), // Databricks specific skills
  industries: text("industries").array(), // Industry experience
  bio: text("bio").notNull(),
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'draft'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project references for consultants
export const consultantReferences = pgTable("consultant_references", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  consultantId: uuid("consultant_id").notNull().references(() => consultants.id, { onDelete: "cascade" }),
  projectName: varchar("project_name").notNull(),
  projectDescription: text("project_description"),
  duration: varchar("duration"),
  managerName: varchar("manager_name").notNull(),
  managerEmail: varchar("manager_email").notNull(),
  technologies: text("technologies").array(),
  permissionToContact: boolean("permission_to_contact").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  companies: many(companies),
  postedJobs: many(jobs),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  applications: many(applications),
  views: many(profileViews),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  createdBy: one(users, { fields: [companies.createdById], references: [users.id] }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, { fields: [jobs.companyId], references: [companies.id] }),
  postedBy: one(users, { fields: [jobs.postedById], references: [users.id] }),
  applications: many(applications),
  views: many(jobViews),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  profile: one(profiles, { fields: [applications.profileId], references: [profiles.id] }),
}));

export const profileViewsRelations = relations(profileViews, ({ one }) => ({
  profile: one(profiles, { fields: [profileViews.profileId], references: [profiles.id] }),
  viewer: one(users, { fields: [profileViews.viewerId], references: [users.id] }),
}));

export const jobViewsRelations = relations(jobViews, ({ one }) => ({
  job: one(jobs, { fields: [jobViews.jobId], references: [jobs.id] }),
  viewer: one(users, { fields: [jobViews.viewerId], references: [users.id] }),
}));

export const consultantsRelations = relations(consultants, ({ many }) => ({
  references: many(consultantReferences),
}));

export const consultantReferencesRelations = relations(consultantReferences, ({ one }) => ({
  consultant: one(consultants, { fields: [consultantReferences.consultantId], references: [consultants.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionScore: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  applicationCount: true,
  viewCount: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  updatedAt: true,
});

export const insertConsultantSchema = createInsertSchema(consultants).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  handle: z.string().min(3, "Handle must be at least 3 characters").max(30, "Handle must be less than 30 characters").regex(/^[a-zA-Z0-9_-]+$/, "Handle can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  bio: z.string().min(50, "Professional summary must be at least 50 characters"),
});

export const insertConsultantReferenceSchema = createInsertSchema(consultantReferences).omit({
  id: true,
  createdAt: true,
}).extend({
  managerEmail: z.string().email(),
  projectName: z.string().min(1, "Project name is required"),
  managerName: z.string().min(1, "Manager name is required"),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ProfileView = typeof profileViews.$inferSelect;
export type JobView = typeof jobViews.$inferSelect;
export type Consultant = typeof consultants.$inferSelect;
export type InsertConsultant = z.infer<typeof insertConsultantSchema>;
export type ConsultantReference = typeof consultantReferences.$inferSelect;
export type InsertConsultantReference = z.infer<typeof insertConsultantReferenceSchema>;
