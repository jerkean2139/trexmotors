import { vehicles, inquiries, customerApplications, type Vehicle, type InsertVehicle, type Inquiry, type InsertInquiry, type CustomerApplication, type InsertCustomerApplication } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, lte, desc, gte } from "drizzle-orm";

export interface IStorage {
  // Vehicle operations
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicleBySlug(slug: string): Promise<Vehicle | undefined>;
  getVehicleById(id: number): Promise<Vehicle | undefined>;
  searchVehicles(filters: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: number;
    status?: string;
  }): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, updates: Partial<Vehicle>): Promise<Vehicle>;
  updateVehicleCarfax(id: number, carfaxEmbedCode: string): Promise<Vehicle>;
  deleteVehicle(id: number): Promise<void>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getAllInquiries(): Promise<Inquiry[]>;
  
  // Customer Application operations
  createCustomerApplication(application: InsertCustomerApplication): Promise<CustomerApplication>;
  getCustomerApplication(id: number): Promise<CustomerApplication | undefined>;
  getAllCustomerApplications(): Promise<CustomerApplication[]>;
  updateCustomerApplication(id: number, updates: Partial<CustomerApplication>): Promise<CustomerApplication>;
  deleteCustomerApplication(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles)
      .orderBy(
        desc(vehicles.bannerNew), // NEW banners first (true before false)
        desc(vehicles.createdAt)  // Then by creation date (newest first)
      );
  }

  async getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.slug, slug));
    return vehicle || undefined;
  }

  async getVehicleById(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async searchVehicles(filters: {
    make?: string;
    model?: string;
    year?: string;
    maxPrice?: number;
    status?: string;
  }): Promise<Vehicle[]> {
    let query = db.select().from(vehicles);
    const conditions = [];

    if (filters.make && filters.make !== "Any Make") {
      conditions.push(eq(vehicles.make, filters.make));
    }

    if (filters.model && filters.model !== "Any Model") {
      conditions.push(eq(vehicles.model, filters.model));
    }

    if (filters.year && filters.year !== "Any Year") {
      if (filters.year === "2020+") {
        // For year filtering, we'll need to use gte operator
        const { gte } = await import("drizzle-orm");
        conditions.push(gte(vehicles.year, "2020"));
      } else if (filters.year === "2015-2019") {
        const { gte, lte, and } = await import("drizzle-orm");
        conditions.push(and(gte(vehicles.year, "2015"), lte(vehicles.year, "2019")));
      } else if (filters.year === "2010-2014") {
        const { gte, lte, and } = await import("drizzle-orm");
        conditions.push(and(gte(vehicles.year, "2010"), lte(vehicles.year, "2014")));
      }
    }

    if (filters.maxPrice) {
      const { lte } = await import("drizzle-orm");
      conditions.push(lte(vehicles.price, filters.maxPrice));
    }

    if (filters.status) {
      conditions.push(eq(vehicles.status, filters.status));
    }

    if (conditions.length > 0) {
      const { and } = await import("drizzle-orm");
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(
      desc(vehicles.bannerNew), // NEW banners first (true before false)
      desc(vehicles.createdAt)  // Then by creation date (newest first)
    );
    
    return result;
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db
      .insert(vehicles)
      .values({
        ...insertVehicle,
        createdAt: new Date().toISOString()
      })
      .returning();
    return vehicle;
  }

  async updateVehicle(id: number, updates: Partial<Vehicle>): Promise<Vehicle> {
    const [vehicle] = await db
      .update(vehicles)
      .set(updates)
      .where(eq(vehicles.id, id))
      .returning();
    
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    return vehicle;
  }

  async updateVehicleCarfax(id: number, carfaxEmbedCode: string): Promise<Vehicle> {
    const [vehicle] = await db
      .update(vehicles)
      .set({ carfaxEmbedCode })
      .where(eq(vehicles.id, id))
      .returning();
    return vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...insertInquiry,
        phone: insertInquiry.phone || null,
        message: insertInquiry.message || null,
        vehicleId: insertInquiry.vehicleId || null,
        createdAt: new Date().toISOString()
      })
      .returning();
    return inquiry;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  // Customer Application operations
  async createCustomerApplication(application: InsertCustomerApplication): Promise<CustomerApplication> {
    const [newApplication] = await db
      .insert(customerApplications)
      .values(application)
      .returning();
    return newApplication;
  }

  async getCustomerApplication(id: number): Promise<CustomerApplication | undefined> {
    const [application] = await db
      .select()
      .from(customerApplications)
      .where(eq(customerApplications.id, id));
    return application || undefined;
  }

  async getAllCustomerApplications(): Promise<CustomerApplication[]> {
    return await db
      .select()
      .from(customerApplications)
      .orderBy(desc(customerApplications.submittedAt));
  }

  async updateCustomerApplication(id: number, updates: Partial<CustomerApplication>): Promise<CustomerApplication> {
    const [updatedApplication] = await db
      .update(customerApplications)
      .set(updates)
      .where(eq(customerApplications.id, id))
      .returning();
    return updatedApplication;
  }

  async deleteCustomerApplication(id: number): Promise<void> {
    await db
      .delete(customerApplications)
      .where(eq(customerApplications.id, id));
  }
}

export const storage = new DatabaseStorage();
