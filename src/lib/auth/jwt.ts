import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dormoney-jwt-secret-key-phase1-production";
const JWT_EXPIRES_IN = "30d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isTestAccount?: boolean;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
