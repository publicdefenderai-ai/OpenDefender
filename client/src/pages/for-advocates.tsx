import { motion } from "framer-motion";
import { ArrowRight, Scale, Heart, Clock, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const tools = [
  {
    Icon: Scale,
    title: "Diversion Programs",
    desc: "111 programs across all 50 states + DC + Federal. Filter by state to find alternatives to prosecution for clients.",
    href: "/diversion-programs",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    accent: "#0f766e",
  },
  {
    Icon: Users,
    title: "Legal Aid Directory",
    desc: "Find legal aid organizations near any ZIP code. Includes LSC-funded and pro bono resources for client referrals.",
    href: "/legal-aid",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    accent: "#1d4ed8",
  },
  {
    Icon: Heart,
    title: "Life & Family Support Hub",
    desc: "Housing, employment, childcare, mental health, court logistics, and re-entry resources — shareable with clients.",
    href: "/support",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    accent: "#be185d",
  },
  {
    Icon: BookOpen,
    title: "Record Clearance Screener",
    desc: "Help clients understand expungement and sealing options based on conviction history and jurisdiction.",
    href: "/support/reputation/eligibility",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    accent: "#b45309",
  },
  {
    Icon: Clock,
    title: "Case Timeline",
    desc: "Visual 7-stage guide through every step of a criminal case — useful for orienting clients at any point in the process.",
    href: "/case-timeline",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-900/20",
    accent: "#475569",
  },
];

export default function ForAdvocates() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-purple py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">
              Advocate Hub — Coming Soon
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
              Tools for Public Defenders,{" "}
              <br className="hidden sm:block" />
              Social Workers & Case Advocates
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              OpenDefender is building a dedicated hub for the professionals who support people navigating the criminal justice system. The resources below are live today. A unified advocate dashboard — with intake tools, bulk referrals, and jurisdiction-specific program lookups — is in development.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-xl font-bold text-foreground mb-2">Available now</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Each of these tools is fully functional and shareable with clients today.
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {tools.map(({ Icon, title, desc, href, color, bg, accent }, i) => (
              <ScrollReveal key={href} delay={i * 0.07}>
                <Link href={href}>
                  <div
                    className={`flex flex-col h-full rounded-xl border border-l-4 p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${bg}`}
                    style={{ borderLeftColor: accent }}
                  >
                    <Icon className={`h-5 w-5 mb-3 ${color}`} strokeWidth={1.75} />
                    <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">{desc}</p>
                    <p className={`text-xs font-semibold flex items-center gap-1 ${color}`}>
                      Open <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-border/30 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Building tools for advocates is a priority. If you work in public defense, social work, or community advocacy and want to share what would be most useful,{" "}
            <Link href="/mission-statement" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
              learn more about the project
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
