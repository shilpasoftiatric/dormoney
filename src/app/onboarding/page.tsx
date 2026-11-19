"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Heart,
  Building2,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, PhoneInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RoleType = "student" | "parent" | "donor" | "organization";

const DONOR_GIVING_INTERESTS = [
  "STEM",
  "First-Gen",
  "Arts",
  "Athletics",
  "Business",
  "Pre-Med",
];

export default function OnboardingPage() {
  const router = useRouter();

  // Onboarding Step: 1 = Role, 2 = Account Creation, 3 = Campaign Creation, 4 = Confirmation
  const [step, setStep] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");

  // Account creation form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");

  // Campaign creation form state
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignStory, setCampaignStory] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [donationFrequency, setDonationFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper for Donor Interests toggle
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Step 2 Submission: Register Account
  async function handleAccountCreation(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate password (min 8 chars, at least 1 number)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if ((selectedRole === "student" || selectedRole === "parent") && !termsAgreed) {
      setError("You must agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          email,
          password,
          firstName: selectedRole === "student" || selectedRole === "parent" ? firstName : "",
          name: selectedRole === "donor" ? firstName : "",
          lastName,
          phone,
          smsOptIn,
          termsAgreed,
          organizationName: selectedRole === "organization" ? organizationName : "",
          contactName: selectedRole === "organization" ? contactName : "",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Pre-fill campaign title based on role
      if (selectedRole === "student") {
        setCampaignTitle(`${firstName ? firstName + "'s" : "My"} Micro-Scholarship Campaign`);
      } else if (selectedRole === "parent") {
        setCampaignTitle(`College Support Fund for My Child`);
      } else if (selectedRole === "organization") {
        setCampaignTitle(`${organizationName ? organizationName + " Scholarship Fund" : "Community Scholarship Fund"}`);
      } else if (selectedRole === "donor") {
        setCampaignTitle(`${firstName ? firstName + "'s" : "My"} Student Giving Fund`);
      }

      setLoading(false);
      setStep(3); // Advance to embedded campaign creation
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  // Step 3 Submission: Embedded Campaign Creation
  async function handleCampaignCreation(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignTitle: campaignTitle.trim() || "My Campaign",
          campaignStory: campaignStory.trim(),
          goalAmount: Number(goalAmount) || 0,
          donationFrequency,
          givingInterests: selectedRole === "donor" ? selectedInterests : [],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to create campaign.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setStep(4); // Advance to confirmation
    } catch (err: any) {
      setError(err.message || "Failed to save campaign.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Progress Header */}
      {step < 4 && (
        <div className="px-6 py-2.5 sm:px-7 sm:py-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span>
              {step === 1 && "Step 1 of 3: Select Your Role"}
              {step === 2 && "Step 2 of 3: Create Your Account"}
              {step === 3 && "Step 3 of 3: Micro-Scholarship Campaign"}
            </span>
            <span className="text-[#1A6FD4] font-semibold">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1A6FD4] to-[#4CAF39] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {error && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-100 text-xs sm:text-sm text-red-600 flex items-start gap-2.5">
            <span className="text-red-400 font-bold">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PART A: ROLE SELECTION
        ───────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome to Dormoney 👋
              </h1>
              <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">
                Select your account type to personalize your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Student */}
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  selectedRole === "student"
                    ? "border-[#1A6FD4] bg-blue-50/50 shadow-sm ring-1 ring-[#1A6FD4]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1A6FD4] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">I'm a Student</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Create your micro-scholarship campaign and receive direct donations.
                  </p>
                </div>
              </button>

              {/* Option 2: Parent */}
              <button
                type="button"
                onClick={() => setSelectedRole("parent")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  selectedRole === "parent"
                    ? "border-[#1A6FD4] bg-blue-50/50 shadow-sm ring-1 ring-[#1A6FD4]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">I'm a Parent</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Set up and manage a micro-scholarship campaign for your child.
                  </p>
                </div>
              </button>

              {/* Option 3: Donor / Backer */}
              <button
                type="button"
                onClick={() => setSelectedRole("donor")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  selectedRole === "donor"
                    ? "border-[#4CAF39] bg-green-50/50 shadow-sm ring-1 ring-[#4CAF39]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 text-[#4CAF39] flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">I'm a Donor / Backer</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Support students and funds directly through micro-donations.
                  </p>
                </div>
              </button>

              {/* Option 4: Organization */}
              <button
                type="button"
                onClick={() => setSelectedRole("organization")}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                  selectedRole === "organization"
                    ? "border-[#1A6FD4] bg-blue-50/50 shadow-sm ring-1 ring-[#1A6FD4]/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">I'm an Organization</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Create and fund micro-scholarship programs as a foundation.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
              <Link href="/login" className="text-xs sm:text-sm text-slate-500 hover:text-slate-800">
                Already have an account? <span className="font-bold text-[#1A6FD4]">Log In</span>
              </Link>
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl font-bold bg-[#1A6FD4] hover:bg-[#155ab0] text-white shadow-md shadow-blue-200 text-sm"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PART B: ACCOUNT CREATION
        ───────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleAccountCreation} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#1A6FD4] uppercase tracking-wider">
                {selectedRole === "student" && "Student Account"}
                {selectedRole === "parent" && "Parent Account"}
                {selectedRole === "donor" && "Donor & Backer Account"}
                {selectedRole === "organization" && "Organization Account"}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Create Your Dormoney Account
              </h2>
            </div>

            {/* Student & Parent Fields */}
            {(selectedRole === "student" || selectedRole === "parent") && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Last Name</Label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-10 sm:h-11 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 chars, 1 number"
                        required
                        minLength={8}
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Mobile Number (Optional)</Label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>

                <div className="space-y-2 pt-1">
                  {/* SMS Opt-in Checkbox */}
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={smsOptIn}
                      onChange={(e) => setSmsOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-[#1A6FD4] focus:ring-[#1A6FD4]"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      Yes, send me scholarship deadline reminders and updates via text.
                    </span>
                  </label>

                  {/* Required TOS Checkbox */}
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 rounded text-[#1A6FD4] focus:ring-[#1A6FD4]"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I agree to the <Link href="/terms" className="text-[#1A6FD4] font-semibold underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#1A6FD4] font-semibold underline">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Donor Fields */}
            {selectedRole === "donor" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm font-semibold text-slate-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane Donor"
                      required
                      className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Organization Fields */}
            {selectedRole === "organization" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Organization Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Future Leaders Foundation"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Contact Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Work Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@organization.org"
                        required
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        className="pl-10 h-10 sm:h-11 rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="h-11 px-6 rounded-xl border-slate-200 text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 sm:h-12 px-7 sm:px-8 rounded-xl font-bold bg-[#1A6FD4] hover:bg-[#155ab0] text-white shadow-lg shadow-blue-200 text-sm sm:text-base"
              >
                {loading ? "Creating Account..." : "Continue to Campaign"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* ─────────────────────────────────────────────────────────────
            PART C: EMBEDDED CAMPAIGN CREATION (MANDATORY)
        ───────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleCampaignCreation} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#4CAF39] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Micro-Scholarship Step (Mandatory)
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {selectedRole === "student" && "Create Your Micro-Scholarship Campaign"}
                {selectedRole === "parent" && "Create a Campaign for Your Child"}
                {selectedRole === "organization" && "Create Your Scholarship Fund"}
                {selectedRole === "donor" && "Tell Us Who You Want to Support"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {selectedRole === "donor"
                  ? "Select giving areas you are passionate about to match with eligible student campaigns."
                  : "Launch your micro-scholarship immediately. Backers and donors can contribute to your goal."}
              </p>
            </div>

            {/* Donor Giving Interests Multi-Select (for Donors) */}
            {selectedRole === "donor" && (
              <div className="space-y-2.5 p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs sm:text-sm font-bold text-slate-800">
                    Target Giving Interests (Click to toggle)
                  </Label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedInterests.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DONOR_GIVING_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`py-2 px-3 rounded-lg border text-center font-bold text-xs sm:text-sm transition-all ${
                          isSelected
                            ? "border-[#4CAF39] bg-green-100/70 text-[#2e7d32] shadow-xs ring-1 ring-[#4CAF39]"
                            : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Campaign Fields (All Roles: Student, Parent, Organization, and Donor) */}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm font-semibold text-slate-700">
                {selectedRole === "donor" ? "Giving Fund / Campaign Title" : "Campaign Title"}
              </Label>
              <Input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder={
                  selectedRole === "donor"
                    ? "e.g. My STEM & First-Gen Student Giving Fund"
                    : "e.g. Help Me Cover My First Year Tuition & Books"
                }
                required
                className="h-10 sm:h-11 text-sm rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm font-semibold text-slate-700">
                {selectedRole === "donor" ? "Giving Mission & Story" : "Campaign Story"}
              </Label>
              <textarea
                rows={3}
                value={campaignStory}
                onChange={(e) => setCampaignStory(e.target.value)}
                placeholder={
                  selectedRole === "donor"
                    ? "Share who you want to support and what inspires your contributions..."
                    : "Share your goals, academic journey, and what this micro-scholarship fund supports..."
                }
                required
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6FD4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">
                  {selectedRole === "donor" ? "Pledge / Contribution Goal ($ USD)" : "Goal Amount ($ USD)"}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="number"
                    min="10"
                    step="10"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder={selectedRole === "donor" ? "1000" : "2500"}
                    required
                    className="pl-10 h-10 sm:h-11 text-sm rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm font-semibold text-slate-700">
                  {selectedRole === "donor" ? "Giving Frequency" : "Donation Frequency"}
                </Label>
                <select
                  value={donationFrequency}
                  onChange={(e) => setDonationFrequency(e.target.value as any)}
                  className="w-full h-10 sm:h-11 rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6FD4]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 sm:h-12 px-7 sm:px-8 rounded-xl font-bold bg-[#4CAF39] hover:bg-[#439c32] text-white shadow-lg shadow-green-200 text-sm sm:text-base"
              >
                {loading ? "Publishing Campaign..." : "Launch Campaign & Go to Dashboard"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* ─────────────────────────────────────────────────────────────
            CONFIRMATION SCREEN
        ───────────────────────────────────────────────────────────── */}
        {step === 4 && (
          <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-green-100 text-[#4CAF39] mx-auto flex items-center justify-center shadow-md shadow-green-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                You're all set. Your campaign is live.
              </h2>
              <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm">
                {selectedRole === "donor"
                  ? "Your giving interests have been saved. You can now discover and support active student micro-scholarships."
                  : "Your micro-scholarship is published. Donors and community backers can now discover and contribute to your goal."}
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="h-10 px-8 rounded-xl font-bold bg-[#1A6FD4] hover:bg-[#155ab0] text-white shadow-lg shadow-blue-200 text-sm"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
