import { pgTable, text, serial, integer, boolean, jsonb, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull(), // "for-sale", "sold", "pending"
  mileage: text("mileage").notNull(),
  year: text("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  vin: text("vin").unique(),
  stockNumber: text("stock_number"),
  engine: text("engine").notNull(),
  transmission: text("transmission").notNull(),
  driveType: text("drive_type").notNull(),
  exteriorColor: text("exterior_color").notNull(),
  interiorColor: text("interior_color").notNull(),
  images: text("images").array().notNull(),
  keyFeatures: text("key_features").array().notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  carfaxEmbedCode: text("carfax_embed_code"), // Optional CarFax embed code
  autoCheckUrl: text("autocheck_url"), // AutoCheck report URL
  vehicleHistoryScore: integer("vehicle_history_score"), // 1-100 score from history reports
  accidentHistory: integer("accident_history").default(0), // Number of reported accidents
  previousOwners: integer("previous_owners").default(0), // Number of previous owners
  serviceRecords: integer("service_records").default(0), // Number of service records
  titleStatus: text("title_status").default("unknown"), // clean, branded, lemon, flood, etc.
  lastHistoryUpdate: text("last_history_update"), // When history data was last updated
  notes: text("notes"),
  lastSyncedAt: text("last_synced_at"),
  // Banner system
  bannerReduced: boolean("banner_reduced").default(false),
  bannerSold: boolean("banner_sold").default(false),
  bannerGreatDeal: boolean("banner_great_deal").default(false),
  bannerNew: boolean("banner_new").default(false),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  vehicleId: integer("vehicle_id"),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

// Customer Applications Table
export const customerApplications = pgTable('customer_applications', {
  id: serial('id').primaryKey(),
  // Application status and metadata
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'denied', 'reviewing'
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: text('reviewed_by'), // admin user who reviewed
  adminNotes: text('admin_notes'),
  
  // Primary Borrower Information
  borrowerFirstName: text('borrower_first_name').notNull(),
  borrowerLastName: text('borrower_last_name').notNull(),
  borrowerEmail: text('borrower_email').notNull(),
  borrowerPhone: text('borrower_phone').notNull(),
  borrowerDob: date('borrower_dob'),
  borrowerSsn: text('borrower_ssn'), // encrypted in production
  
  // Address Information
  streetAddress: text('street_address'),
  city: text('city'),
  state: text('state'),
  country: text('country').default('United States'),
  postalCode: text('postal_code'),
  priorAddress: text('prior_address'),
  
  // Living Situation
  livingSituation: text('living_situation'), // 'own', 'rent', 'lend'
  residenceDuration: text('residence_duration'),
  monthlyPayment: integer('monthly_payment'), // rent/mortgage payment in cents
  
  // Employment Information
  employer: text('employer'),
  yearsEmployed: text('years_employed'),
  employerPhone: text('employer_phone'),
  monthlyGrossIncome: integer('monthly_gross_income'), // in cents
  
  // Banking Information
  bankName: text('bank_name'),
  accountType: text('account_type'), // 'checking', 'savings', 'both'
  
  // Co-Borrower Information (optional)
  coBorrowerFirstName: text('co_borrower_first_name'),
  coBorrowerLastName: text('co_borrower_last_name'),
  coBorrowerEmail: text('co_borrower_email'),
  coBorrowerPhone: text('co_borrower_phone'),
  coBorrowerDob: date('co_borrower_dob'),
  coBorrowerSsn: text('co_borrower_ssn'),
  
  // Additional Information
  notes: text('notes'),
  consentToSms: boolean('consent_to_sms').default(false),
  
  // Digital Signatures
  borrowerSignature: text('borrower_signature'), // base64 signature data
  coBorrowerSignature: text('co_borrower_signature'),
  
  // Source tracking
  referralSource: text('referral_source'),
  interestedVehicle: integer('interested_vehicle_id').references(() => vehicles.id)
});

export const insertCustomerApplicationSchema = createInsertSchema(customerApplications).omit({
  id: true,
  submittedAt: true,
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type CustomerApplication = typeof customerApplications.$inferSelect;
export type InsertCustomerApplication = z.infer<typeof insertCustomerApplicationSchema>;
