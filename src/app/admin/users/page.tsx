export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { connectToDatabase, User } from "@/lib/mongodb";
import { UsersTable } from "./UsersTable";
import { ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
  await connectToDatabase();

  // Fetch all users from MongoDB
  const mongoUsers = await User.find({}).sort({ createdAt: -1 }).lean();

  // Map MongoDB documents to the schema expected by UsersTable
  const formattedUsers = mongoUsers.map((u: any) => {
    const isStudent = u.role === "student";
    const isParent = u.role === "parent";

    return {
      id: u._id.toString(),
      _id: u._id.toString(),
      email: u.email || "—",
      first_name: u.firstName || u.contactName || "",
      last_name: u.lastName || "",
      phone: u.phone || "",
      account_type: u.role || "student",
      role: u.role || "student",
      student_first_name: isStudent ? u.firstName : "",
      student_last_name: isStudent ? u.lastName : "",
      student_email: isStudent ? u.email : "",
      student_phone: isStudent ? u.phone : "",
      parent_first_name: isParent ? u.firstName : "",
      parent_last_name: isParent ? u.lastName : "",
      parent_email: isParent ? u.email : "",
      parent_phone: isParent ? u.phone : "",
      organization_name: u.organizationName || "",
      contact_name: u.contactName || "",
      created_at: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      updated_at: u.updatedAt ? new Date(u.updatedAt).toISOString() : new Date().toISOString(),
      is_active: u.isActive !== false,
      onboarding_complete: !!u.onboardingComplete,
      is_test_account: !!u.isTestAccount,
      created_by_admin: false,
      user_metadata: {},
      usage: null,
      ai_limits: [],
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-violet-600" />
          Users / Members
        </h1>
        <p className="text-slate-500 mt-1">
          View and manage registered student, parent, donor, and member accounts from MongoDB.
        </p>
      </div>

      <UsersTable initialUsers={formattedUsers} />
    </div>
  );
}
