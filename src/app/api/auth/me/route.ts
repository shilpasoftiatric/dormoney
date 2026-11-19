import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { connectToDatabase, User } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // Check Authorization header or Cookie
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      token = req.cookies.get(AUTH_COOKIE_NAME)?.value || null;
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        organizationName: user.organizationName,
        contactName: user.contactName,
        givingInterests: user.givingInterests,
        onboardingComplete: user.onboardingComplete,
        isTestAccount: user.isTestAccount,
      },
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
