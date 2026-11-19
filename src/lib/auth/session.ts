import { cookies } from "next/headers";
import { signToken, verifyToken, JWTPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "dormoney_token";

export async function setSessionCookie(payload: JWTPayload): Promise<string> {
  const token = signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionPayload(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;
  return verifyToken(token);
}
