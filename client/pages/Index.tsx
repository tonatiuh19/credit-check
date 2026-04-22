import { useEffect, useState } from "react";
import {
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Lock,
  BarChart3,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AnimatedCounter = ({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(progress * end));
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return <span>{count}</span>;
};

const ScoreGauge = ({ score }: { score: number }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 850) * circumference;

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center animate-fade-in mx-auto">
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 200 200"
        style={{
          animation: "fillGauge 2.5s ease-out forwards",
        }}
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Animated progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 2.5s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-space-mono font-bold text-primary">
          <AnimatedCounter end={score} duration={2.5} />
        </div>
        <div className="text-sm text-muted-foreground mt-2 font-inter">
          Credit Score
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                IQ
              </span>
            </div>
            <span className="text-xl font-dm-serif text-foreground">
              CreditIQ
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Pricing
            </a>
          </div>
          <Link
            to="/dashboard"
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0s" }}
          >
            <h1 className="text-5xl sm:text-6xl font-dm-serif font-normal text-foreground leading-tight">
              Know Your Credit.{" "}
              <span className="text-primary">Own Your Future.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-inter max-w-lg">
              Get instant access to your credit scores from all 3 bureaus,
              personalized insights, and a roadmap to financial excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/onboarding"
                className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition text-center"
              >
                Get Started Now
              </Link>
              <button className="px-8 py-4 rounded-lg border border-border text-foreground font-inter font-semibold hover:bg-muted transition">
                Learn More
              </button>
            </div>
          </div>

          <div
            className="flex justify-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <ScoreGauge score={742} />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                256-bit encryption
              </div>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                FCRA Compliant
              </div>
            </div>
            <div>
              <BarChart3 className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                3-Bureau Coverage
              </div>
            </div>
            <div>
              <Users className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                2M+ Users
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Powerful Tools for Your Credit
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              Everything you need to understand and improve your credit profile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "3-Bureau Scores",
                description:
                  "Real-time access to Equifax, Experian, and TransUnion scores",
                delay: "0s",
              },
              {
                icon: TrendingUp,
                title: "Real-time Monitoring",
                description:
                  "Get instant alerts when your credit profile changes",
                delay: "0.1s",
              },
              {
                icon: Zap,
                title: "AI Credit Advisor",
                description:
                  "Personalized recommendations powered by Claude AI",
                delay: "0.2s",
              },
              {
                icon: CheckCircle,
                title: "Personalized Offers",
                description: "Cards and loans matched to your credit profile",
                delay: "0.3s",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Get Started in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up with email and password in seconds",
                delay: "0s",
              },
              {
                step: "2",
                title: "Verify Identity",
                description: "Complete our secure identity verification",
                delay: "0.1s",
              },
              {
                step: "3",
                title: "See Your Scores",
                description:
                  "Instantly access all 3 bureau scores and insights",
                delay: "0.2s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: item.delay }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-space-mono font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-dm-serif font-normal text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-inter">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Trusted by 2M+ Users
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Improved score by 47 points",
                quote:
                  "CreditIQ gave me the clarity I needed. The AI advisor was game-changing.",
                delay: "0s",
              },
              {
                name: "Michael Chen",
                role: "Got approved for premium card",
                quote:
                  "Real-time monitoring caught an error on my report within hours.",
                delay: "0.1s",
              },
              {
                name: "Emma Rodriguez",
                role: "Paid off $12K in debt",
                quote:
                  "The personalized insights helped me create a realistic plan.",
                delay: "0.2s",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-card border border-border animate-fade-in"
                style={{ animationDelay: testimonial.delay }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground font-inter mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground font-inter">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-inter">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Score Ranges */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Understand Your Score
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              Credit scores tell your financial story. Here's what yours means.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              {
                range: "300-579",
                label: "Poor",
                color: "from-destructive",
                description:
                  "Significant financial challenges. High borrowing costs.",
                delay: "0s",
              },
              {
                range: "580-669",
                label: "Fair",
                color: "from-destructive/70",
                description: "Some challenges. Better rates with effort.",
                delay: "0.1s",
              },
              {
                range: "670-739",
                label: "Good",
                color: "from-primary",
                description: "Solid credit. Qualified for better offers.",
                delay: "0.2s",
              },
              {
                range: "740-799",
                label: "Very Good",
                color: "from-primary/70",
                description: "Strong credit. Premium rates available.",
                delay: "0.3s",
              },
              {
                range: "800-850",
                label: "Excellent",
                color: "from-accent",
                description: "Exceptional credit. Best available rates.",
                delay: "0.4s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: item.delay }}
              >
                <div
                  className={`bg-gradient-to-b ${item.color} to-transparent rounded-lg p-6 h-full border border-border hover:border-primary/50 transition`}
                >
                  <div className="text-2xl font-space-mono font-bold text-foreground mb-2">
                    {item.range}
                  </div>
                  <h3 className="text-lg font-dm-serif font-normal text-foreground mb-3">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground font-inter">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Real Impact, Real Results
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              See how our users have transformed their credit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                stat: "47 pts",
                description: "Average score improvement",
                subtext: "In first 6 months",
                delay: "0s",
              },
              {
                stat: "$2.8K",
                description: "Average interest savings",
                subtext: "On new credit card",
                delay: "0.1s",
              },
              {
                stat: "89%",
                description: "Approval rate increase",
                subtext: "After using CreditIQ",
                delay: "0.2s",
              },
              {
                stat: "12 wks",
                description: "Average time to goal score",
                subtext: "With our guidance",
                delay: "0.3s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-card border border-border text-center hover:border-primary/50 transition animate-fade-in"
                style={{ animationDelay: item.delay }}
              >
                <div className="text-5xl font-space-mono font-bold text-primary mb-3">
                  {item.stat}
                </div>
                <h3 className="font-semibold text-foreground font-inter mb-2">
                  {item.description}
                </h3>
                <p className="text-sm text-muted-foreground font-inter">
                  {item.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Common Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is checking my credit score free?",
                a: "Yes, completely free. You can check your score as many times as you want without any impact or cost.",
                delay: "0s",
              },
              {
                q: "Will checking my score hurt my credit?",
                a: "No. Checking your own score is a soft inquiry and doesn't affect your credit. Only hard inquiries (lender checks) impact your score.",
                delay: "0.1s",
              },
              {
                q: "How often should I check my score?",
                a: "We recommend checking monthly to track progress and catch errors. Our monitoring alerts you to significant changes automatically.",
                delay: "0.2s",
              },
              {
                q: "What's the difference between Equifax, Experian, and TransUnion?",
                a: "These are the three major credit bureaus that collect and maintain credit information. They may have slightly different scores based on their data.",
                delay: "0.3s",
              },
              {
                q: "Can I improve my score quickly?",
                a: "It depends on your situation. Paying down balances and disputing errors can help. Most improvements take 1-3 months to show.",
                delay: "0.4s",
              },
              {
                q: "Is my data safe with CreditIQ?",
                a: "Absolutely. We use 256-bit encryption, comply with FCRA regulations, and never sell your data to third parties.",
                delay: "0.5s",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition animate-fade-in"
                style={{ animationDelay: item.delay }}
              >
                <h3 className="text-lg font-dm-serif font-normal text-foreground mb-3">
                  {item.q}
                </h3>
                <p className="text-muted-foreground font-inter">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CreditIQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              Why Choose CreditIQ
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              The premium alternative to generic credit tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Feature comparison */}
            <div
              className="space-y-3 sm:space-y-4 animate-fade-in overflow-x-auto"
              style={{ animationDelay: "0s" }}
            >
              <h3 className="text-2xl font-dm-serif font-normal text-foreground mb-6">
                CreditIQ vs. The Rest
              </h3>

              {[
                {
                  feature: "3-Bureau Scores",
                  creditiq: true,
                  others: false,
                },
                {
                  feature: "AI Credit Advisor",
                  creditiq: true,
                  others: false,
                },
                {
                  feature: "Real-time Alerts",
                  creditiq: true,
                  others: false,
                },
                {
                  feature: "Personalized Offers",
                  creditiq: true,
                  others: true,
                },
                {
                  feature: "Credit Monitoring",
                  creditiq: true,
                  others: true,
                },
                {
                  feature: "Score Tracking",
                  creditiq: true,
                  others: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-card border border-border text-sm sm:text-base"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="font-inter text-foreground flex-shrink">
                    {item.feature}
                  </span>
                  <div className="flex gap-4 sm:gap-8 flex-shrink-0">
                    <div className="text-center w-16 sm:w-20">
                      {item.creditiq ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto" />
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-muted-foreground mx-auto" />
                      )}
                    </div>
                    <div className="text-center w-16 sm:w-20">
                      {item.others ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground mx-auto" />
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-muted-foreground mx-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-6 sm:gap-12 mt-8 pt-6 border-t border-border">
                <div>
                  <h4 className="font-semibold text-foreground font-inter mb-1 text-sm sm:text-base">
                    CreditIQ
                  </h4>
                  <p className="text-xs text-muted-foreground font-inter">
                    Premium
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground font-inter mb-1 text-sm sm:text-base">
                    Others
                  </h4>
                  <p className="text-xs text-muted-foreground font-inter">
                    Standard
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Key advantages */}
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: "Instant Access",
                  description:
                    "Get all 3 credit scores within minutes of signup. No waiting, no hassle.",
                  delay: "0.1s",
                },
                {
                  icon: Shield,
                  title: "Bank-Grade Security",
                  description:
                    "Your data is protected with 256-bit encryption and FCRA compliance.",
                  delay: "0.2s",
                },
                {
                  icon: TrendingUp,
                  title: "Personalized Guidance",
                  description:
                    "Our AI advisor gives you specific, actionable steps for your situation.",
                  delay: "0.3s",
                },
                {
                  icon: CheckCircle,
                  title: "Proven Results",
                  description:
                    "Average 47-point improvement in 6 months with our guidance.",
                  delay: "0.4s",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition animate-fade-in"
                    style={{ animationDelay: item.delay }}
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-dm-serif font-normal text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-inter">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground mb-4">
              One Plan, Complete Features
            </h2>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              No surprises. All premium features included. Join now at
              $9.99/month.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-16 animate-fade-in px-4">
            <div className="inline-flex items-center gap-2 bg-muted rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition w-full sm:w-auto ${
                  !isAnnual
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition w-full sm:w-auto ${
                  isAnnual
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
              </button>
            </div>
            {isAnnual && (
              <span className="text-sm font-inter text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>

          {/* Single Pricing Card */}
          <div className="max-w-2xl mx-auto">
            <div
              className="relative p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-background border border-primary/30 animate-fade-in"
              style={{ animationDelay: "0s" }}
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-6 py-2 rounded-full">
                  PREMIUM PLAN
                </span>
              </div>

              <div className="text-center mb-10">
                <h3 className="text-4xl font-dm-serif font-normal text-foreground mb-3">
                  CreditIQ Pro
                </h3>
                <p className="text-lg text-muted-foreground font-inter">
                  Everything you need to master your credit
                </p>
              </div>

              {/* Pricing Display */}
              <div className="bg-background rounded-xl p-6 sm:p-8 mb-8 border border-border">
                <div className="flex items-baseline justify-center gap-2 mb-4 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-space-mono font-bold text-primary">
                    {isAnnual ? "$95.88" : "$9.99"}
                  </span>
                  <span className="text-lg text-muted-foreground font-inter">
                    {isAnnual ? "/year" : "/month"}
                  </span>
                </div>
                <p className="text-center text-sm text-muted-foreground font-inter">
                  {isAnnual
                    ? "Billed annually (save 20%)"
                    : "Billed monthly, cancel anytime"}
                </p>
              </div>

              <button className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-inter font-semibold hover:opacity-90 transition mb-8 text-lg">
                Get Started
              </button>

              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-foreground font-inter mb-4">
                  Complete Feature Set:
                </h4>
                {[
                  "All 3 Credit Scores (Equifax, Experian, TransUnion)",
                  "Real-time Credit Alerts",
                  "AI Credit Advisor Powered by Claude",
                  "Monthly Credit Reports & Analysis",
                  "Credit Score Tracking & History",
                  "Personalized Improvement Recommendations",
                  "Credit Factor Breakdown & Insights",
                  "Dispute Management Tools",
                  "Priority Email Support",
                  "Advanced Analytics & Trends",
                  "Personalized Credit Offers",
                  "Identity Monitoring",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground font-inter"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-space-mono font-bold text-primary mb-1">
                      0
                    </p>
                    <p className="text-xs text-muted-foreground font-inter">
                      Credit Card Required
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-space-mono font-bold text-accent mb-1">
                      ∞
                    </p>
                    <p className="text-xs text-muted-foreground font-inter">
                      Cancel Anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Comparison Callout */}
          <div className="mt-16 p-8 rounded-xl bg-background border border-border max-w-4xl mx-auto animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-space-mono font-bold text-primary mb-2">
                  0
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  Credit Card Required
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-accent mb-2">
                  ✓
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  Instant Access
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-primary mb-2">
                  24/7
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  Support Available
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-accent mb-2">
                  ∞
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  Cancel Anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/20 to-accent/20 border-y border-primary/20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl font-dm-serif font-normal text-foreground mb-4">
            Your credit score is waiting
          </h2>
          <p className="text-lg text-muted-foreground font-inter mb-8">
            Join millions who've taken control of their financial future
          </p>
          <Link
            to="/onboarding"
            className="inline-block px-8 py-4 rounded-lg bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    IQ
                  </span>
                </div>
                <span className="text-lg font-dm-serif text-foreground">
                  CreditIQ
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-inter">
                Premium credit intelligence for your financial future.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Credit Advisor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Monitoring
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground font-inter mb-4">
              CreditIQ is not a credit repair service and cannot remove accurate
              negative information from your credit report. CreditIQ services
              are subject to the Fair Credit Reporting Act (FCRA) and other
              applicable laws. See our{" "}
              <a href="#" className="text-primary hover:underline">
                FCRA disclosure
              </a>{" "}
              for more information.
            </p>
            <p className="text-xs text-muted-foreground font-inter">
              © {new Date().getFullYear()} CreditIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
