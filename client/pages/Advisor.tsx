import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, Brain, Zap } from "lucide-react";
import PageHead from "@/components/PageHead";

export default function Advisor() {
  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title="AI Credit Advisor"
        description="Chat with your AI Credit Advisor — get personalized strategies to boost your credit score fast."
        robots="noindex,nofollow"
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                IQ
              </span>
            </div>
            <span className="text-xl font-dm-serif text-foreground">
              MyCreditFICO
            </span>
          </Link>
          <button className="px-6 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-inter text-primary font-semibold">
                Powered by Claude AI
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-dm-serif font-normal text-foreground mb-6 leading-tight">
              Your Personal{" "}
              <span className="text-primary">Financial Coach</span>
            </h1>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto mb-8">
              Get personalized credit advice from our AI advisor. Ask anything
              about improving your credit, and get actionable insights tailored
              to your situation.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Brain className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                Intelligent Context
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                Our AI understands your full credit profile and financial goals
              </p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <MessageSquare className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                Natural Conversation
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                Ask questions in plain English, get clear, actionable answers
              </p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Zap className="w-10 h-10 text-destructive mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                Instant Answers
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                Get real-time responses to your credit and financial questions
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-12 text-center animate-fade-in">
            <h2 className="text-3xl font-dm-serif font-normal text-foreground mb-4">
              AI Advisor Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 max-w-2xl mx-auto">
              Our Claude-powered advisor is being trained on financial best
              practices. It will help you understand your credit, create
              improvement strategies, and answer complex questions about your
              financial profile.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  Example Questions
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>→ How do I improve fast?</li>
                  <li>→ Is my utilization too high?</li>
                  <li>→ When should I apply?</li>
                  <li>→ What's a good score?</li>
                </ul>
              </div>

              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  You'll Get
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>✓ Personalized guidance</li>
                  <li>✓ Data-backed advice</li>
                  <li>✓ Action steps</li>
                  <li>✓ 24/7 availability</li>
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
