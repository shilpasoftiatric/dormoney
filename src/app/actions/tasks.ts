"use server";

export async function completeTask(taskId: string, taskTitle?: string) {
  return { success: true };
}

export async function skipTask(taskId: string) {
  return { success: true };
}

export async function moveTaskToTracker(taskId: string, title: string) {
  return { success: true };
}
