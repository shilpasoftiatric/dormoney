"use server";

export async function getUserPlanAction() {
  return "starter" as const;
}

export async function upgradeSubscriptionPlan(newPriceId: string) {
  return { success: true, message: "All features are fully unlocked during Phase 1." };
}

export async function cancelSubscription() {
  return { success: true, message: "Subscription management is disabled during Phase 1." };
}

export async function resumeSubscription() {
  return { success: true, message: "Subscription management is disabled during Phase 1." };
}
