import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, User, UserRole } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      role = "student",
      firstName = "",
      lastName = "",
      phone = "",
      smsOptIn = false,
      termsAgreed = true,
      organizationName = "",
      contactName = "",
      name = "",
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ["student", "parent", "donor", "organization"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Resolve name fields based on role
    const resolvedFirstName = firstName || (role === "donor" ? name : "") || (role === "organization" ? contactName : "");
    const resolvedLastName = lastName || "";

    const newUser = await User.create({
      email: normalizedEmail,
      passwordHash,
      role,
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      phone,
      smsOptIn: Boolean(smsOptIn),
      termsAgreed: Boolean(termsAgreed),
      organizationName: role === "organization" ? organizationName : "",
      contactName: role === "organization" ? contactName : "",
      isActive: true,
      onboardingComplete: false,
      isTestAccount: false,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      isTestAccount: newUser.isTestAccount,
    });

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          onboardingComplete: newUser.onboardingComplete,
        },
      },
      { status: 201 }
    );

    // Set HTTP-only cookie for web app
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account." },
      { status: 500 }
    );
  }
}
