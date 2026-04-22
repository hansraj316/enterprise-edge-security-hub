export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
]);

export type LeadPayload = {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  companySize: string;
  monthlyTrafficGb: number;
  annualSecuritySpendInr: number;
  estimatedIncidentsPerMonth: number;
  estimatedAnnualSavingsInr: number;
  estimatedRoiPercent: number;
  assessmentFocus: string;
  timeline: string;
  notes?: string;
  sourcePage: string;
  referral?: string;
  website?: string;
  startedAt?: string;
};

export function isWorkEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return false;
  const domain = normalized.split("@")[1] ?? "";
  return !FREE_EMAIL_DOMAINS.has(domain);
}
