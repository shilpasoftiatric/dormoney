"use server";

import { connectToDatabase, User } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function getProfile() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    role: user.role,
    onboarding_complete: user.onboardingComplete,
  };
}

export async function saveOnboardingStep(step: number, data: any) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: "Unauthorized" };

  await connectToDatabase();
  await User.findByIdAndUpdate(user._id, {
    ...data,
    onboardingStep: step,
  });

  return { success: true };
}

export async function updateProfile(updates: any) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: "Unauthorized" };

  await connectToDatabase();
  await User.findByIdAndUpdate(user._id, {
    ...updates,
  });

  return { success: true };
}
