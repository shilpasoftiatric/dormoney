"use server";

export async function validateDiscountCode(code: string) {
  return { valid: true, reason: "" };
}

export async function applyDiscountCodeWithReferrals(data: any) {
  return { success: true };
}
