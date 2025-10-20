import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface WasteReport {
  id: string;
  userId: string;
  userName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  wasteType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  images: string[];
  status: "pending" | "in_progress" | "completed";
  reportedAt: string;
  contactName: string;
  contactPhone?: string;
  completedAt?: string;
}

interface WasteReportsContextType {
  reports: WasteReport[];
  addReport: (
    report: Omit<WasteReport, "id" | "reportedAt" | "status">,
  ) => Promise<{ success: boolean; pointsEarned?: number }>;
  updateReportStatus: (
    id: string,
    status: WasteReport["status"],
  ) => Promise<boolean>;
  getUserReports: (userId: string) => WasteReport[];
}

const WasteReportsContext = createContext<WasteReportsContextType | undefined>(
  undefined,
);

export function WasteReportsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reports, setReports] = useState<WasteReport[]>([]);

  useEffect(() => {
    // Load reports from API on mount
    const loadReports = async () => {
      try {
        const response = await apiClient.getAllReports();
        setReports(response.reports);
      } catch (error) {
        console.error("Error loading reports:", error);
        // If API fails, we'll just start with empty array
        setReports([]);
      }
    };

    loadReports();
  }, []);

  const addReport = async (
    reportData: Omit<WasteReport, "id" | "reportedAt" | "status">,
  ): Promise<{ success: boolean; pointsEarned?: number }> => {
    try {
      const response = await apiClient.createReport(reportData);

      // Add the new report to local state
      const updatedReports = [...reports, response.report];
      setReports(updatedReports);

      return { success: true, pointsEarned: response.pointsEarned };
    } catch (error) {
      console.error("Error creating report:", error);
      return { success: false };
    }
  };

  const updateReportStatus = async (
    id: string,
    status: WasteReport["status"],
  ): Promise<boolean> => {
    try {
      const response = await apiClient.updateReportStatus(id, status);

      // Update local state
      const updatedReports = reports.map((report) =>
        report.id === id ? response.report : report,
      );
      setReports(updatedReports);

      return true;
    } catch (error) {
      console.error("Error updating report status:", error);
      return false;
    }
  };

  const getUserReports = (userId: string) => {
    return reports.filter((report) => report.userId === userId);
  };

  const value = {
    reports,
    addReport,
    updateReportStatus,
    getUserReports,
  };

  return (
    <WasteReportsContext.Provider value={value}>
      {children}
    </WasteReportsContext.Provider>
  );
}

export function useWasteReports() {
  const context = useContext(WasteReportsContext);
  if (context === undefined) {
    throw new Error(
      "useWasteReports must be used within a WasteReportsProvider",
    );
  }
  return context;
}
