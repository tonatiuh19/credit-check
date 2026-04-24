import "./global.css";
import "./i18n";

import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { initAxiosAuth } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { syncUser, clearUser } from "@/store/slices/authSlice";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Advisor from "./pages/Advisor";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY = (import.meta.env.CLERK_PUBLISHABLE_KEY ||
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) as string;

/** Wires up the Clerk token interceptor and syncs user to DB on sign-in. */
function AuthSync() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    initAxiosAuth(() => getToken());
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && clerkUser) {
      dispatch(
        syncUser({
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          name:
            clerkUser.fullName ??
            `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        }),
      );
    } else if (!isSignedIn) {
      dispatch(clearUser());
    }
  }, [isSignedIn, isLoaded, clerkUser, dispatch]);

  return null;
}

/** Wraps a route so unauthenticated users are redirected to Clerk sign-in. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

const clerkAppearance = {
  layout: {
    logoPlacement: "inside" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    // Brand palette
    colorPrimary: "#4F46E5",
    colorBackground: "#0e1228",
    colorInputBackground: "#161c35",
    colorInputText: "#f1f5f9",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    colorDanger: "#F59E0B",
    colorSuccess: "#10B981",
    colorNeutral: "#1e2847",
    colorShimmer: "#4F46E5",
    // Shape
    borderRadius: "0.5rem",
    // Typography
    fontFamily: "Inter, sans-serif",
    fontFamilyButtons: "Inter, sans-serif",
    fontSize: "15px",
  },
  elements: {
    // Card / root
    card: "bg-[#111827] border border-[#1e2847] shadow-2xl shadow-black/50",
    rootBox: "w-full",
    // Header
    headerTitle: "text-white font-bold text-2xl",
    headerSubtitle: "text-slate-400",
    // Social buttons
    socialButtonsBlockButton:
      "border border-[#1e2847] bg-[#161c35] hover:bg-[#1e2847] text-white transition-colors",
    socialButtonsBlockButtonText: "text-white font-medium",
    socialButtonsBlockButtonArrow: "text-slate-400",
    // Divider
    dividerLine: "bg-[#1e2847]",
    dividerText: "text-slate-500",
    // Form fields
    formFieldLabel: "text-slate-300 text-sm font-medium",
    formFieldInput:
      "bg-[#161c35] border border-[#1e2847] text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/30 rounded-lg",
    formFieldInputShowPasswordButton: "text-slate-400 hover:text-white",
    // Primary button
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-900/40",
    // Footer / links
    footerActionText: "text-slate-400",
    footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
    footer: "bg-[#0e1228] border-t border-[#1e2847]",
    // Identifiers
    identityPreviewText: "text-slate-300",
    identityPreviewEditButton: "text-indigo-400 hover:text-indigo-300",
    // OTP / code input
    otpCodeFieldInput:
      "border border-[#1e2847] bg-[#161c35] text-white text-xl focus:border-indigo-500",
    // Internal nav (e.g. "Sign in" / "Sign up" tabs)
    navbarButton: "text-slate-400 hover:text-white",
    // Alert / error banner
    alertText: "text-amber-400",
    alert: "bg-amber-500/10 border border-amber-500/30",
    // "Secured by Clerk" badge
    internal: "opacity-60 hover:opacity-100 transition-opacity",
  },
};

const App = () => (
  <HelmetProvider>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/onboarding"
      appearance={clerkAppearance}
    >
      <Provider store={store}>
        <AuthSync />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advisor"
                  element={
                    <ProtectedRoute>
                      <Advisor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  </HelmetProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
