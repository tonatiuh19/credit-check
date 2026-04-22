import { Link } from "react-router-dom";
import {
  Mail,
  FileText,
  Shield,
  CheckCircle,
  Sparkles,
  Lock,
} from "lucide-react";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">IQ</span>
            </div>
            <span className="text-xl font-dm-serif text-foreground">
              CreditIQ
            </span>
          </Link>
          <Link
            to="/"
            className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Back
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Lock className="w-4 h-4 text-accent" />
              <span className="text-sm font-inter text-accent font-semibold">
                Bank-level security
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-dm-serif font-normal text-foreground mb-6 leading-tight">
              Get Your Credit{" "}
              <span className="text-primary">Score in 5 Minutes</span>
            </h1>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              Join millions of people taking control of their credit. Safe,
              secure, and completely free.
            </p>
          </div>

          {/* Step by Step */}
          <div className="mb-16">
            <h2 className="text-2xl font-dm-serif font-normal text-foreground mb-8 text-center">
              5 Simple Steps
            </h2>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Sign Up",
                  description: "Email and password",
                  icon: Mail,
                },
                {
                  step: 2,
                  title: "Personal Info",
                  description: "Name, DOB, address",
                  icon: FileText,
                },
                {
                  step: 3,
                  title: "Legal Consent",
                  description: "FCRA acknowledgment",
                  icon: Shield,
                },
                {
                  step: 4,
                  title: "Verify Identity",
                  description: "Secure verification",
                  icon: Lock,
                },
                {
                  step: 5,
                  title: "Score Reveal",
                  description: "See all 3 scores",
                  icon: Sparkles,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow text-left">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-dm-serif font-normal text-foreground">
                          {item.title}
                        </h3>
                        <span className="text-sm text-muted-foreground font-inter">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center justify-center text-primary">
                      <span className="text-sm font-space-mono font-bold">
                        {item.step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust & Security */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-xl p-12 text-center mb-12 animate-fade-in">
            <h2 className="text-2xl font-dm-serif font-normal text-foreground mb-6">
              Your Data is Secure
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <CheckCircle className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  256-bit Encryption
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  Military-grade security protects your data
                </p>
              </div>

              <div>
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  FCRA Compliant
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  We follow all federal credit regulations
                </p>
              </div>

              <div>
                <Lock className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  Privacy First
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  We never sell your data to third parties
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-12 text-center animate-fade-in">
            <h2 className="text-3xl font-dm-serif font-normal text-foreground mb-4">
              Onboarding Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 max-w-2xl mx-auto">
              We're building a seamless signup experience with smooth transitions,
              form validation, legal compliance, and identity verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  What to Expect
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>✓ Quick form entry</li>
                  <li>✓ Instant validation</li>
                  <li>✓ Secure submission</li>
                  <li>✓ Clear progress</li>
                </ul>
              </div>

              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  What You'll Need
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>✓ Email address</li>
                  <li>✓ Full name & DOB</li>
                  <li>✓ SSN (last 4)</li>
                  <li>✓ Address</li>
                </ul>
              </div>
            </div>

            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
