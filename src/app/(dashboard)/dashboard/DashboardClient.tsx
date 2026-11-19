"use client";

import { useState } from "react";
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  Share2,
  PlusCircle,
  CheckCircle2,
  Clock,
  Heart,
  Landmark,
  Search,
  FileText,
  Lock,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

interface DashboardClientProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organizationName?: string;
  };
  campaigns: Array<{
    id: string;
    title: string;
    story: string;
    goalAmount: number;
    frequency: string;
    status: string;
    createdAt: string;
  }>;
}

export function DashboardClient({ user, campaigns }: DashboardClientProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalGoal = campaigns.reduce((acc, curr) => acc + (curr.goalAmount || 0), 0);

  const handleCopyLink = (campaignId: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/campaign/${campaignId}` : "";
    navigator.clipboard.writeText(url);
    setCopiedId(campaignId);
    toast.success("Campaign link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A6FD4] via-[#145cb3] to-[#4CAF39] p-8 text-white shadow-xl shadow-blue-100">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="capitalize">{user.role} Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {user.role === "donor"
              ? "Your Dormoney giving fund is active. Discover eligible student campaigns, fund micro-scholarships, and track your community impact."
              : "Your Dormoney micro-scholarship campaigns are active. Track your contributions, share your funding goals, and connect with donors."}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {user.role === "donor" ? "Active Giving Funds" : "Active Campaigns"}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  {campaigns.length}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1A6FD4] flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {user.role === "donor" ? "Pledged Support Goal" : "Total Funding Goal"}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  ${totalGoal.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#4CAF39] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {user.role === "donor" ? "Students Supported" : "Community Backers"}
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                  0
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {user.role === "donor" ? "Your Giving Funds & Support Pledges" : "Your Micro-Scholarship Campaigns"}
            </h2>
            <p className="text-sm text-slate-500">
              {user.role === "donor"
                ? "Active funds and causes connecting your micro-donations directly to students."
                : "Active campaigns published to donors and community backers."}
            </p>
          </div>
          <Link href="/onboarding">
            <Button className="h-10 rounded-xl bg-[#1A6FD4] hover:bg-[#155ab0] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-200">
              <PlusCircle className="w-4 h-4 mr-2" /> {user.role === "donor" ? "New Giving Fund" : "New Campaign"}
            </Button>
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-2 border-slate-200 p-10 text-center bg-slate-50/50">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-[#1A6FD4] mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No campaigns created yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              Launch your first micro-scholarship campaign to start receiving contributions from backers.
            </p>
            <Link href="/onboarding">
              <Button className="bg-[#1A6FD4] hover:bg-[#155ab0] text-white rounded-xl">
                Create Campaign
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaigns.map((camp) => (
              <Card key={camp.id} className="rounded-3xl border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-[#4CAF39]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live & Receiving Backing
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {camp.frequency} Recurring
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 leading-snug">
                    {camp.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-3 text-sm mt-2">
                    {camp.story || "No description provided."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>Raised: $0</span>
                      <span className="font-bold text-slate-900">Goal: ${camp.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-[#4CAF39] h-full w-[2%] rounded-full" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(camp.id)}
                      className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-xs font-semibold"
                    >
                      {copiedId === camp.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-slate-400" /> Share Campaign Link
                        </>
                      )}
                    </Button>
                    <span className="text-[11px] text-slate-400">
                      Created {new Date(camp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Platform Features Preview (Phase 2) */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Dormoney Platform Modules
          </h2>
          <p className="text-sm text-slate-500">
            Additional platform features being activated in upcoming phases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Scholarship Directory",
              desc: "Explore institutional and external micro-scholarships.",
              icon: Search,
            },
            {
              title: "Application Tracker",
              desc: "Manage tasks, deadlines, and submission milestones.",
              icon: Clock,
            },
            {
              title: "College & Major Explorer",
              desc: "Compare college costs and financial aid packages.",
              icon: Landmark,
            },
            {
              title: "Resume & Essay Studio",
              desc: "Craft polished application documents with guidance.",
              icon: FileText,
            },
          ].map((feature, i) => (
            <Card key={i} className="rounded-2xl border-slate-200/80 bg-slate-50/50 p-5 space-y-3 relative opacity-75">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-200/60 text-slate-500 flex items-center justify-center">
                  <feature.icon className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  <Lock className="w-3 h-3" /> Phase 2
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{feature.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
