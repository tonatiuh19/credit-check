/**
 * Shared API types between client and server — MyCreditFICO Platform
 */

// --- Auth ---
export interface SyncUserRequest {
  email: string;
  name: string;
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  identityType: "SSN" | "ITIN" | null;
  subscriptionStatus:
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled";
  locale: "en" | "es-MX" | "fr";
}

// --- Onboarding ---
export interface PersonalInfoRequest {
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  ssnOrItin: string;
}

export interface IdentityTypeRequest {
  identityType: "SSN" | "ITIN";
}

export interface ConsentRequest {
  consentType: string;
  agreed: boolean;
}

// --- Credit ---
export interface BureauScoreDTO {
  bureau: "Experian" | "TransUnion" | "Equifax";
  score: number;
  lastUpdated: string;
}

export interface ScoreFactorDTO {
  factor: string;
  impact: number;
  description: string;
}

export interface CreditReportDTO {
  score: number;
  startingScore: number;
  grade: string;
  bureauScores: BureauScoreDTO[];
  scoreFactors: ScoreFactorDTO[];
  lastPullDate: string;
  provider: "ARRAY" | "MYFICO";
}

export interface PullUsageDTO {
  pullsUsed: number;
  maxPulls: number;
  month: string;
}

export interface ScoreHistoryPoint {
  date: string;
  score: number;
}

// --- Billing ---
export interface CheckoutSessionResponse {
  url: string;
}

export interface EmbeddedCheckoutResponse {
  clientSecret: string;
}

export interface BillingPortalResponse {
  url: string;
}

export interface BillingStatusDTO {
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled";
  subscriptionId: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  cancelAt: string | null;
}

export interface SubscribeResponse {
  success?: boolean;
  subscriptionId?: string;
  status?: string;
  requiresAction?: boolean;
  clientSecret?: string;
}

// --- Generic ---
export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}
