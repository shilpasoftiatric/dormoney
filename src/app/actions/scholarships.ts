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
