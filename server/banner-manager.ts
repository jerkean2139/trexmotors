import { db } from "./db";
import { vehicles } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";
import cron from "node-cron";

/**
 * Banner Management Service
 * Handles automatic removal of NEW banners after 5 days
 */
class BannerManager {
  constructor() {
    this.startScheduledCleanup();
  }

  /**
   * Remove NEW banners from vehicles older than 5 days
   */
  async removeExpiredNewBanners(): Promise<number> {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    try {
      const expiredVehicles = await db
        .update(vehicles)
        .set({ bannerNew: false })
        .where(
          and(
            eq(vehicles.bannerNew, true),
            lt(vehicles.createdAt, fiveDaysAgo.toISOString())
          )
        )
        .returning({ id: vehicles.id, title: vehicles.title });

      if (expiredVehicles.length > 0) {
        console.log(`Removed NEW banners from ${expiredVehicles.length} vehicles:`, 
          expiredVehicles.map(v => v.title));
      }

      return expiredVehicles.length;
    } catch (error) {
      console.error("Error removing expired NEW banners:", error);
      return 0;
    }
  }

  /**
   * Start scheduled cleanup that runs daily at 2 AM
   */
  startScheduledCleanup(): void {
    // Run daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled NEW banner cleanup...');
      await this.removeExpiredNewBanners();
    });

    console.log('Banner manager started - NEW banners will be removed after 5 days');
  }

  /**
   * Manual cleanup for immediate execution
   */
  async manualCleanup(): Promise<number> {
    console.log('Running manual NEW banner cleanup...');
    return await this.removeExpiredNewBanners();
  }

  /**
   * Get statistics about current banners
   */
  async getBannerStats(): Promise<{
    totalNew: number;
    expiringSoon: number; // Within 1 day of expiring
    totalReduced: number;
    totalGreatDeal: number;
    totalSold: number;
  }> {
    try {
      const oneDayFromExpiry = new Date();
      oneDayFromExpiry.setDate(oneDayFromExpiry.getDate() - 4); // 4 days old = expires in 1 day

      const [stats] = await db
        .select({
          totalNew: vehicles.bannerNew,
          totalReduced: vehicles.bannerReduced, 
          totalGreatDeal: vehicles.bannerGreatDeal,
          totalSold: vehicles.bannerSold
        })
        .from(vehicles);

      // Get count of vehicles with NEW banner
      const newBannerVehicles = await db
        .select({ id: vehicles.id, createdAt: vehicles.createdAt })
        .from(vehicles)
        .where(eq(vehicles.bannerNew, true));

      const totalNew = newBannerVehicles.length;
      const expiringSoon = newBannerVehicles.filter(v => 
        v.createdAt && new Date(v.createdAt) <= oneDayFromExpiry
      ).length;

      const reducedCount = await db
        .select({ count: vehicles.id })
        .from(vehicles)
        .where(eq(vehicles.bannerReduced, true));

      const greatDealCount = await db
        .select({ count: vehicles.id })
        .from(vehicles)
        .where(eq(vehicles.bannerGreatDeal, true));

      const soldCount = await db
        .select({ count: vehicles.id })
        .from(vehicles)
        .where(eq(vehicles.bannerSold, true));

      return {
        totalNew,
        expiringSoon,
        totalReduced: reducedCount.length,
        totalGreatDeal: greatDealCount.length,
        totalSold: soldCount.length
      };
    } catch (error) {
      console.error("Error getting banner stats:", error);
      return {
        totalNew: 0,
        expiringSoon: 0,
        totalReduced: 0,
        totalGreatDeal: 0,
        totalSold: 0
      };
    }
  }
}

export const bannerManager = new BannerManager();