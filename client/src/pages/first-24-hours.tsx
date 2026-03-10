import { Link } from "wouter";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandShieldIcon } from "@/components/brand-logo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Phone, Shield, Scale, MessageSquare } from "lucide-react";
import { LegalTerm } from "@/components/ui/legal-term";

interface StepProps {
  number: number;
  title: string;
  timeframe: string;
  context: string;
  dos: string[];
  donts: string[];
  isLast?: boolean;
  children?: React.ReactNode;
}

function Step({ number, title, timeframe, context, dos, donts, isLast, children }: StepProps) {
  return (
    <div className="relative">
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-9 h-9 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10">
            {number}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 min-h-[80px] mt-3" />
          )}
        </div>

        <div className="flex-1 pb-10">
          <div className="mb-3">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <span className="text-xs text-muted-foreground">{timeframe}</span>
          </div>

          <p className="text-muted-foreground mb-5 leading-relaxed text-sm">{context}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-emerald-200 dark:border-emerald-800/60">
                <div className="w-5 h-5 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Do</p>
              </div>
              <ul className="space-y-2.5">
                {dos.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-900/10 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-rose-200 dark:border-rose-800/60">
                <div className="w-5 h-5 rounded-full bg-rose-500 dark:bg-rose-600 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Don't</p>
              </div>
              <ul className="space-y-2.5">
                {donts.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/80 dark:text-foreground/75 flex items-start gap-2.5">
                    <X className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default function FirstTwentyFourHours() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white">
            {t('first24Hours.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('first24Hours.subtitle')}
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        <ScrollReveal>
          <Alert className="mb-10 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>One rule applies to every step below:</strong> {t('first24Hours.alert')}
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        <ScrollReveal delay={0.02}>
          <div className="mb-8 rounded-lg border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 p-5">
            <h3 className="text-base font-bold text-amber-800 dark:text-amber-200 mb-3">If the person arrested is under 18</h3>
            <p className="text-sm text-amber-900 dark:text-amber-100 mb-3">The juvenile justice system works differently in important ways:</p>
            <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span><strong>Police must notify parents or guardians</strong> before questioning a juvenile. If you are a minor, ask for your parent immediately.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span><strong>You may be held in a juvenile facility</strong> rather than an adult jail, depending on the charges and your age.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span><strong>Juvenile court is separate</strong> from adult criminal court — the process, rights, and outcomes differ significantly.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span><strong>Do not waive your rights</strong> — juveniles are especially vulnerable during interrogation. Invoke your right to remain silent and ask for your parent and an attorney before answering any questions.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 flex-shrink-0">•</span><span>If charges are serious, prosecutors may seek to try you as an adult — your attorney must fight this.</span></li>
            </ul>
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal delay={0.05}>
            <Step
              number={1}
              title="At the Moment of Arrest"
              timeframe="Immediately"
              context="Police are detaining you. Your rights exist right now, but they only protect you if you use them."
              dos={[
                'Say clearly: "I am invoking my right to remain silent" and "I want a lawyer."',
                "Comply physically — do not resist, even if you believe the arrest is unlawful.",
                "Try to remember badge numbers, officer names, and everything that happens.",
              ]}
              donts={[
                'Don\'t try to explain, justify, or "clear things up" — anything you say can be used against you.',
                "Don't consent to any search of your person, vehicle, or home.",
                "Don't argue about whether the arrest is legal — that is your attorney's job.",
              ]}
            >
              <p className="text-sm text-muted-foreground mt-2">
                Your Fifth Amendment right to remain silent and your Sixth Amendment right to counsel apply from the moment of arrest — you don't need to wait for <LegalTerm term="Miranda rights">Miranda warnings</LegalTerm>.{" "}
                <Link href="/rights-info" className="underline hover:text-foreground transition-colors">Learn more about your rights →</Link>
              </p>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Step
              number={2}
              title="Booking"
              timeframe="Within a few hours of arrest"
              context="You'll be taken to a police station or jail for processing: fingerprints, photographs, personal property inventoried, and charges entered into the system."
              dos={[
                "Cooperate with the mechanical booking process (fingerprints, photos, property).",
                "Note the name of the facility, your booking number, and the charges — you'll need this information.",
                "Ask how family can find out where you are being held and how to contact you.",
                "If you take medication or have a medical condition, tell booking staff IN WRITING right away and ask to speak to medical staff. Jails are legally required to provide essential medication — document every request.",
                "In most states you have the right to a phone call within 3 hours of booking.",
                'If you don\'t speak English fluently, clearly say "I need an interpreter" — you have the right to one at no cost.',
                'Invoke your right to remain silent for anything beyond your name and date of birth. Booking intake questions ("where were you tonight?") are interrogation.',
              ]}
              donts={[
                "Don't discuss your case with anyone — other detainees, intake officers, or jail staff.",
                "Don't sign anything you don't understand. You can ask what a form is for.",
                "Don't assume booking staff are neutral — everything is documented.",
                "Don't answer questions about the incident, your whereabouts, or anyone else involved — even questions that seem routine or unrelated to the crime.",
                "Don't consent to DNA swabs, additional searches, or interrogations beyond the mechanical booking process without asking to speak to your attorney first.",
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <Step
              number={3}
              title="Your First Phone Call"
              timeframe="During or shortly after booking"
              context="You'll typically be allowed at least one phone call. This call is almost certainly being recorded. Use it wisely."
              dos={[
                "Call a family member or trusted friend — give them: (1) where you are held, (2) your booking number, (3) the charges, (4) ask them to find a lawyer or contact the public defender's office.",
                "Keep the call short and practical.",
                "Ask family to write everything down and start finding legal help immediately.",
              ]}
              donts={[
                'Don\'t say anything about what happened — even "I didn\'t do it" can be used.',
                "Don't ask anyone to destroy evidence, move your car, or warn other people.",
                "Don't call the alleged victim, even to apologize.",
              ]}
            >
              <p className="text-sm text-muted-foreground mt-2">
                <Link href="/jail-phone-call" className="underline hover:text-foreground transition-colors">Jail Phone Call Guide — what to say and what never to say →</Link>
              </p>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Step
              number={4}
              title="Bail Hearing"
              timeframe="Usually within 24–48 hours"
              context="A judge will set the conditions of your release — or deny bail. This is often one of the most important early hearings because it determines whether you go home or stay in custody while your case proceeds."
              dos={[
                "If you have an attorney, have them argue for release on your own recognizance (OR) or lower bail.",
                "Be calm, respectful, and presentable. First impressions matter.",
                "If speaking, mention your ties to the community: family, job, how long you've lived in the area.",
              ]}
              donts={[
                "Don't say anything about the underlying facts of the case at the bail hearing.",
                "Don't waive your right to a bail hearing.",
                "Don't assume bail will be unaffordable — there are options if you can't pay.",
              ]}
            >
              <div className="mt-2">
                <p className="text-sm font-semibold text-foreground mb-3">If you can't afford <LegalTerm term="bail" /> — your options:</p>
                <ol className="space-y-2.5 text-sm text-foreground/80 dark:text-foreground/75 list-none">
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">1.</span><span><strong>Request OR release</strong> (<LegalTerm term="release on own recognizance" />) — ask your attorney to argue you are not a flight risk. No money required. Judge considers ties to community, employment, family.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">2.</span><span><strong>Request reduced bail</strong> — your attorney can argue bail is excessive relative to your income. Courts are required to consider your ability to pay.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">3.</span><span><strong>Bail fund</strong> — nonprofit organizations that pay bail for people who can't afford it. Search "[your city] bail fund" or ask your attorney. Money is typically recycled after your case ends.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">4.</span><span><strong>Bail bond company</strong> — a bondsman pays your full bail for a non-refundable fee (usually 10–15%). <strong>Warning:</strong> if you miss court, the bondsman can pursue you and take any collateral you pledged.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">5.</span><span><strong>Property bond</strong> — use home equity as collateral instead of cash. Risk: the court can place a lien on the property if you miss a hearing.</span></li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 font-bold">6.</span><span><strong>Remain in custody temporarily</strong> — sometimes the timeline to arraignment is short enough that fighting for release is less critical. Discuss with your attorney.</span></li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  <a href="/process#bail-guide" className="underline hover:text-foreground transition-colors">How bail works — types, options if you can't afford it, and conditions →</a>
                </p>
              </div>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <Step
              number={5}
              title="Getting Legal Representation"
              timeframe="Before your arraignment"
              context="You have the right to an attorney at every critical stage of your case. If you cannot afford one, a public defender will be appointed. Do not wait — get this started immediately."
              dos={[
                "If you cannot afford an attorney, formally request a public defender at your first court appearance.",
                "If you can afford an attorney, have family start calling private criminal defense attorneys right away — many offer emergency consultations.",
                "When you do speak with your attorney, tell them everything. Those conversations are protected by attorney-client privilege.",
              ]}
              donts={[
                "Don't waive your right to counsel — representing yourself in a criminal case is almost never a good idea.",
                "Don't delay. The earlier an attorney is involved, the more they can do.",
                "Don't make any deals or statements to prosecutors without a lawyer present.",
              ]}
            >
              <div className="flex gap-4 mt-2 flex-wrap">
                <Link href="/?search=public-defender" className="text-sm underline hover:text-foreground transition-colors">Find a Public Defender →</Link>
                <Link href="/case-guidance" className="text-sm underline hover:text-foreground transition-colors">Get Personalized Guidance →</Link>
              </div>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Step
              number={6}
              title="Arraignment — Your First Court Appearance"
              timeframe="Within 48–72 hours (some states longer)"
              context="You will be formally read the charges against you and asked to enter a plea. This is not the time to fight your case — it is the time to preserve your options."
              dos={[
                'Plead "not guilty" at arraignment — unless your attorney has specifically advised otherwise after reviewing your case.',
                "This preserves every option available to you. You can always change a not-guilty plea later.",
                "Appear in clean, appropriate clothing if you have been released on bail.",
              ]}
              donts={[
                "Don't plead guilty at arraignment. You cannot take it back, and you haven't had time to evaluate the full case.",
                "Don't speak to the judge about the facts of your case.",
                "Don't miss this court date — a warrant will be issued for your arrest.",
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <Step
              number={7}
              title="Between Now and Your Next Court Date"
              timeframe="Ongoing"
              context="After arraignment, your case enters the pre-trial phase. What you do — and don't do — during this period matters."
              dos={[
                "Attend every court date without exception. Missing a hearing results in an arrest warrant and forfeiture of any bail.",
                "Follow every condition of your bail or release exactly — violations result in immediate re-arrest.",
                "Write down everything you remember about the incident as soon as possible while it is fresh.",
                "Communicate with your attorney promptly and honestly.",
              ]}
              donts={[
                "Don't contact any alleged victims or witnesses, even to apologize or explain.",
                "Don't post anything about your case on social media — prosecutors monitor this.",
                "Don't discuss your case with family or friends. Prosecutors can subpoena them to testify about what you said.",
                "Don't pick up any new charges — even minor incidents can affect your bail status and case outcome.",
              ]}
              isLast
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-4 border-t border-border pt-10">
            <h2 className="text-lg font-semibold mb-3">{t('first24Hours.relatedGuides')}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/jail-phone-call", icon: Phone, title: "Jail Phone Call Guide" },
                { href: "/process", icon: Scale, title: "Criminal Justice Process" },
                { href: "/rights-info", icon: Shield, title: "Your Constitutional Rights" },
                { href: "/case-guidance", icon: MessageSquare, title: "Get Personalized Guidance" },
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

        <ScrollReveal delay={0.5}>
          <Alert className="mt-8 border-slate-200 dark:border-slate-700">
            <AlertDescription className="text-muted-foreground text-sm">
              <div className="flex items-start gap-3">
                <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0 opacity-60" />
                <span>This guide provides general information only and does not constitute legal advice. Laws and procedures vary by state and jurisdiction. Always consult a licensed attorney about your specific situation.</span>
              </div>
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
