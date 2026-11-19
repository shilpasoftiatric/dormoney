import type { Metadata } from "next";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { connectToDatabase, Campaign } from "@/lib/mongodb";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard | Dormoney" };

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return null;
  }

  await connectToDatabase();
  const campaigns = await Campaign.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const formattedCampaigns = campaigns.map((c: any) => ({
    id: c._id.toString(),
    title: c.campaignTitle,
    story: c.campaignStory,
    goalAmount: c.goalAmount,
    frequency: c.donationFrequency,
    status: c.status,
    createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
  }));

  const firstName =
    user.firstName ||
    user.contactName ||
    user.organizationName ||
    user.email.split("@")[0];

  return (
    <DashboardClient
      user={{
        id: user._id.toString(),
        firstName,
        lastName: user.lastName || "",
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
      }}
      campaigns={formattedCampaigns}
    />
  );
}
