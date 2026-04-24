import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import PageHead from "@/components/PageHead";
import { useAuth } from "@clerk/clerk-react";
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

const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
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
          {label}
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useAuth();

  const features = [
    {
      icon: Shield,
      title: t("landing.features.bureaus.title"),
      description: t("landing.features.bureaus.description"),
      delay: "0s",
    },
    {
      icon: TrendingUp,
      title: t("landing.features.monitoring.title"),
      description: t("landing.features.monitoring.description"),
      delay: "0.1s",
    },
    {
      icon: Zap,
      title: t("landing.features.advisor.title"),
      description: t("landing.features.advisor.description"),
      delay: "0.2s",
    },
    {
      icon: CheckCircle,
      title: t("landing.features.offers.title"),
      description: t("landing.features.offers.description"),
      delay: "0.3s",
    },
  ];

  const hiwSteps = [
    {
      step: "1",
      title: t("landing.hiw.s1.title"),
      description: t("landing.hiw.s1.description"),
      delay: "0s",
    },
    {
      step: "2",
      title: t("landing.hiw.s2.title"),
      description: t("landing.hiw.s2.description"),
      delay: "0.1s",
    },
    {
      step: "3",
      title: t("landing.hiw.s3.title"),
      description: t("landing.hiw.s3.description"),
      delay: "0.2s",
    },
  ];

  const testimonials = [
    {
      name: t("landing.testimonials.t1.name"),
      role: t("landing.testimonials.t1.role"),
      quote: t("landing.testimonials.t1.quote"),
      delay: "0s",
    },
    {
      name: t("landing.testimonials.t2.name"),
      role: t("landing.testimonials.t2.role"),
      quote: t("landing.testimonials.t2.quote"),
      delay: "0.1s",
    },
    {
      name: t("landing.testimonials.t3.name"),
      role: t("landing.testimonials.t3.role"),
      quote: t("landing.testimonials.t3.quote"),
      delay: "0.2s",
    },
  ];

  const scoreRanges = [
    {
      range: "300–579",
      label: t("landing.ranges.poor.label"),
      color: "from-destructive",
      description: t("landing.ranges.poor.description"),
      delay: "0s",
    },
    {
      range: "580–669",
      label: t("landing.ranges.fair.label"),
      color: "from-destructive/70",
      description: t("landing.ranges.fair.description"),
      delay: "0.1s",
    },
    {
      range: "670–739",
      label: t("landing.ranges.good.label"),
      color: "from-primary",
      description: t("landing.ranges.good.description"),
      delay: "0.2s",
    },
    {
      range: "740–799",
      label: t("landing.ranges.very_good.label"),
      color: "from-primary/70",
      description: t("landing.ranges.very_good.description"),
      delay: "0.3s",
    },
    {
      range: "800–850",
      label: t("landing.ranges.excellent.label"),
      color: "from-accent",
      description: t("landing.ranges.excellent.description"),
      delay: "0.4s",
    },
  ];

  const impactStats = [
    {
      stat: t("landing.impact.i1.stat"),
      description: t("landing.impact.i1.description"),
      subtext: t("landing.impact.i1.subtext"),
      delay: "0s",
    },
    {
      stat: t("landing.impact.i2.stat"),
      description: t("landing.impact.i2.description"),
      subtext: t("landing.impact.i2.subtext"),
      delay: "0.1s",
    },
    {
      stat: t("landing.impact.i3.stat"),
      description: t("landing.impact.i3.description"),
      subtext: t("landing.impact.i3.subtext"),
      delay: "0.2s",
    },
    {
      stat: t("landing.impact.i4.stat"),
      description: t("landing.impact.i4.description"),
      subtext: t("landing.impact.i4.subtext"),
      delay: "0.3s",
    },
  ];

  const faqItems = [
    { q: t("landing.faq.q1.q"), a: t("landing.faq.q1.a"), delay: "0s" },
    { q: t("landing.faq.q2.q"), a: t("landing.faq.q2.a"), delay: "0.1s" },
    { q: t("landing.faq.q3.q"), a: t("landing.faq.q3.a"), delay: "0.2s" },
    { q: t("landing.faq.q4.q"), a: t("landing.faq.q4.a"), delay: "0.3s" },
    { q: t("landing.faq.q5.q"), a: t("landing.faq.q5.a"), delay: "0.4s" },
    { q: t("landing.faq.q6.q"), a: t("landing.faq.q6.a"), delay: "0.5s" },
  ];

  const comparisonFeatures = [
    { feature: t("landing.why.feat.bureaus"), creditiq: true, others: false },
    { feature: t("landing.why.feat.ai"), creditiq: true, others: false },
    { feature: t("landing.why.feat.alerts"), creditiq: true, others: false },
    { feature: t("landing.why.feat.offers"), creditiq: true, others: true },
    { feature: t("landing.why.feat.monitoring"), creditiq: true, others: true },
    { feature: t("landing.why.feat.tracking"), creditiq: true, others: true },
  ];

  const advantages = [
    {
      icon: Zap,
      title: t("landing.why.adv.instant.title"),
      description: t("landing.why.adv.instant.description"),
      delay: "0.1s",
    },
    {
      icon: Shield,
      title: t("landing.why.adv.security.title"),
      description: t("landing.why.adv.security.description"),
      delay: "0.2s",
    },
    {
      icon: TrendingUp,
      title: t("landing.why.adv.guidance.title"),
      description: t("landing.why.adv.guidance.description"),
      delay: "0.3s",
    },
    {
      icon: CheckCircle,
      title: t("landing.why.adv.results.title"),
      description: t("landing.why.adv.results.description"),
      delay: "0.4s",
    },
  ];

  const pricingFeatures = [
    t("landing.pricing.f1"),
    t("landing.pricing.f2"),
    t("landing.pricing.f3"),
    t("landing.pricing.f4"),
    t("landing.pricing.f5"),
    t("landing.pricing.f6"),
    t("landing.pricing.f7"),
    t("landing.pricing.f8"),
    t("landing.pricing.f9"),
    t("landing.pricing.f10"),
    t("landing.pricing.f11"),
    t("landing.pricing.f12"),
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PageHead
        title={t("seo.home_title", "Build Your Perfect Credit Score")}
        description={t(
          "seo.home_description",
          "Monitor all 3 bureau credit scores in real time, get AI-powered insights, and build your path to financial freedom with MyCreditFICO.",
        )}
        canonical="https://creditiq.app"
      />
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
              {t("nav.brand")}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t("landing.nav.features")}
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t("landing.nav.how_it_works")}
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t("landing.nav.testimonials")}
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {t("landing.nav.pricing")}
            </a>
          </div>
          {isLoaded &&
            (isSignedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                {t("landing.nav.dashboard", "Dashboard")}
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                {t("landing.nav.signin")}
              </Link>
            ))}
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
              {t("landing.hero.title1")}{" "}
              <span className="text-primary">{t("landing.hero.title2")}</span>
            </h1>
            <p className="text-lg text-muted-foreground font-inter max-w-lg">
              {t("landing.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/onboarding"
                className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition text-center"
              >
                {t("landing.hero.cta_primary")}
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
            <ScoreGauge score={742} label={t("landing.score_label")} />
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
                {t("landing.trust.encryption")}
              </div>
            </div>
            <div>
              <CheckCircle className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                {t("landing.trust.fcra")}
              </div>
            </div>
            <div>
              <BarChart3 className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                {t("landing.trust.bureaus")}
              </div>
            </div>
            <div>
              <Users className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="text-sm text-muted-foreground font-inter">
                {t("landing.trust.users")}
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
              {t("landing.features.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
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
              {t("landing.hiw.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hiwSteps.map((item, index) => (
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
              {t("landing.testimonials.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
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
              {t("landing.ranges.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              {t("landing.ranges.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {scoreRanges.map((item, index) => (
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
              {t("landing.impact.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              {t("landing.impact.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {impactStats.map((item, index) => (
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
              {t("landing.faq.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter">
              {t("landing.faq.subtitle")}
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
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

      {/* Why MyCreditFICO Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-dm-serif font-normal text-foreground">
              {t("landing.why.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              {t("landing.why.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Feature comparison */}
            <div
              className="space-y-3 sm:space-y-4 animate-fade-in overflow-x-auto"
              style={{ animationDelay: "0s" }}
            >
              <h3 className="text-2xl font-dm-serif font-normal text-foreground mb-6">
                {t("landing.why.comparison_title")}
              </h3>

              {comparisonFeatures.map((item, index) => (
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
                    {t("landing.why.creditiq")}
                  </h4>
                  <p className="text-xs text-muted-foreground font-inter">
                    {t("landing.why.creditiq_sub")}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground font-inter mb-1 text-sm sm:text-base">
                    {t("landing.why.others")}
                  </h4>
                  <p className="text-xs text-muted-foreground font-inter">
                    {t("landing.why.others_sub")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Key advantages */}
            <div className="space-y-6">
              {advantages.map((item, index) => {
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
              {t("landing.pricing.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
              {t("landing.pricing.subtitle")}
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
                {t("landing.pricing.monthly")}
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition w-full sm:w-auto ${
                  isAnnual
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("landing.pricing.annual")}
              </button>
            </div>
            {isAnnual && (
              <span className="text-sm font-inter text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full">
                {t("landing.pricing.save")}
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
                  {t("landing.pricing.badge")}
                </span>
              </div>

              <div className="text-center mb-10">
                <h3 className="text-4xl font-dm-serif font-normal text-foreground mb-3">
                  {t("landing.pricing.plan_name")}
                </h3>
                <p className="text-lg text-muted-foreground font-inter">
                  {t("landing.pricing.plan_subtitle")}
                </p>
              </div>

              {/* Pricing Display */}
              <div className="bg-background rounded-xl p-6 sm:p-8 mb-8 border border-border">
                <div className="flex items-baseline justify-center gap-2 mb-4 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-space-mono font-bold text-primary">
                    {isAnnual ? "$95.88" : "$9.99"}
                  </span>
                  <span className="text-lg text-muted-foreground font-inter">
                    {isAnnual
                      ? t("landing.pricing.per_year")
                      : t("landing.pricing.per_month")}
                  </span>
                </div>
                <p className="text-center text-sm text-muted-foreground font-inter">
                  {isAnnual
                    ? t("landing.pricing.billing_annual")
                    : t("landing.pricing.billing_monthly")}
                </p>
              </div>

              <button className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-inter font-semibold hover:opacity-90 transition mb-8 text-lg">
                {t("landing.pricing.cta")}
              </button>

              <div className="space-y-3 mb-8">
                <h4 className="font-semibold text-foreground font-inter mb-4">
                  {t("landing.pricing.features_heading")}
                </h4>
                {pricingFeatures.map((feature, index) => (
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
                      {t("landing.pricing.no_cc")}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-space-mono font-bold text-accent mb-1">
                      ∞
                    </p>
                    <p className="text-xs text-muted-foreground font-inter">
                      {t("landing.pricing.cancel")}
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
                  {t("landing.pricing.no_cc")}
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-accent mb-2">
                  ✓
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  {t("landing.pricing.instant")}
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-primary mb-2">
                  24/7
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  {t("landing.pricing.support")}
                </p>
              </div>
              <div>
                <div className="text-3xl font-space-mono font-bold text-accent mb-2">
                  ∞
                </div>
                <p className="text-sm text-muted-foreground font-inter">
                  {t("landing.pricing.cancel")}
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
            {t("landing.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground font-inter mb-8">
            {t("landing.cta.subtitle")}
          </p>
          <Link
            to="/onboarding"
            className="inline-block px-8 py-4 rounded-lg bg-primary text-primary-foreground font-inter font-semibold hover:opacity-90 transition"
          >
            {t("landing.cta.button")}
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
                  {t("nav.brand")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-inter">
                {t("landing.footer.tagline")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                {t("landing.footer.product")}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.dashboard")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.advisor")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.monitoring")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                {t("landing.footer.company")}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.blog")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground font-inter mb-4">
                {t("landing.footer.legal")}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.privacy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.terms")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    {t("landing.footer.security")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <p className="text-xs text-muted-foreground font-inter">
                {t("landing.footer.legal_text")}{" "}
                <a href="#" className="text-primary hover:underline">
                  {t("landing.footer.fcra_link")}
                </a>{" "}
                {t("landing.footer.legal_suffix")}
              </p>
              {/* Language switcher */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {(["en", "es-MX", "fr"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`px-3 py-1 rounded text-xs font-inter font-medium transition-colors ${
                      i18n.language === lang
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {lang === "en" ? "EN" : lang === "es-MX" ? "ES" : "FR"}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-inter">
              {t("landing.footer.copyright", {
                year: new Date().getFullYear(),
              })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
