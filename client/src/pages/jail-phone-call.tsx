import { BrandShieldIcon } from "@/components/brand-logo";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Shield, Clock, Scale, Users } from "lucide-react";

export default function JailPhoneCall() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-teal py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {t('jailPhoneCall.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('jailPhoneCall.subtitle')}
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10">

        {/* Big warning */}
        <ScrollReveal>
          <Alert className="border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong className="block mb-1">Every call is monitored and recorded — assume so without exception.</strong>
              Jails are required to notify you that calls are recorded, but this warning is easy to miss. Prosecutors have used jail calls as key evidence in countless cases, including statements made to family members.
              The one exception is calls to your attorney — those <em>should</em> be privileged, though you should still verify with your attorney that the line is properly designated.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Section 1: Your first call */}
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Your First Call — Priorities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your first call should go to a family member or trusted friend — not your attorney (they likely won't answer an unfamiliar collect call). The goal of this call is to transfer information and get the right people moving.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-sm text-foreground">Tell the person you call:</p>
                <ol className="space-y-2">
                  {[
                    { n: 1, text: "The name of the facility where you are being held" },
                    { n: 2, text: "Your booking number (ask jail staff if you don't have it yet)" },
                    { n: 3, text: "The charges, if you know them" },
                    { n: 4, text: "Ask them to find a criminal defense attorney or call the public defender's office in the county where you were arrested" },
                    { n: 5, text: "Nothing else about the case" },
                  ].map(({ n, text }) => (
                    <li key={n} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {n}
                      </span>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 2: Script */}
        <ScrollReveal>
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Sample Script</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700 font-mono text-sm leading-relaxed text-foreground space-y-3">
                <p>"Hey, it's me. I'm okay, but I've been arrested."</p>
                <p>"I'm at [facility name]. My booking number is [number]."</p>
                <p>"I've been charged with [charge, if known]."</p>
                <p>"I need you to find a lawyer — call [attorney name if known] or contact the public defender's office in [county]."</p>
                <p>"Don't talk to any police or detectives until there's a lawyer involved. I can't say anything else right now."</p>
                <p>"I love you. I'll be okay. Go make those calls."</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Keep it short. Longer calls mean more recorded material and more chances to say something that could be used against you.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 3: What NEVER to say */}
        <ScrollReveal>
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader className="bg-red-50/60 dark:bg-red-950/30 rounded-t-lg">
              <CardTitle className="text-red-800 dark:text-red-300">
                What Never to Say — On Any Jail Call
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                These are the categories of statements that most commonly become evidence. It doesn't matter who you're talking to — a parent, a partner, a best friend — if it's a jail phone, treat it as if a prosecutor is listening. Because they might be.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    category: "Facts about the incident",
                    examples: '"I didn\'t do it," "I wasn\'t there," "It was self-defense," "They started it" — all of these open the door to cross-examination and can be twisted out of context.',
                  },
                  {
                    category: "Alibi information",
                    examples: "Don't tell anyone where you were or who you were with — share that only with your attorney.",
                  },
                  {
                    category: "Other people involved",
                    examples: "Don't mention co-defendants, witnesses, or anyone else who may have been present.",
                  },
                  {
                    category: "Evidence",
                    examples: "Don't ask anyone to find, move, destroy, or hold onto any item related to the incident.",
                  },
                  {
                    category: "Contact with the alleged victim",
                    examples: "Never ask someone to pass along a message, apology, or explanation to the alleged victim or their family.",
                  },
                  {
                    category: "Frustration about the case",
                    examples: '"The police lied," "The witness is wrong," "They don\'t have any real evidence" — prosecutors can use these statements to establish consciousness of guilt.',
                  },
                ].map(({ category, examples }) => (
                  <li key={category} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 text-red-500 font-medium">–</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{category}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{examples}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Alert className="border-red-300 bg-red-50 dark:bg-red-950/20 mt-2">
                <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Speaking in code doesn't work.</strong> Law enforcement investigators are specifically trained to interpret coded language, and a jury can draw adverse inferences from evasive speech.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 4: Ongoing calls */}
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Calls While in Custody</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Every subsequent call is subject to the same rules. Some guidelines for ongoing communication:
              </p>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Do</p>
                <ul className="space-y-2 mb-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    <span>Keep calls to practical matters: court dates, money for commissary, updates on legal counsel, family wellbeing.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    <span>Ask your attorney which topics are safe to discuss with family, and which should only go through them.</span>
                  </li>
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Avoid</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    <span>Don't vent about the case, the charges, or the police — even when you're frustrated.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    <span>Don't ask for case updates via phone — prosecutors can subpoena information your family relays back to you.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    <span>Don't assume that text messages, letters, or emails from jail are any more private than phone calls — they aren't.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 5: Attorney calls */}
        <ScrollReveal>
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-300">
                Calls with Your Attorney
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Calls to your attorney are protected by attorney-client privilege and <em>should not</em> be recorded or monitored. However, you should still take precautions:
              </p>
              <ul className="space-y-2">
                {[
                  "Verify with your attorney that the line is designated as an attorney-client call — some facilities require advance registration of attorney phone numbers.",
                  "Ask your attorney explicitly what is and isn't safe to discuss over the phone.",
                  "If you believe your attorney calls are being recorded, tell your attorney immediately — this can be grounds for a serious legal challenge.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5">–</span>
                    {text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Related */}
        <ScrollReveal>
          <div className="mt-4 border-t border-border pt-10">
            <h2 className="text-lg font-semibold mb-3">{t('jailPhoneCall.relatedGuides')}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/first-24-hours", icon: Clock, title: "Your First 24 Hours" },
                { href: "/rights-info", icon: Shield, title: "Your Constitutional Rights" },
                { href: "/process", icon: Scale, title: "Criminal Justice Process" },
                { href: "/friends-family", icon: Users, title: "Guide for Friends & Family" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal>
          <Alert className="mt-8 border-slate-200 dark:border-slate-700">
            <BrandShieldIcon size={16} />
            <AlertDescription className="text-muted-foreground text-sm">
              This guide provides general information only and does not constitute legal advice. Laws and practices vary by jurisdiction. Consult a licensed attorney about your specific situation.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
