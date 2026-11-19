"use server";

export async function validateDiscountCode(code: string) {
  return { valid: true, reason: "" };
}

export async function applyDiscountCodeWithReferrals(data: any) {
  return { success: true };
}

export async function claimDiscountPlan(data: {
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}) {
  return { success: true };
}
