"use server";

import { redirect } from "next/navigation";
import { connectToDatabase, User, UserRole } from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export async function signUp(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const phone = (formData.get("phone") as string)?.trim() || "";
    const role = (formData.get("role") as UserRole) || "student";
    const firstName = (formData.get("first_name") as string)?.trim() || (formData.get("name") as string)?.trim() || "";
    const lastName = (formData.get("last_name") as string)?.trim() || "";
    const organizationName = (formData.get("organization_name") as string)?.trim() || "";
    const contactName = (formData.get("contact_name") as string)?.trim() || "";
    const smsOptIn = formData.get("sms_opt_in") === "true" || formData.get("sms_consent_agreement") === "on";

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(password);

    const newUser = await User.create({
      email,
      passwordHash,
      role,
      firstName: firstName || contactName,
      lastName,
      phone,
      smsOptIn,
      organizationName,
      contactName,
      isActive: true,
      onboardingComplete: false,
      isTestAccount: false,
    });

    await setSessionCookie({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      isTestAccount: false,
    });

    return { success: true, redirectUrl: "/onboarding" };
  } catch (error: any) {
    console.error("SignUp Server Action error:", error);
    return { error: error.message || "Failed to create account." };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const password = formData.get("password") as string;
    const isAdminLogin = formData.get("isAdminLogin") === "true";

    if (!email || !password) {
      return { error: "Email and password are required." };
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password." };
    }

    if (!user.isActive) {
      return { error: "Account suspended. Please contact support." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password." };
    }

    // Role check for admin login
    const isStaff = user.role === "admin" || user.role === "super_admin";
    if (isAdminLogin && !isStaff) {
      return { error: "Access denied. You do not have staff privileges." };
    }

    if (!isAdminLogin && isStaff) {
      return { error: "This is the member portal. Please use the admin login page." };
    }

    user.lastLoginAt = new Date();
    await user.save();

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      isTestAccount: user.isTestAccount,
    });

    if (isAdminLogin) {
      redirect("/admin/dashboard");
    }

    if (!user.onboardingComplete && !user.isTestAccount) {
      redirect("/onboarding");
    }

    redirect("/dashboard");
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("SignIn Server Action error:", error);
    return { error: error.message || "Invalid credentials." };
  }
}

export async function signOut() {
  await clearSessionCookie();
  redirect("/login");
}

export async function healInvitedUserProfile(): Promise<{ redirectTo: string }> {
  return { redirectTo: "/dashboard" };
}

export async function sendPasswordResetLink(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  return {
    success: true,
    message: "If an account exists for this email address, password reset instructions will be sent.",
  };
}
