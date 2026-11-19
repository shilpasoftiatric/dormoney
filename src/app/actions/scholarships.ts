"use server";

export async function trackApplication(scholarshipId: string) {
  return { success: true };
}

export async function searchScholarships(query: string = "") {
  return [];
}

export async function getSavedScholarships() {
  return [];
}

export async function setScholarshipAction(scholarshipId: string, action: string, dueDate?: string) {
  return { success: true };
}

export async function sendScholarshipReminder(scholarshipId: string, dueDate?: string, dueTime?: string) {
  return { success: true, smsSent: false };
}
