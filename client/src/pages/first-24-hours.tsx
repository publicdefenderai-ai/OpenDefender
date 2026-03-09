import {
  AlertTriangle,
  Check,
  X,
  Phone,
  Scale,
  Users,
  Clock,
  Shield,
  FileText,
  Gavel,
  Calendar,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  timeframe: string;
  context: string;
  dos: string[];
  donts: string[];
  isLast?: boolean;
  children?: React.ReactNode;
}

function Step({ number, icon, title, timeframe, context, dos, donts, isLast, children }: StepProps) {
  return (
    <div className="relative">
      <div className="flex items-start gap-5">
        {/* Timeline */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-white shadow-md z-10">
            {icon}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 min-h-[80px] mt-3" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {number}</span>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeframe}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-4 leading-relaxed">{context}</p>

          <div className="grid md:grid-cols-2 gap-3">
            {/* Do */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                Do
              </h4>
              <ul className="space-y-1.5">
                {dos.map((item, i) => (
                  <li key={i} className="text-sm text-green-900 dark:text-green-200 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don't */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-1.5">
                <X className="h-4 w-4" />
                Don't
              </h4>
              <ul className="space-y-1.5">
                {donts.map((item, i) => (
                  <li key={i} className="text-sm text-red-900 dark:text-red-200 flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            What to Do in Your First 24 Hours
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            A step-by-step guide from arrest through your first court appearance.
            The decisions made early in a case can have lasting consequences.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">

        {/* Top alert */}
        <ScrollReveal>
          <Alert className="mb-10 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>One rule applies to every step below:</strong> Do not discuss the facts of your case with anyone except your attorney — not police, not family, not cellmates, and not on the jail phone.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Steps */}
        <div>
          <ScrollReveal delay={0.05}>
            <Step
              number={1}
              icon={<AlertTriangle className="h-5 w-5" />}
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
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Your Fifth Amendment right</strong> to remain silent and your <strong>Sixth Amendment right</strong> to counsel apply from the moment of arrest. You don't need to wait for Miranda warnings to exercise them.{" "}
                    <Link href="/rights-info">
                      <span className="underline cursor-pointer hover:text-blue-700">Learn more about your rights →</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Step
              number={2}
              icon={<FileText className="h-5 w-5" />}
              title="Booking"
              timeframe="Within a few hours of arrest"
              context="You'll be taken to a police station or jail for processing: fingerprints, photographs, personal property inventoried, and charges entered into the system."
              dos={[
                "Cooperate with the mechanical booking process (fingerprints, photos, property).",
                "Note the name of the facility, your booking number, and the charges — you'll need this information.",
                "Ask how family can find out where you are being held and how to contact you.",
              ]}
              donts={[
                "Don't discuss your case with anyone — other detainees, intake officers, or jail staff.",
                "Don't sign anything you don't understand. You can ask what a form is for.",
                "Don't assume booking staff are neutral — everything is documented.",
              ]}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <Step
              number={3}
              icon={<Phone className="h-5 w-5" />}
              title="Your First Phone Call"
              timeframe="During or shortly after booking"
              context="You'll typically be allowed at least one phone call. This call is almost certainly being recorded. Use it wisely."
              dos={[
                "Call a family member or trusted friend — give them: (1) where you are held, (2) your booking number, (3) the charges, (4) ask them to find a lawyer or contact the public defender's office.",
                "Keep the call short and practical.",
                "Ask family to write everything down and start finding legal help immediately.",
              ]}
              donts={[
                "Don't say anything about what happened — even \"I didn't do it\" can be used.",
                "Don't ask anyone to destroy evidence, move your car, or warn other people.",
                "Don't call the alleged victim, even to apologize.",
              ]}
            >
              <Link href="/jail-phone-call">
                <Card className="border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium">Jail Phone Call Guide — what to say and what never to say</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Step
              number={4}
              icon={<Scale className="h-5 w-5" />}
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
              <a href="/process#bail-guide">
                <Card className="border-green-200 dark:border-green-800 hover:border-green-400 transition-colors cursor-pointer group bg-green-50/30 dark:bg-green-950/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Scale className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">How bail works — types, options if you can't afford it, and conditions</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                  </CardContent>
                </Card>
              </a>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <Step
              number={5}
              icon={<Users className="h-5 w-5" />}
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
              <div className="flex gap-3 flex-wrap">
                <Link href="/?search=public-defender">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Find a Public Defender
                  </Button>
                </Link>
                <Link href="/case-guidance">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Get Personalized Guidance
                  </Button>
                </Link>
              </div>
            </Step>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Step
              number={6}
              icon={<Gavel className="h-5 w-5" />}
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
              icon={<Calendar className="h-5 w-5" />}
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

        {/* Related resources */}
        <ScrollReveal delay={0.4}>
          <div className="mt-4 border-t border-border pt-10">
            <h2 className="text-xl font-semibold mb-5">Related guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  href: "/jail-phone-call",
                  icon: <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />,
                  title: "Jail Phone Call Guide",
                  desc: "What to say, what not to say, and how to use your call effectively",
                },
                {
                  href: "/process",
                  icon: <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
                  title: "Criminal Justice Process",
                  desc: "How bail works, plea bargains, and the full case timeline",
                },
                {
                  href: "/rights-info",
                  icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
                  title: "Your Constitutional Rights",
                  desc: "Miranda, search and seizure, and your rights at every stage",
                },
                {
                  href: "/case-guidance",
                  icon: <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
                  title: "Get Personalized Guidance",
                  desc: "Answer a few questions and get guidance specific to your situation",
                },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card className="hover:shadow-md hover:border-slate-400 transition-all cursor-pointer group h-full">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal delay={0.5}>
          <Alert className="mt-8 border-slate-200 dark:border-slate-700">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-muted-foreground text-sm">
              This guide provides general information only and does not constitute legal advice. Laws and procedures vary by state and jurisdiction. Always consult a licensed attorney about your specific situation.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
