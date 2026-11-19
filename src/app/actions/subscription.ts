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

export async function cancelOwnSubscription() {
  return { success: true, immediate: true };
}

export async function resumeSubscription() {
  return { success: true, message: "Subscription management is disabled during Phase 1." };
}

export async function getSubscriptionInfo(targetUserId?: string) {
  return {
    plan: "starter" as const,
    planInfo: {
      name: "Starter",
      label: "Starter Plan",
      price: "$29",
      description: "Basic College Prep Solutions",
    },
    status: "active",
    renewalDate: null,
    hasSubscription: true,
  };
}

export async function getUpgradePreview(targetPriceId: string) {
  return {
    amountDue: 0,
    nextBillingDate: "Next Month",
    isTrialing: false,
    requiresCheckout: false,
  };
}

export async function scheduleSubscriptionUpgrade(targetPriceId: string) {
  return {
    success: true,
    message: "Plan upgrade scheduled.",
    scheduledFor: "Next billing cycle",
  };
}
