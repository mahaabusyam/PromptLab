import type {
  DashboardStats,
  WelcomeSummary,
} from "@/features/dashboard/types";

// activeTests و modelCount بتنحسب من البيانات الحقيقية
export const mockWelcome: WelcomeSummary = {
  userName: "Maha",
  activeTests: 0,
  modelCount: 0,
  efficiencyGain: 34,
};

// Demo: ما في طريقة نقيس الوقت الموفّر محلياً
export const demoSavedTime: DashboardStats["savedTime"] = {
  hours: 164.8,
  estimatedRoi: "$12.4k",
  trend: [4, 8, 14, 12, 20, 24, 26, 34],
};
