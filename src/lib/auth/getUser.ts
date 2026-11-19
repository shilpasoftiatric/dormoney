import { cache } from "react";
import { getSessionPayload } from "./session";
import { connectToDatabase, User, IUser } from "@/lib/mongodb";

export const getAuthenticatedUser = cache(async (): Promise<IUser | null> => {
  try {
    const payload = await getSessionPayload();
    if (!payload?.userId) return null;

    await connectToDatabase();
    const user = await User.findById(payload.userId).lean<IUser>();
    return user || null;
  } catch (err) {
    console.error("Error in getAuthenticatedUser:", err);
    return null;
  }
});
