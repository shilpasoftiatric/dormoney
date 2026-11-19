import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, Campaign, User } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      campaignTitle = "My Micro-Scholarship Campaign",
      campaignStory = "",
      goalAmount = 0,
      donationFrequency = "monthly",
      givingInterests = [],
    } = body;

    await connectToDatabase();

    // If user is a donor, create their personalized Giving & Support Fund
    if (payload.role === "donor") {
      const interestsList =
        Array.isArray(givingInterests) && givingInterests.length > 0
          ? givingInterests
          : ["General Scholarships"];

      const donorUser = await User.findById(payload.userId);
      const donorName = donorUser?.firstName || donorUser?.contactName || "Donor";
      const defaultTitle = `${donorName}’s ${interestsList.slice(0, 2).join(" & ")} Giving Fund`;
      const defaultStory = `Committed to funding micro-scholarships and educational resources for ${interestsList.join(", ")} students.`;

      const campaign = await Campaign.create({
        userId: payload.userId,
        campaignTitle: campaignTitle?.trim() ? campaignTitle.trim() : defaultTitle,
        campaignStory: campaignStory?.trim() ? campaignStory.trim() : defaultStory,
        goalAmount: Number(goalAmount) > 0 ? Number(goalAmount) : 1000,
        donationFrequency: donationFrequency || "monthly",
        givingInterests: interestsList,
        status: "active",
      });

      await User.findByIdAndUpdate(payload.userId, {
        onboardingComplete: true,
        givingInterests: interestsList,
      });

      return NextResponse.json(
        {
          success: true,
          campaign: {
            id: campaign._id.toString(),
            title: campaign.campaignTitle,
            goalAmount: campaign.goalAmount,
            donationFrequency: campaign.donationFrequency,
            status: campaign.status,
          },
        },
        { status: 201 }
      );
    }

    // Create the campaign document linked to the user's ID
    const campaign = await Campaign.create({
      userId: payload.userId,
      campaignTitle: campaignTitle.trim() || "My Micro-Scholarship Campaign",
      campaignStory: campaignStory.trim(),
      goalAmount: Number(goalAmount) || 0,
      donationFrequency: donationFrequency || "monthly",
      givingInterests: [],
      status: "active",
    });

    // Update user record: set onboardingComplete = true
    await User.findByIdAndUpdate(payload.userId, {
      onboardingComplete: true,
    });

    return NextResponse.json(
      {
        success: true,
        campaign: {
          id: campaign._id.toString(),
          title: campaign.campaignTitle,
          goalAmount: campaign.goalAmount,
          donationFrequency: campaign.donationFrequency,
          status: campaign.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create campaign." },
      { status: 500 }
    );
  }
}
