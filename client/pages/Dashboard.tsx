import { Link } from "react-router-dom";
import { TrendingUp, AlertCircle, Award } from "lucide-react";

export default function Dashboard() {
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
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-inter text-primary font-semibold">
                Real-time Insights
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-dm-serif font-normal text-foreground mb-6 leading-tight">
              Your Financial{" "}
              <span className="text-primary">Command Center</span>
            </h1>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto mb-8">
              Monitor your credit in real-time, track improvements, and discover
              opportunities tailored to your financial profile.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Award className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                3-Bureau Scores
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                Track Equifax, Experian, and TransUnion scores in one place
              </p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                See how your credit score changes month over month
              </p>
            </div>

            <div
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                Smart Alerts
              </h3>
              <p className="text-sm text-muted-foreground font-inter">
                Get notified of important changes to your credit file
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-12 text-center animate-fade-in">
            <h2 className="text-3xl font-dm-serif font-normal text-foreground mb-4">
              Dashboard Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground font-inter mb-8 max-w-2xl mx-auto">
              Your personalized credit dashboard is being crafted with precision.
              It will include score tracking, credit factor analysis, alerts, and
              personalized recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  What You'll See
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>✓ Average score & tier badge</li>
                  <li>✓ Month-over-month trends</li>
                  <li>✓ Credit factor breakdown</li>
                  <li>✓ Recent file activity</li>
                </ul>
              </div>

              <div className="text-left bg-card rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  What You'll Do
                </h3>
                <ul className="text-sm text-muted-foreground font-inter space-y-2">
                  <li>✓ Track score improvements</li>
                  <li>✓ Explore personalized offers</li>
                  <li>✓ Review recommendations</li>
                  <li>✓ Manage notifications</li>
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
