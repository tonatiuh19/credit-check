import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Dynamic imports via fetch to avoid tsconfig issues with root-level JSON
const resources = {
  en: {
    common: {
      nav: {
        brand: "MyCreditFICO",
        signin: "Sign In",
        signup: "Get Started",
        signout: "Sign Out",
        scores: {
          tracker: "ScoreTracker",
          builder: "ScoreBuilder",
          boost: "ScoreBoost",
        },
        reports: { smart: "Smart Credit Report", "3b": "3B Report & Scores" },
      },
      auth: {
        google: "Continue with Google",
        apple: "Continue with Apple",
        email: "Or sign in with your email",
        signup: "Create account",
        signin: "Sign in",
        email_label: "Email address",
        password_label: "Password",
        name_label: "Full name",
        forgot: "Forgot password?",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        or: "Or",
        page_signin_title: "Welcome back",
        page_signin_subtitle: "Sign in to access your full credit picture.",
        page_signup_title: "Take control of your credit",
        page_signup_subtitle:
          "Join over 250,000 people building better credit with MyCreditFICO.",
        feature_1: "Real-time 3-bureau monitoring",
        feature_2: "AI-powered score advisor",
        feature_3: "Identity theft protection",
        feature_4: "Personalized credit offers",
      },
      onboarding: {
        title: "Get Your Credit Score in 5 Minutes",
        subtitle:
          "Join millions taking control of their credit. Safe, secure, and fast.",
        steps: {
          account: "Create Account",
          personal: "Personal Info",
          identity: "Identity Type",
          consent: "Legal Consent",
          billing: "Start Trial",
        },
        identity_type: {
          title: "Select Your Identity Type",
          ssn: "SSN (Social Security Number)",
          ssn_desc: "For US citizens and permanent residents",
          itin: "ITIN (Individual Taxpayer Identification Number)",
          itin_desc: "For immigrants and non-citizens",
          itin_warning: "ITIN report costs $60 per pull",
        },
        consent: {
          title: "Legal Consent Required",
          fcra: "By continuing, you authorize the review of your credit history under the Fair Credit Reporting Act (FCRA).",
          agree: "I agree to the terms and authorize the credit pull",
        },
        personal: {
          firstname: "First name",
          lastname: "Last name",
          dob: "Date of birth",
          address: "Street address",
          city: "City",
          state: "State",
          zip: "ZIP code",
          ssn_itin: "SSN / ITIN",
        },
      },
      billing: {
        trial: "Start 7-day trial for $7",
        then: "Then $25/month",
        cancel: "Cancel anytime",
        monthly: "$25/month",
        trial_badge: "7-day trial",
        manage: "Manage Billing",
        portal: "Open Billing Portal",
        no_active_title: "No active subscription",
        no_active_desc:
          "Subscribe to unlock full 3-bureau credit monitoring, AI insights, and more.",
        start_trial: "Start $7 Trial",
        checkout_title: "Complete Your Subscription",
        checkout_subtitle: "Secure payment powered by Stripe",
        payment_success: "Subscription activated! Welcome to MyCreditFICO Pro.",
        card_number: "Card number",
        expiry: "Expiration",
        cvc: "Security code",
        cardholder: "Name on card",
        cardholder_placeholder: "Full name",
        pay_cta: "Pay $7 \u00b7 Start 7-Day Trial",
        card_error_generic: "Payment failed. Please check your card details.",
        redirecting: "Taking you to your dashboard\u2026",
        paywall_badge: "SUBSCRIPTION REQUIRED",
        paywall_greeting: "Welcome back,",
        paywall_headline: "Unlock Your Credit Intelligence",
        paywall_sub:
          "Real-time 3-bureau scores, AI-powered insights, and personalized credit offers — all in one dashboard.",
        paywall_preview_locked: "Your scores are locked",
        paywall_preview_sub: "Subscribe to see your live scores",
        paywall_trial_label: "7-Day Trial",
        paywall_trial_desc: "to unlock",
        paywall_then: "Then $25/month — cancel anytime",
        paywall_plan_sub: "Full access, cancel anytime",
        paywall_cta: "Start My Trial — $7",
        paywall_profile_link: "Manage your account & data in Profile",
        paywall_social: "Join 250,000+ members improving their credit",
        paywall_f1_title: "3-Bureau Scores",
        paywall_f1_desc: "Live Experian, TransUnion & Equifax scores",
        paywall_f2_title: "AI Credit Advisor",
        paywall_f2_desc: "Personalized action plan to boost your score",
        paywall_f3_title: "Score History",
        paywall_f3_desc: "Track your progress over time with charts",
        paywall_f4_title: "Smart Alerts",
        paywall_f4_desc: "Instant notifications on any credit change",
        paywall_f5_title: "Credit Offers",
        paywall_f5_desc: "Pre-qualified cards and loans matched to you",
        paywall_f6_title: "Identity Protection",
        paywall_f6_desc: "PrivacyMaster® monitors the dark web 24/7",
        perk_1: "Live 3-bureau credit scores",
        perk_2: "AI-powered score advisor",
        perk_3: "Real-time credit change alerts",
        perk_4: "Personalized credit offers & pre-approvals",
      },
      profile: {
        title: "My Profile",
        nav_link: "Profile",
        back_to_dashboard: "Back to Dashboard",
        personal: {
          title: "Personal Information",
          subtitle: "Your account details managed by Clerk",
          name: "Full Name",
          email: "Email Address",
          identity: "Identity Type",
        },
        billing: {
          title: "Subscription & Billing",
          subtitle: "Manage your MyCreditFICO Pro subscription",
          plan: "MyCreditFICO Pro",
          status: {
            active: "Active",
            trialing: "Trial",
            past_due: "Past Due",
            canceled: "Canceled",
            inactive: "Inactive",
          },
          renews_on: "Renews on {{date}}",
          cancels_on: "Cancels on {{date}}",
          cancels_at_end: "Cancels at period end",
          no_active: "No active subscription",
          after_trial: "after 7-day trial",
          update_payment: "Update Payment Method",
          cancel_btn: "Cancel Subscription",
          danger_zone: "Danger Zone",
          danger_desc:
            "Once canceled, access continues until the end of your billing period.",
        },
        cancel: {
          title: "Cancel Your Subscription",
          warning: "This action cannot be undone.",
          lose_access: "You will immediately lose access to:",
          consequences: {
            scores: "All 3-bureau credit score monitoring",
            monitoring: "Real-time credit change alerts",
            advisor: "AI Credit Advisor sessions",
            data: "Your data is retained for 30 days",
          },
          confirm_label: "Type {{phrase}} to confirm:",
          type_exact: "Please type the exact phrase above.",
          confirm_btn: "Cancel My Subscription",
          back_btn: "Go Back — Keep My Plan",
          success: "Your subscription has been canceled.",
          period_note: "You'll still have full access until {{date}}.",
        },
      },
      dashboard: {
        score: {
          title: "Your Credit Score",
          as_of: "As of {{date}}",
          starting: "Your starting score was {{score}}",
          gained: "You added +{{pts}} pts so far",
        },
        future_score: "Your Future Score",
        scorebuilder: {
          title: "ScoreBuilder®",
          potential: "+{{pts}} pts potential",
          cta: "Take Action Now",
        },
        scoreboost: {
          title: "ScoreBoost™",
          boost: "+{{pts}} pts with on-time payments",
          risk: "-{{pts}} pts risk from overspending",
          cta: "Start a Plan",
        },
        report: {
          title: "Smart Credit Report®",
          grade: "Your Current Grade",
          last_update: "Last Update",
        },
        "3b": {
          title: "3B Report & Scores",
          experian: "Experian",
          transunion: "TransUnion",
          equifax: "Equifax",
        },
        offers: {
          title: "myLONA® — Credit & Loan Offers",
          subtitle: "Compare offers without affecting your score",
          cta: "View All Offers",
        },
        privacy: {
          title: "PrivacyMaster®",
          label: "Your personal info:",
          found: "Found on {{n}} new websites",
          next_scan: "Next scan in 7 days",
        },
        pulls: {
          available: "Available pulls this month: {{n}}/{{max}}",
          limit_reached: "Monthly limit reached",
          refresh: "Refresh Credit Report",
        },
      },
      itin: {
        cost_warning: "ITIN report costs $60 per pull",
        confirm: "Confirm $60 ITIN Pull",
        confirm_desc:
          "This will trigger a credit pull with myFICO at a cost of $60. Do you want to continue?",
      },
      errors: {
        generic: "Something went wrong. Please try again.",
        unauthorized: "You must be signed in to access this page.",
        session_expired: "Your session has expired. Please sign in again.",
      },
      common: {
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        back: "Back",
        next: "Next",
        submit: "Submit",
        close: "Close",
        confirm: "Confirm",
      },
      landing: {
        score_label: "Credit Score",
        nav: {
          features: "Features",
          how_it_works: "How It Works",
          testimonials: "Testimonials",
          pricing: "Pricing",
          signin: "Sign In",
          dashboard: "Dashboard",
        },
        hero: {
          title1: "Know Your Credit.",
          title2: "Own Your Future.",
          description:
            "Get instant access to your credit scores from all 3 bureaus, personalized insights, and a roadmap to financial excellence.",
          cta_primary: "Get Started Now",
          cta_secondary: "Learn More",
        },
        trust: {
          encryption: "256-bit encryption",
          fcra: "FCRA Compliant",
          bureaus: "3-Bureau Coverage",
          users: "2M+ Users",
        },
        features: {
          title: "Powerful Tools for Your Credit",
          subtitle:
            "Everything you need to understand and improve your credit profile",
          bureaus: {
            title: "3-Bureau Scores",
            description:
              "Real-time access to Equifax, Experian, and TransUnion scores",
          },
          monitoring: {
            title: "Real-time Monitoring",
            description: "Get instant alerts when your credit profile changes",
          },
          advisor: {
            title: "AI Credit Advisor",
            description: "Personalized recommendations powered by Claude AI",
          },
          offers: {
            title: "Personalized Offers",
            description: "Cards and loans matched to your credit profile",
          },
        },
        hiw: {
          title: "Get Started in Minutes",
          s1: {
            title: "Create Account",
            description: "Sign up with email and password in seconds",
          },
          s2: {
            title: "Verify Identity",
            description: "Complete our secure identity verification",
          },
          s3: {
            title: "See Your Scores",
            description: "Instantly access all 3 bureau scores and insights",
          },
        },
        testimonials: {
          title: "Trusted by 2M+ Users",
          t1: {
            name: "Sarah Johnson",
            role: "Improved score by 47 points",
            quote:
              "MyCreditFICO gave me the clarity I needed. The AI advisor was game-changing.",
          },
          t2: {
            name: "Michael Chen",
            role: "Got approved for premium card",
            quote:
              "Real-time monitoring caught an error on my report within hours.",
          },
          t3: {
            name: "Emma Rodriguez",
            role: "Paid off $12K in debt",
            quote:
              "The personalized insights helped me create a realistic plan.",
          },
        },
        ranges: {
          title: "Understand Your Score",
          subtitle:
            "Credit scores tell your financial story. Here's what yours means.",
          poor: {
            label: "Poor",
            description:
              "Significant financial challenges. High borrowing costs.",
          },
          fair: {
            label: "Fair",
            description: "Some challenges. Better rates with effort.",
          },
          good: {
            label: "Good",
            description: "Solid credit. Qualified for better offers.",
          },
          very_good: {
            label: "Very Good",
            description: "Strong credit. Premium rates available.",
          },
          excellent: {
            label: "Excellent",
            description: "Exceptional credit. Best available rates.",
          },
        },
        impact: {
          title: "Real Impact, Real Results",
          subtitle: "See how our users have transformed their credit",
          i1: {
            stat: "47 pts",
            description: "Average score improvement",
            subtext: "In first 6 months",
          },
          i2: {
            stat: "$2.8K",
            description: "Average interest savings",
            subtext: "On new credit card",
          },
          i3: {
            stat: "89%",
            description: "Approval rate increase",
            subtext: "After using MyCreditFICO",
          },
          i4: {
            stat: "12 wks",
            description: "Average time to goal score",
            subtext: "With our guidance",
          },
        },
        faq: {
          title: "Common Questions",
          subtitle: "Everything you need to know",
          q1: {
            q: "Is checking my credit score free?",
            a: "Yes, completely free. You can check your score as many times as you want without any impact or cost.",
          },
          q2: {
            q: "Will checking my score hurt my credit?",
            a: "No. Checking your own score is a soft inquiry and doesn't affect your credit. Only hard inquiries (lender checks) impact your score.",
          },
          q3: {
            q: "How often should I check my score?",
            a: "We recommend checking monthly to track progress and catch errors. Our monitoring alerts you to significant changes automatically.",
          },
          q4: {
            q: "What's the difference between Equifax, Experian, and TransUnion?",
            a: "These are the three major credit bureaus that collect and maintain credit information. They may have slightly different scores based on their data.",
          },
          q5: {
            q: "Can I improve my score quickly?",
            a: "It depends on your situation. Paying down balances and disputing errors can help. Most improvements take 1-3 months to show.",
          },
          q6: {
            q: "Is my data safe with MyCreditFICO?",
            a: "Absolutely. We use 256-bit encryption, comply with FCRA regulations, and never sell your data to third parties.",
          },
        },
        why: {
          title: "Why Choose MyCreditFICO",
          subtitle: "The premium alternative to generic credit tools",
          comparison_title: "MyCreditFICO vs. The Rest",
          feat: {
            bureaus: "3-Bureau Scores",
            ai: "AI Credit Advisor",
            alerts: "Real-time Alerts",
            offers: "Personalized Offers",
            monitoring: "Credit Monitoring",
            tracking: "Score Tracking",
          },
          creditiq: "MyCreditFICO",
          creditiq_sub: "Premium",
          others: "Others",
          others_sub: "Standard",
          adv: {
            instant: {
              title: "Instant Access",
              description:
                "Get all 3 credit scores within minutes of signup. No waiting, no hassle.",
            },
            security: {
              title: "Bank-Grade Security",
              description:
                "Your data is protected with 256-bit encryption and FCRA compliance.",
            },
            guidance: {
              title: "Personalized Guidance",
              description:
                "Our AI advisor gives you specific, actionable steps for your situation.",
            },
            results: {
              title: "Proven Results",
              description:
                "Average 47-point improvement in 6 months with our guidance.",
            },
          },
        },
        pricing: {
          title: "One Plan, Complete Features",
          subtitle: "No surprises. All premium features included.",
          monthly: "Monthly",
          annual: "Annual",
          save: "Save 20%",
          badge: "PREMIUM PLAN",
          plan_name: "MyCreditFICO Pro",
          plan_subtitle: "Everything you need to master your credit",
          per_month: "/month",
          per_year: "/year",
          billing_monthly: "Billed monthly, cancel anytime",
          billing_annual: "Billed annually (save 20%)",
          cta: "Get Started",
          features_heading: "Complete Feature Set:",
          f1: "All 3 Credit Scores (Equifax, Experian, TransUnion)",
          f2: "Real-time Credit Alerts",
          f3: "AI Credit Advisor Powered by Claude",
          f4: "Monthly Credit Reports & Analysis",
          f5: "Credit Score Tracking & History",
          f6: "Personalized Improvement Recommendations",
          f7: "Credit Factor Breakdown & Insights",
          f8: "Dispute Management Tools",
          f9: "Priority Email Support",
          f10: "Advanced Analytics & Trends",
          f11: "Personalized Credit Offers",
          f12: "Identity Monitoring",
          no_cc: "Credit Card Required",
          instant: "Instant Access",
          support: "Support Available",
          cancel: "Cancel Anytime",
        },
        cta: {
          title: "Your credit score is waiting",
          subtitle:
            "Join millions who've taken control of their financial future",
          button: "Get Started Today",
        },
        footer: {
          tagline: "Premium credit intelligence for your financial future.",
          product: "Product",
          company: "Company",
          legal: "Legal",
          dashboard: "Dashboard",
          advisor: "Credit Advisor",
          monitoring: "Monitoring",
          about: "About",
          blog: "Blog",
          contact: "Contact",
          privacy: "Privacy",
          terms: "Terms",
          security: "Security",
          legal_text:
            "MyCreditFICO is not a credit repair service and cannot remove accurate negative information from your credit report. MyCreditFICO services are subject to the Fair Credit Reporting Act (FCRA) and other applicable laws. See our",
          fcra_link: "FCRA disclosure",
          legal_suffix: "for more information.",
          copyright: "© {{year}} MyCreditFICO. All rights reserved.",
        },
      },
    },
  },
  "es-MX": {
    common: {
      nav: {
        brand: "MyCreditFICO",
        signin: "Iniciar sesión",
        signup: "Comenzar",
        signout: "Cerrar sesión",
        scores: {
          tracker: "Rastreador de puntuación",
          builder: "Constructor de puntuación",
          boost: "Impulso de puntuación",
        },
        reports: {
          smart: "Reporte de crédito inteligente",
          "3b": "Reporte y puntuaciones de 3 bureaus",
        },
      },
      auth: {
        google: "Continuar con Google",
        apple: "Continuar con Apple",
        email: "O inicia sesión con tu correo",
        signup: "Crear cuenta",
        signin: "Iniciar sesión",
        email_label: "Correo electrónico",
        password_label: "Contraseña",
        name_label: "Nombre completo",
        forgot: "¿Olvidaste tu contraseña?",
        no_account: "¿No tienes una cuenta?",
        have_account: "¿Ya tienes una cuenta?",
        or: "O",
        page_signin_title: "Bienvenido de vuelta",
        page_signin_subtitle:
          "Inicia sesión para ver tu historial crediticio completo.",
        page_signup_title: "Toma el control de tu crédito",
        page_signup_subtitle:
          "Únete a más de 250,000 personas construyendo mejor crédito con MyCreditFICO.",
        feature_1: "Monitoreo en tiempo real de 3 burós",
        feature_2: "Asesor de puntaje con IA",
        feature_3: "Protección contra robo de identidad",
        feature_4: "Ofertas de crédito personalizadas",
      },
      onboarding: {
        title: "Obtén tu puntuación de crédito en 5 minutos",
        subtitle: "Únete a millones que toman el control de su crédito.",
        steps: {
          account: "Crear cuenta",
          personal: "Información personal",
          identity: "Tipo de identidad",
          consent: "Consentimiento legal",
          billing: "Iniciar prueba",
        },
        identity_type: {
          title: "Selecciona tu tipo de identidad",
          ssn: "SSN (Número de Seguro Social)",
          ssn_desc: "Para ciudadanos y residentes permanentes de EE.UU.",
          itin: "ITIN (Número de Identificación del Contribuyente Individual)",
          itin_desc: "Para inmigrantes y no ciudadanos",
          itin_warning: "El reporte ITIN tiene un costo de $60",
        },
        consent: {
          title: "Consentimiento legal requerido",
          fcra: "Al continuar, autorizas la consulta de tu historial crediticio bajo la Ley de Informes de Crédito Justos (FCRA).",
          agree: "Acepto los términos y autorizo la consulta de crédito",
        },
        personal: {
          firstname: "Nombre",
          lastname: "Apellido",
          dob: "Fecha de nacimiento",
          address: "Dirección",
          city: "Ciudad",
          state: "Estado",
          zip: "Código postal",
          ssn_itin: "SSN / ITIN",
        },
      },
      billing: {
        trial: "Inicia tu prueba de 7 días por $7",
        then: "Luego $25/mes",
        cancel: "Cancela cuando quieras",
        monthly: "$25/mes",
        trial_badge: "Prueba de 7 días",
        manage: "Administrar facturación",
        portal: "Abrir portal de facturación",
        no_active_title: "Sin suscripción activa",
        no_active_desc:
          "Suscríbete para desbloquear el monitoreo completo de los 3 bureaus, insights de IA y más.",
        start_trial: "Iniciar prueba por $7",
        checkout_title: "Completa tu suscripción",
        checkout_subtitle: "Pago seguro con Stripe",
        payment_success: "¡Suscripción activada! Bienvenido a MyCreditFICO Pro.",
        card_number: "Número de tarjeta",
        expiry: "Vencimiento",
        cvc: "Código de seguridad",
        cardholder: "Nombre en la tarjeta",
        cardholder_placeholder: "Nombre completo",
        pay_cta: "Pagar $7 \u00b7 Iniciar prueba de 7 días",
        card_error_generic: "Pago fallido. Verifica los datos de tu tarjeta.",
        redirecting: "Llevándote a tu panel\u2026",
        paywall_badge: "SUSCRIPCIÓN REQUERIDA",
        paywall_greeting: "Bienvenido de vuelta,",
        paywall_headline: "Desbloquea tu inteligencia crediticia",
        paywall_sub:
          "Puntajes de los 3 bureaus en tiempo real, insights de IA y ofertas de crédito personalizadas — todo en un panel.",
        paywall_preview_locked: "Tus puntajes están bloqueados",
        paywall_preview_sub: "Suscríbete para ver tus puntajes en vivo",
        paywall_trial_label: "Prueba de 7 días",
        paywall_trial_desc: "para desbloquear",
        paywall_then: "Luego $25/mes — cancela cuando quieras",
        paywall_plan_sub: "Acceso completo, cancela cuando quieras",
        paywall_cta: "Iniciar mi prueba — $7",
        paywall_profile_link: "Administra tu cuenta y datos en Perfil",
        paywall_social: "Únete a más de 250,000 miembros mejorando su crédito",
        paywall_f1_title: "Puntajes de 3 bureaus",
        paywall_f1_desc: "Puntajes en vivo de Experian, TransUnion y Equifax",
        paywall_f2_title: "Asesor de crédito IA",
        paywall_f2_desc: "Plan de acción personalizado para mejorar tu puntaje",
        paywall_f3_title: "Historial de puntaje",
        paywall_f3_desc: "Sigue tu progreso a lo largo del tiempo con gráficas",
        paywall_f4_title: "Alertas inteligentes",
        paywall_f4_desc:
          "Notificaciones instantáneas ante cualquier cambio crediticio",
        paywall_f5_title: "Ofertas de crédito",
        paywall_f5_desc: "Tarjetas y préstamos preaprobados adaptados a ti",
        paywall_f6_title: "Protección de identidad",
        paywall_f6_desc: "PrivacyMaster® monitorea la dark web las 24 horas",
        perk_1: "Puntajes de crédito de los 3 bureaus en vivo",
        perk_2: "Asesor de puntaje con IA",
        perk_3: "Alertas de cambios crediticios en tiempo real",
        perk_4: "Ofertas de crédito personalizadas y preaprobaciones",
      },
      profile: {
        title: "Mi Perfil",
        nav_link: "Perfil",
        back_to_dashboard: "Volver al panel",
        personal: {
          title: "Información personal",
          subtitle: "Detalles de tu cuenta administrados por Clerk",
          name: "Nombre completo",
          email: "Correo electrónico",
          identity: "Tipo de identidad",
        },
        billing: {
          title: "Suscripción y facturación",
          subtitle: "Administra tu suscripción a MyCreditFICO Pro",
          plan: "MyCreditFICO Pro",
          status: {
            active: "Activa",
            trialing: "Prueba",
            past_due: "Vencida",
            canceled: "Cancelada",
            inactive: "Inactiva",
          },
          renews_on: "Se renueva el {{date}}",
          cancels_on: "Se cancela el {{date}}",
          cancels_at_end: "Se cancela al final del período",
          no_active: "Sin suscripción activa",
          after_trial: "después de la prueba de 7 días",
          update_payment: "Actualizar método de pago",
          cancel_btn: "Cancelar suscripción",
          danger_zone: "Zona de peligro",
          danger_desc:
            "Una vez cancelada, el acceso continúa hasta el final del período.",
        },
        cancel: {
          title: "Cancelar tu suscripción",
          warning: "Esta acción no se puede deshacer.",
          lose_access: "Perderás acceso inmediato a:",
          consequences: {
            scores: "Monitoreo de puntuaciones de los 3 bureaus",
            monitoring: "Alertas de cambios en tu crédito en tiempo real",
            advisor: "Sesiones del Asesor de Crédito IA",
            data: "Tus datos se conservan 30 días",
          },
          confirm_label: "Escribe {{phrase}} para confirmar:",
          type_exact: "Escribe exactamente la frase indicada.",
          confirm_btn: "Cancelar mi suscripción",
          back_btn: "Volver — Conservar mi plan",
          success: "Tu suscripción ha sido cancelada.",
          period_note: "Tendrás acceso completo hasta el {{date}}.",
        },
      },
      dashboard: {
        score: {
          title: "Tu puntuación de crédito",
          as_of: "Al {{date}}",
          starting: "Tu puntuación inicial fue {{score}}",
          gained: "Has ganado +{{pts}} pts hasta ahora",
        },
        future_score: "Tu puntuación futura",
        scorebuilder: {
          title: "ScoreBuilder®",
          potential: "+{{pts}} pts de potencial",
          cta: "Tomar acción ahora",
        },
        scoreboost: {
          title: "ScoreBoost™",
          boost: "+{{pts}} pts con pagos a tiempo",
          risk: "-{{pts}} pts de riesgo por gastos excesivos",
          cta: "Iniciar un plan",
        },
        report: {
          title: "Reporte de Crédito Inteligente®",
          grade: "Tu calificación actual",
          last_update: "Última actualización",
        },
        "3b": {
          title: "Reporte y puntuaciones de 3 bureaus",
          experian: "Experian",
          transunion: "TransUnion",
          equifax: "Equifax",
        },
        offers: {
          title: "myLONA® — Ofertas de crédito y préstamos",
          subtitle: "Comparar ofertas sin afectar tu puntuación",
          cta: "Ver todas las ofertas",
        },
        privacy: {
          title: "PrivacyMaster®",
          label: "Tu información personal:",
          found: "Encontrado en {{n}} nuevos sitios web",
          next_scan: "Próximo escaneo en 7 días",
        },
        pulls: {
          available: "Consultas disponibles este mes: {{n}}/{{max}}",
          limit_reached: "Has alcanzado tu límite mensual",
          refresh: "Actualizar reporte de crédito",
        },
      },
      itin: {
        cost_warning: "El reporte ITIN tiene un costo de $60",
        confirm: "Confirmar consulta ITIN de $60",
        confirm_desc:
          "Esto iniciará una consulta de crédito con myFICO con un costo de $60. ¿Deseas continuar?",
      },
      errors: {
        generic: "Algo salió mal.",
        unauthorized: "Debes iniciar sesión.",
        session_expired: "Tu sesión ha expirado.",
      },
      common: {
        loading: "Cargando...",
        save: "Guardar",
        cancel: "Cancelar",
        back: "Atrás",
        next: "Siguiente",
        submit: "Enviar",
        close: "Cerrar",
        confirm: "Confirmar",
      },
      landing: {
        score_label: "Puntuación de crédito",
        nav: {
          features: "Características",
          how_it_works: "Cómo funciona",
          testimonials: "Testimonios",
          pricing: "Precios",
          signin: "Iniciar sesión",
          dashboard: "Panel",
        },
        hero: {
          title1: "Conoce tu crédito.",
          title2: "Domina tu futuro.",
          description:
            "Accede de inmediato a tus puntajes de crédito de los 3 bureaus, perspectivas personalizadas y una hoja de ruta hacia la excelencia financiera.",
          cta_primary: "Comenzar ahora",
          cta_secondary: "Saber más",
        },
        trust: {
          encryption: "Encriptación de 256 bits",
          fcra: "Cumple con FCRA",
          bureaus: "Cobertura de 3 bureaus",
          users: "2M+ usuarios",
        },
        features: {
          title: "Herramientas poderosas para tu crédito",
          subtitle:
            "Todo lo que necesitas para entender y mejorar tu perfil crediticio",
          bureaus: {
            title: "Puntajes de 3 bureaus",
            description:
              "Acceso en tiempo real a puntajes de Equifax, Experian y TransUnion",
          },
          monitoring: {
            title: "Monitoreo en tiempo real",
            description:
              "Recibe alertas instantáneas cuando tu perfil crediticio cambie",
          },
          advisor: {
            title: "Asesor de crédito con IA",
            description:
              "Recomendaciones personalizadas impulsadas por Claude AI",
          },
          offers: {
            title: "Ofertas personalizadas",
            description:
              "Tarjetas y préstamos adaptados a tu perfil crediticio",
          },
        },
        hiw: {
          title: "Empieza en minutos",
          s1: {
            title: "Crea tu cuenta",
            description: "Regístrate con tu correo y contraseña en segundos",
          },
          s2: {
            title: "Verifica tu identidad",
            description: "Completa nuestra verificación de identidad segura",
          },
          s3: {
            title: "Ve tus puntajes",
            description: "Accede de inmediato a tus 3 puntajes de bureau",
          },
        },
        testimonials: {
          title: "Confiado por 2M+ usuarios",
          t1: {
            name: "Sarah Johnson",
            role: "Mejoró su puntaje 47 puntos",
            quote:
              "MyCreditFICO me dio la claridad que necesitaba. El asesor de IA fue revolucionario.",
          },
          t2: {
            name: "Michael Chen",
            role: "Aprobado para tarjeta premium",
            quote:
              "El monitoreo en tiempo real detectó un error en mi reporte en horas.",
          },
          t3: {
            name: "Emma Rodríguez",
            role: "Pagó $12K de deuda",
            quote:
              "Las perspectivas personalizadas me ayudaron a crear un plan realista.",
          },
        },
        ranges: {
          title: "Entiende tu puntaje",
          subtitle:
            "Los puntajes de crédito cuentan tu historia financiera. Esto es lo que significa el tuyo.",
          poor: {
            label: "Pobre",
            description:
              "Desafíos financieros significativos. Altos costos de préstamos.",
          },
          fair: {
            label: "Regular",
            description: "Algunos desafíos. Mejores tasas con esfuerzo.",
          },
          good: {
            label: "Bueno",
            description: "Crédito sólido. Calificado para mejores ofertas.",
          },
          very_good: {
            label: "Muy bueno",
            description: "Crédito fuerte. Tasas premium disponibles.",
          },
          excellent: {
            label: "Excelente",
            description: "Crédito excepcional. Las mejores tasas disponibles.",
          },
        },
        impact: {
          title: "Impacto real, resultados reales",
          subtitle: "Mira cómo nuestros usuarios han transformado su crédito",
          i1: {
            stat: "47 pts",
            description: "Mejora promedio de puntaje",
            subtext: "En los primeros 6 meses",
          },
          i2: {
            stat: "$2.8K",
            description: "Ahorro promedio en intereses",
            subtext: "En nueva tarjeta de crédito",
          },
          i3: {
            stat: "89%",
            description: "Aumento en tasa de aprobación",
            subtext: "Después de usar MyCreditFICO",
          },
          i4: {
            stat: "12 sem",
            description: "Tiempo promedio para alcanzar meta",
            subtext: "Con nuestra orientación",
          },
        },
        faq: {
          title: "Preguntas frecuentes",
          subtitle: "Todo lo que necesitas saber",
          q1: {
            q: "¿Es gratis revisar mi puntaje de crédito?",
            a: "Sí, completamente gratis. Puedes revisar tu puntaje cuantas veces quieras sin impacto ni costo.",
          },
          q2: {
            q: "¿Revisar mi puntaje afectará mi crédito?",
            a: "No. Revisar tu propio puntaje es una consulta suave y no afecta tu crédito. Solo las consultas duras (de prestamistas) impactan tu puntaje.",
          },
          q3: {
            q: "¿Con qué frecuencia debo revisar mi puntaje?",
            a: "Recomendamos revisar mensualmente para rastrear el progreso y detectar errores. Nuestro monitoreo te alerta automáticamente.",
          },
          q4: {
            q: "¿Cuál es la diferencia entre Equifax, Experian y TransUnion?",
            a: "Son los tres principales bureaus de crédito. Pueden tener puntajes ligeramente diferentes según sus datos.",
          },
          q5: {
            q: "¿Puedo mejorar mi puntaje rápidamente?",
            a: "Depende de tu situación. Pagar saldos y disputar errores puede ayudar. La mayoría de las mejoras tardan 1-3 meses.",
          },
          q6: {
            q: "¿Están seguros mis datos con MyCreditFICO?",
            a: "Absolutamente. Usamos encriptación de 256 bits, cumplimos con las regulaciones FCRA y nunca vendemos tus datos.",
          },
        },
        why: {
          title: "¿Por qué elegir MyCreditFICO?",
          subtitle:
            "La alternativa premium a las herramientas de crédito genéricas",
          comparison_title: "MyCreditFICO vs. El resto",
          feat: {
            bureaus: "Puntajes de 3 bureaus",
            ai: "Asesor de crédito con IA",
            alerts: "Alertas en tiempo real",
            offers: "Ofertas personalizadas",
            monitoring: "Monitoreo de crédito",
            tracking: "Seguimiento de puntaje",
          },
          creditiq: "MyCreditFICO",
          creditiq_sub: "Premium",
          others: "Otros",
          others_sub: "Estándar",
          adv: {
            instant: {
              title: "Acceso instantáneo",
              description:
                "Obtén tus 3 puntajes de crédito en minutos. Sin espera.",
            },
            security: {
              title: "Seguridad bancaria",
              description:
                "Tus datos están protegidos con encriptación de 256 bits y cumplimiento FCRA.",
            },
            guidance: {
              title: "Orientación personalizada",
              description:
                "Nuestro asesor de IA te da pasos específicos y accionables para tu situación.",
            },
            results: {
              title: "Resultados comprobados",
              description:
                "Mejora promedio de 47 puntos en 6 meses con nuestra orientación.",
            },
          },
        },
        pricing: {
          title: "Un plan, todas las funciones",
          subtitle: "Sin sorpresas. Todas las funciones premium incluidas.",
          monthly: "Mensual",
          annual: "Anual",
          save: "Ahorra 20%",
          badge: "PLAN PREMIUM",
          plan_name: "MyCreditFICO Pro",
          plan_subtitle: "Todo lo que necesitas para dominar tu crédito",
          per_month: "/mes",
          per_year: "/año",
          billing_monthly: "Cobro mensual, cancela cuando quieras",
          billing_annual: "Cobro anual (ahorra 20%)",
          cta: "Comenzar",
          features_heading: "Conjunto completo de funciones:",
          f1: "Los 3 puntajes de crédito (Equifax, Experian, TransUnion)",
          f2: "Alertas de crédito en tiempo real",
          f3: "Asesor de crédito con IA impulsado por Claude",
          f4: "Reportes y análisis mensuales de crédito",
          f5: "Seguimiento e historial de puntaje",
          f6: "Recomendaciones personalizadas de mejora",
          f7: "Análisis de factores de crédito",
          f8: "Herramientas de gestión de disputas",
          f9: "Soporte prioritario por correo",
          f10: "Análisis y tendencias avanzadas",
          f11: "Ofertas de crédito personalizadas",
          f12: "Monitoreo de identidad",
          no_cc: "Tarjeta de crédito requerida",
          instant: "Acceso instantáneo",
          support: "Soporte disponible",
          cancel: "Cancela cuando quieras",
        },
        cta: {
          title: "Tu puntaje de crédito te espera",
          subtitle:
            "Únete a millones que han tomado el control de su futuro financiero",
          button: "Comenzar hoy",
        },
        footer: {
          tagline: "Inteligencia crediticia premium para tu futuro financiero.",
          product: "Producto",
          company: "Empresa",
          legal: "Legal",
          dashboard: "Panel",
          advisor: "Asesor de crédito",
          monitoring: "Monitoreo",
          about: "Acerca de",
          blog: "Blog",
          contact: "Contacto",
          privacy: "Privacidad",
          terms: "Términos",
          security: "Seguridad",
          legal_text:
            "MyCreditFICO no es un servicio de reparación de crédito. Los servicios de MyCreditFICO están sujetos a la Ley de Informes de Crédito Justos (FCRA). Consulta nuestro",
          fcra_link: "divulgación FCRA",
          legal_suffix: "para más información.",
          copyright: "© {{year}} MyCreditFICO. Todos los derechos reservados.",
        },
      },
    },
  },
  fr: {
    common: {
      nav: {
        brand: "MyCreditFICO",
        signin: "Se connecter",
        signup: "Commencer",
        signout: "Se déconnecter",
        scores: {
          tracker: "Suivi de score",
          builder: "Constructeur de score",
          boost: "Boost de score",
        },
        reports: {
          smart: "Rapport de crédit intelligent",
          "3b": "Rapport et scores 3 bureaux",
        },
      },
      auth: {
        google: "Continuer avec Google",
        apple: "Continuer avec Apple",
        email: "Ou connectez-vous avec votre email",
        signup: "Créer un compte",
        signin: "Se connecter",
        email_label: "Adresse email",
        password_label: "Mot de passe",
        name_label: "Nom complet",
        forgot: "Mot de passe oublié?",
        no_account: "Vous n'avez pas de compte?",
        have_account: "Vous avez déjà un compte?",
        or: "Ou",
        page_signin_title: "Bon retour",
        page_signin_subtitle:
          "Connectez-vous pour accéder à votre tableau de bord crédit.",
        page_signup_title: "Prenez le contrôle de votre crédit",
        page_signup_subtitle:
          "Rejoignez plus de 250 000 personnes qui améliorent leur crédit avec MyCreditFICO.",
        feature_1: "Surveillance en temps réel des 3 bureaux",
        feature_2: "Conseiller de score basé sur l'IA",
        feature_3: "Protection contre l'usurpation d'identité",
        feature_4: "Offres de crédit personnalisées",
      },
      onboarding: {
        title: "Obtenez votre score de crédit en 5 minutes",
        subtitle: "Rejoignez des millions de personnes.",
        steps: {
          account: "Créer un compte",
          personal: "Informations personnelles",
          identity: "Type d'identité",
          consent: "Consentement légal",
          billing: "Commencer l'essai",
        },
        identity_type: {
          title: "Sélectionnez votre type d'identité",
          ssn: "SSN",
          ssn_desc: "Pour les citoyens américains",
          itin: "ITIN",
          itin_desc: "Pour les immigrants",
          itin_warning: "Le rapport ITIN coûte 60$",
        },
        consent: {
          title: "Consentement légal requis",
          fcra: "En continuant, vous autorisez la consultation de votre historique de crédit (FCRA).",
          agree: "J'accepte les conditions",
        },
        personal: {
          firstname: "Prénom",
          lastname: "Nom",
          dob: "Date de naissance",
          address: "Adresse",
          city: "Ville",
          state: "État",
          zip: "Code postal",
          ssn_itin: "SSN / ITIN",
        },
      },
      billing: {
        trial: "Commencer l'essai de 7 jours pour 7$",
        then: "Puis 25$/mois",
        cancel: "Annulez à tout moment",
        monthly: "25$/mois",
        trial_badge: "Essai de 7 jours",
        manage: "Gérer la facturation",
        portal: "Ouvrir le portail",
        no_active_title: "Aucun abonnement actif",
        no_active_desc:
          "Abonnez-vous pour débloquer la surveillance complète des 3 bureaux, les insights IA et plus encore.",
        start_trial: "Démarrer l'essai à 7$",
        checkout_title: "Finalisez votre abonnement",
        checkout_subtitle: "Paiement sécurisé via Stripe",
        payment_success: "Abonnement activé ! Bienvenue dans MyCreditFICO Pro.",
        card_number: "Numéro de carte",
        expiry: "Date d'expiration",
        cvc: "Code de sécurité",
        cardholder: "Nom sur la carte",
        cardholder_placeholder: "Nom complet",
        pay_cta: "Payer 7$ \u00b7 Démarrer l'essai de 7 jours",
        card_error_generic:
          "Paiement échoué. Vérifiez les détails de votre carte.",
        redirecting: "Redirection vers votre tableau de bord\u2026",
        paywall_badge: "ABONNEMENT REQUIS",
        paywall_greeting: "Bon retour,",
        paywall_headline: "Débloquez votre intelligence crédit",
        paywall_sub:
          "Scores des 3 bureaux en temps réel, insights IA et offres de crédit personnalisées — tout en un tableau de bord.",
        paywall_preview_locked: "Vos scores sont verrouillés",
        paywall_preview_sub: "Abonnez-vous pour voir vos scores en direct",
        paywall_trial_label: "Essai de 7 jours",
        paywall_trial_desc: "pour débloquer",
        paywall_then: "Puis 25$/mois — annulez à tout moment",
        paywall_plan_sub: "Accès complet, annulez à tout moment",
        paywall_cta: "Démarrer mon essai — 7$",
        paywall_profile_link: "Gérez votre compte et vos données dans Profil",
        paywall_social: "Rejoignez 250 000+ membres améliorant leur crédit",
        paywall_f1_title: "Scores des 3 bureaux",
        paywall_f1_desc: "Scores en direct d'Experian, TransUnion et Equifax",
        paywall_f2_title: "Conseiller crédit IA",
        paywall_f2_desc:
          "Plan d'action personnalisé pour améliorer votre score",
        paywall_f3_title: "Historique des scores",
        paywall_f3_desc: "Suivez vos progrès dans le temps avec des graphiques",
        paywall_f4_title: "Alertes intelligentes",
        paywall_f4_desc:
          "Notifications instantanées pour tout changement de crédit",
        paywall_f5_title: "Offres de crédit",
        paywall_f5_desc: "Cartes et prêts pré-qualifiés adaptés à votre profil",
        paywall_f6_title: "Protection d'identité",
        paywall_f6_desc: "PrivacyMaster® surveille le dark web 24h/24",
        perk_1: "Scores de crédit en direct des 3 bureaux",
        perk_2: "Conseiller de score alimenté par l'IA",
        perk_3: "Alertes de changements de crédit en temps réel",
        perk_4: "Offres de crédit personnalisées et pré-approbations",
      },
      profile: {
        title: "Mon Profil",
        nav_link: "Profil",
        back_to_dashboard: "Retour au tableau de bord",
        personal: {
          title: "Informations personnelles",
          subtitle: "Détails du compte gérés par Clerk",
          name: "Nom complet",
          email: "Adresse email",
          identity: "Type d'identité",
        },
        billing: {
          title: "Abonnement et facturation",
          subtitle: "Gérez votre abonnement MyCreditFICO Pro",
          plan: "MyCreditFICO Pro",
          status: {
            active: "Actif",
            trialing: "Essai",
            past_due: "En retard",
            canceled: "Annulé",
            inactive: "Inactif",
          },
          renews_on: "Renouvellement le {{date}}",
          cancels_on: "Annulation le {{date}}",
          cancels_at_end: "Annulé en fin de période",
          no_active: "Pas d'abonnement actif",
          after_trial: "après l'essai de 7 jours",
          update_payment: "Mettre à jour le paiement",
          cancel_btn: "Annuler l'abonnement",
          danger_zone: "Zone dangereuse",
          danger_desc:
            "Une fois annulé, l'accès continue jusqu'à la fin de la période.",
        },
        cancel: {
          title: "Annuler votre abonnement",
          warning: "Cette action est irréversible.",
          lose_access: "Vous perdrez immédiatement l'accès à:",
          consequences: {
            scores: "Surveillance des scores des 3 bureaux",
            monitoring: "Alertes de changement de crédit en temps réel",
            advisor: "Sessions du Conseiller IA",
            data: "Vos données sont conservées 30 jours",
          },
          confirm_label: "Tapez {{phrase}} pour confirmer:",
          type_exact: "Tapez exactement la phrase indiquée.",
          confirm_btn: "Annuler mon abonnement",
          back_btn: "Retour — Conserver mon plan",
          success: "Votre abonnement a été annulé.",
          period_note: "Vous aurez un accès complet jusqu'au {{date}}.",
        },
      },
      dashboard: {
        score: {
          title: "Votre score de crédit",
          as_of: "Au {{date}}",
          starting: "Votre score initial était {{score}}",
          gained: "Vous avez gagné +{{pts}} pts",
        },
        future_score: "Votre score futur",
        scorebuilder: {
          title: "ScoreBuilder®",
          potential: "+{{pts}} pts de potentiel",
          cta: "Agir maintenant",
        },
        scoreboost: {
          title: "ScoreBoost™",
          boost: "+{{pts}} pts",
          risk: "-{{pts}} pts",
          cta: "Commencer un plan",
        },
        report: {
          title: "Rapport de crédit intelligent®",
          grade: "Votre note actuelle",
          last_update: "Dernière mise à jour",
        },
        "3b": {
          title: "Rapport 3 bureaux",
          experian: "Experian",
          transunion: "TransUnion",
          equifax: "Equifax",
        },
        offers: {
          title: "myLONA® — Offres",
          subtitle: "Comparer les offres",
          cta: "Voir toutes les offres",
        },
        privacy: {
          title: "PrivacyMaster®",
          label: "Vos informations:",
          found: "Trouvé sur {{n}} sites",
          next_scan: "Prochain scan dans 7 jours",
        },
        pulls: {
          available: "Consultations: {{n}}/{{max}}",
          limit_reached: "Limite atteinte",
          refresh: "Actualiser",
        },
      },
      itin: {
        cost_warning: "Le rapport ITIN coûte 60$",
        confirm: "Confirmer 60$",
        confirm_desc: "Cela déclenchera une consultation à 60$.",
      },
      errors: {
        generic: "Une erreur s'est produite.",
        unauthorized: "Vous devez être connecté.",
        session_expired: "Votre session a expiré.",
      },
      common: {
        loading: "Chargement...",
        save: "Sauvegarder",
        cancel: "Annuler",
        back: "Retour",
        next: "Suivant",
        submit: "Soumettre",
        close: "Fermer",
        confirm: "Confirmer",
      },
      landing: {
        score_label: "Score de crédit",
        nav: {
          features: "Fonctionnalités",
          how_it_works: "Comment ça marche",
          testimonials: "Témoignages",
          pricing: "Tarifs",
          signin: "Se connecter",
          dashboard: "Tableau de bord",
        },
        hero: {
          title1: "Connaissez votre crédit.",
          title2: "Maîtrisez votre avenir.",
          description:
            "Accédez instantanément à vos scores de crédit des 3 bureaux, des insights personnalisés et une feuille de route vers l'excellence financière.",
          cta_primary: "Commencer maintenant",
          cta_secondary: "En savoir plus",
        },
        trust: {
          encryption: "Chiffrement 256 bits",
          fcra: "Conforme FCRA",
          bureaus: "Couverture 3 bureaux",
          users: "2M+ utilisateurs",
        },
        features: {
          title: "Des outils puissants pour votre crédit",
          subtitle:
            "Tout ce dont vous avez besoin pour comprendre et améliorer votre profil de crédit",
          bureaus: {
            title: "Scores des 3 bureaux",
            description:
              "Accès en temps réel aux scores Equifax, Experian et TransUnion",
          },
          monitoring: {
            title: "Surveillance en temps réel",
            description:
              "Recevez des alertes instantanées lorsque votre profil de crédit change",
          },
          advisor: {
            title: "Conseiller IA",
            description: "Recommandations personnalisées par Claude AI",
          },
          offers: {
            title: "Offres personnalisées",
            description: "Cartes et prêts adaptés à votre profil de crédit",
          },
        },
        hiw: {
          title: "Commencez en quelques minutes",
          s1: {
            title: "Créer un compte",
            description:
              "Inscrivez-vous avec email et mot de passe en secondes",
          },
          s2: {
            title: "Vérifier l'identité",
            description: "Complétez notre vérification d'identité sécurisée",
          },
          s3: {
            title: "Voir vos scores",
            description: "Accédez instantanément aux 3 scores de bureau",
          },
        },
        testimonials: {
          title: "Approuvé par 2M+ utilisateurs",
          t1: {
            name: "Sarah Johnson",
            role: "Score amélioré de 47 points",
            quote:
              "MyCreditFICO m'a donné la clarté dont j'avais besoin. Le conseiller IA était révolutionnaire.",
          },
          t2: {
            name: "Michael Chen",
            role: "Approuvé pour carte premium",
            quote:
              "La surveillance en temps réel a détecté une erreur dans mon rapport en quelques heures.",
          },
          t3: {
            name: "Emma Rodriguez",
            role: "12 000$ de dette remboursés",
            quote:
              "Les insights personnalisés m'ont aidé à créer un plan réaliste.",
          },
        },
        ranges: {
          title: "Comprendre votre score",
          subtitle:
            "Les scores de crédit racontent votre histoire financière. Voici ce que signifie le vôtre.",
          poor: {
            label: "Mauvais",
            description: "Défis financiers importants. Coûts d'emprunt élevés.",
          },
          fair: {
            label: "Passable",
            description: "Quelques défis. De meilleurs taux avec des efforts.",
          },
          good: {
            label: "Bon",
            description: "Crédit solide. Qualifié pour de meilleures offres.",
          },
          very_good: {
            label: "Très bon",
            description: "Crédit fort. Taux premium disponibles.",
          },
          excellent: {
            label: "Excellent",
            description: "Crédit exceptionnel. Meilleurs taux disponibles.",
          },
        },
        impact: {
          title: "Impact réel, résultats réels",
          subtitle: "Voyez comment nos utilisateurs ont transformé leur crédit",
          i1: {
            stat: "47 pts",
            description: "Amélioration moyenne du score",
            subtext: "Dans les 6 premiers mois",
          },
          i2: {
            stat: "2 800$",
            description: "Économies moyennes d'intérêts",
            subtext: "Sur nouvelle carte de crédit",
          },
          i3: {
            stat: "89%",
            description: "Augmentation du taux d'approbation",
            subtext: "Après utilisation de MyCreditFICO",
          },
          i4: {
            stat: "12 sem",
            description: "Temps moyen pour atteindre l'objectif",
            subtext: "Avec nos conseils",
          },
        },
        faq: {
          title: "Questions fréquentes",
          subtitle: "Tout ce que vous devez savoir",
          q1: {
            q: "Vérifier mon score est-il gratuit?",
            a: "Oui, entièrement gratuit. Vous pouvez vérifier votre score autant de fois que vous voulez sans impact ni coût.",
          },
          q2: {
            q: "Vérifier mon score nuira-t-il à mon crédit?",
            a: "Non. Vérifier votre propre score est une enquête douce et n'affecte pas votre crédit. Seules les enquêtes dures impactent votre score.",
          },
          q3: {
            q: "À quelle fréquence dois-je vérifier mon score?",
            a: "Nous recommandons de vérifier mensuellement pour suivre les progrès et détecter les erreurs.",
          },
          q4: {
            q: "Quelle est la différence entre Equifax, Experian et TransUnion?",
            a: "Ce sont les trois principaux bureaux de crédit. Ils peuvent avoir des scores légèrement différents selon leurs données.",
          },
          q5: {
            q: "Puis-je améliorer mon score rapidement?",
            a: "Cela dépend de votre situation. Rembourser les soldes et contester les erreurs peut aider. La plupart des améliorations prennent 1 à 3 mois.",
          },
          q6: {
            q: "Mes données sont-elles sécurisées avec MyCreditFICO?",
            a: "Absolument. Nous utilisons le chiffrement 256 bits, respectons la réglementation FCRA et ne vendons jamais vos données.",
          },
        },
        why: {
          title: "Pourquoi choisir MyCreditFICO?",
          subtitle: "L'alternative premium aux outils de crédit génériques",
          comparison_title: "MyCreditFICO vs. Les autres",
          feat: {
            bureaus: "Scores des 3 bureaux",
            ai: "Conseiller IA",
            alerts: "Alertes en temps réel",
            offers: "Offres personnalisées",
            monitoring: "Surveillance du crédit",
            tracking: "Suivi du score",
          },
          creditiq: "MyCreditFICO",
          creditiq_sub: "Premium",
          others: "Autres",
          others_sub: "Standard",
          adv: {
            instant: {
              title: "Accès instantané",
              description:
                "Obtenez vos 3 scores de crédit en quelques minutes. Sans attente.",
            },
            security: {
              title: "Sécurité bancaire",
              description:
                "Vos données sont protégées par un chiffrement 256 bits et la conformité FCRA.",
            },
            guidance: {
              title: "Conseils personnalisés",
              description:
                "Notre conseiller IA vous donne des étapes spécifiques et actionnables.",
            },
            results: {
              title: "Résultats prouvés",
              description:
                "Amélioration moyenne de 47 points en 6 mois avec nos conseils.",
            },
          },
        },
        pricing: {
          title: "Un plan, toutes les fonctionnalités",
          subtitle:
            "Pas de surprises. Toutes les fonctionnalités premium incluses.",
          monthly: "Mensuel",
          annual: "Annuel",
          save: "Économisez 20%",
          badge: "PLAN PREMIUM",
          plan_name: "MyCreditFICO Pro",
          plan_subtitle:
            "Tout ce dont vous avez besoin pour maîtriser votre crédit",
          per_month: "/mois",
          per_year: "/an",
          billing_monthly: "Facturé mensuellement, annulez à tout moment",
          billing_annual: "Facturé annuellement (économisez 20%)",
          cta: "Commencer",
          features_heading: "Ensemble complet de fonctionnalités :",
          f1: "Les 3 scores de crédit (Equifax, Experian, TransUnion)",
          f2: "Alertes de crédit en temps réel",
          f3: "Conseiller IA alimenté par Claude",
          f4: "Rapports et analyses mensuels",
          f5: "Suivi et historique du score",
          f6: "Recommandations d'amélioration personnalisées",
          f7: "Analyse des facteurs de crédit",
          f8: "Outils de gestion des litiges",
          f9: "Support email prioritaire",
          f10: "Analyses et tendances avancées",
          f11: "Offres de crédit personnalisées",
          f12: "Surveillance d'identité",
          no_cc: "Carte de crédit requise",
          instant: "Accès instantané",
          support: "Support disponible",
          cancel: "Annulez à tout moment",
        },
        cta: {
          title: "Votre score de crédit vous attend",
          subtitle:
            "Rejoignez des millions qui ont pris le contrôle de leur avenir financier",
          button: "Commencer aujourd'hui",
        },
        footer: {
          tagline: "Intelligence crédit premium pour votre avenir financier.",
          product: "Produit",
          company: "Entreprise",
          legal: "Légal",
          dashboard: "Tableau de bord",
          advisor: "Conseiller crédit",
          monitoring: "Surveillance",
          about: "À propos",
          blog: "Blog",
          contact: "Contact",
          privacy: "Confidentialité",
          terms: "Conditions",
          security: "Sécurité",
          legal_text:
            "MyCreditFICO n'est pas un service de réparation de crédit. Les services de MyCreditFICO sont soumis au Fair Credit Reporting Act (FCRA). Consultez notre",
          fcra_link: "divulgation FCRA",
          legal_suffix: "pour plus d'informations.",
          copyright: "© {{year}} MyCreditFICO. Tous droits réservés.",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: "common",
    fallbackLng: "en",
    supportedLngs: ["en", "es-MX", "fr"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "creditiq_locale",
    },
  });

export default i18n;
