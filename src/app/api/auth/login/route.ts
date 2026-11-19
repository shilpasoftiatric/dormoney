import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, User } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account suspended. Please contact support." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      isTestAccount: user.isTestAccount,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        onboardingComplete: user.onboardingComplete,
      },
    });

    // Set HTTP-only session cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in." },
      { status: 500 }
    );
  }
}
