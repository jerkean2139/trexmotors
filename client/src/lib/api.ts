import { apiRequest } from "./queryClient";
import type { Vehicle, InsertInquiry } from "@shared/schema";

export const api = {
  vehicles: {
    getAll: async (): Promise<Vehicle[]> => {
      const response = await apiRequest("GET", "/api/vehicles");
      return response.json();
    },
    
    getBySlug: async (slug: string): Promise<Vehicle> => {
      const response = await apiRequest("GET", `/api/vehicles/${slug}`);
      return response.json();
    },
    
    search: async (filters: {
      make?: string;
      model?: string;
      year?: string;
      maxPrice?: number;
      status?: string;
    }): Promise<Vehicle[]> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString());
        }
      });
      
      const response = await apiRequest("GET", `/api/vehicles/search?${params}`);
      return response.json();
    }
  },
  
  inquiries: {
    create: async (inquiry: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", inquiry);
      return response.json();
    }
  }
};
