import { cache } from "react";
import { connectToDatabase, User } from "@/lib/mongodb";

export const getStudentDashboardData = cache(async (userId: string) => {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).lean();

    const userProfile: Record<string, any> = {
      id: userId,
      email: user?.email || "",
      student_first_name: user?.firstName || "Student",
      student_last_name: user?.lastName || "",
      first_name: user?.firstName || "Student",
      role: user?.role || "student",
      account_type: user?.role === "parent" ? "parent" : "student",
      subscription_status: "active",
      onboarding_complete: user?.onboardingComplete ?? true,
      current_streak: 1,
      schoolari_goals: [],
      masterId: userId,
      subscriptionOwnerId: userId,
    };

    return {
      userProfile,
      profile: userProfile,
      masterId: userId,
      subscriptionOwnerId: userId,
      documents: [] as any[],
      essays: [] as any[],
      savedColleges: [] as any[],
      applications: [] as any[],
      resume: null as any,
      tasks: [],
      globalTasks: [],
      trackerItems: [],
      matchedScholarshipsCount: 0,
      documentsCount: 0,
      essaysCount: 0,
      collegesCount: 0,
      activeApplicationCount: 0,
      wonApplicationCount: 0,
      totalAwarded: 0,
      unreadMessageCount: 0,
      dailyEarnVideos: [],
      hasDismissedTodayVideo: false,
      userPreferences: null,
      coachingStatus: { enrolled: false, activeSession: null, completedCount: 0 },
    };
  } catch {
    const defaultProfile: Record<string, any> = {
      id: userId,
      email: "",
      student_first_name: "Student",
      student_last_name: "",
      first_name: "Student",
      role: "student",
      account_type: "student",
      subscription_status: "active",
      onboarding_complete: true,
      current_streak: 1,
      schoolari_goals: [],
      masterId: userId,
      subscriptionOwnerId: userId,
    };

    return {
      userProfile: defaultProfile,
      profile: defaultProfile,
      masterId: userId,
      subscriptionOwnerId: userId,
      documents: [] as any[],
      essays: [] as any[],
      savedColleges: [] as any[],
      applications: [] as any[],
      resume: null as any,
      tasks: [],
      globalTasks: [],
      trackerItems: [],
      matchedScholarshipsCount: 0,
      documentsCount: 0,
      essaysCount: 0,
      collegesCount: 0,
      activeApplicationCount: 0,
      wonApplicationCount: 0,
      totalAwarded: 0,
      unreadMessageCount: 0,
      dailyEarnVideos: [],
      hasDismissedTodayVideo: false,
      userPreferences: null,
      coachingStatus: { enrolled: false, activeSession: null, completedCount: 0 },
    };
  }
});
