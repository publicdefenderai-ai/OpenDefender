import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  FileText, 
  Clock, 
  UserCheck, 
  Home, 
  CheckCircle, 
  XCircle, 
  Users, 
  Gavel, 
  BookOpen,
  Eye,
  ArrowRight,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function ImmigrationGuidance() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-amber-600 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Immigration Enforcement<br />
              <span className="text-amber-200">Know Your Rights</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-4xl mx-auto leading-relaxed">
              Essential rights information for both citizens and non-citizens during ICE encounters and deportation proceedings
            </p>
          </motion.div>

          <ScrollReveal delay={0.2}>
            <Alert className="bg-red-600 border-red-700 text-white max-w-4xl mx-auto mb-8">
              <AlertTriangle className="h-5 w-5 text-white" />
              <AlertDescription className="text-white font-semibold">
                <strong>CRITICAL:</strong> These rights apply to ALL persons in the United States, regardless of citizenship status.
                You have constitutional protections even during immigration enforcement actions.
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      {/* Emergency Rights Section */}
      <section className="py-16 bg-red-50 dark:bg-red-950">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-red-800 dark:text-red-200 mb-6">
                Immediate Rights During ICE Encounters
              </h2>
              <p className="text-xl text-red-700 dark:text-red-300">
                These rights apply to EVERYONE - citizens, non-citizens, documented, and undocumented persons
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-red-200 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                    <Shield className="mr-2 h-6 w-6" />
                    Constitutional Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Right to Remain Silent:</strong> You do NOT have to answer questions about your immigration status, nationality, or where you were born.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Right to Refuse Searches:</strong> You can refuse to consent to a search of yourself, belongings, car, or home.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Right to an Attorney:</strong> You have the right to speak with an attorney before answering questions.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Right to Interpreter:</strong> You have the right to an interpreter during proceedings.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
                    <XCircle className="mr-2 h-6 w-6" />
                    What NOT to Do
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Don't lie or provide false documents:</strong> This can be used against you in immigration court.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Don't run or resist:</strong> This can lead to additional criminal charges.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Don't sign anything:</strong> Without understanding what it says or speaking to an attorney first.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Don't carry foreign documents:</strong> Unless required by law (like a driver's license).
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Deportation Process Phases */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Deportation Process Phases
              </h2>
              <p className="text-xl text-muted-foreground">
                Understanding each stage of immigration enforcement proceedings
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Phase 1: Initial Encounter */}
            <ScrollReveal delay={0.1}>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                    <Eye className="mr-2 h-6 w-6" />
                    Phase 1: Initial ICE Encounter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Your Rights:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Ask if you are free to leave
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Request to see a warrant before allowing entry to your home
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Remain silent about immigration status
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Request an attorney immediately
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">What to Expect:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• ICE agents may approach at home, work, or in public</li>
                        <li>• They may ask for identification and immigration documents</li>
                        <li>• Administrative warrant ≠ judicial warrant</li>
                        <li>• You may be detained if they believe you're removable</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 2: Detention */}
            <ScrollReveal delay={0.2}>
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                    <Users className="mr-2 h-6 w-6" />
                    Phase 2: Immigration Detention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Your Rights in Detention:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to make phone calls to family and attorney
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to contact your consulate (non-citizens)
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to interpreters during proceedings
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to be informed of charges against you
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to request bond hearing (in most cases)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Important to Know:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Detention can last weeks, months, or longer</li>
                        <li>• You will receive a Notice to Appear (NTA)</li>
                        <li>• Some people are subject to mandatory detention</li>
                        <li>• Bond amounts vary widely ($1,500 - $25,000+)</li>
                        <li>• Certain criminal convictions affect bond eligibility</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 3: Immigration Court */}
            <ScrollReveal delay={0.3}>
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                    <Gavel className="mr-2 h-6 w-6" />
                    Phase 3: Immigration Court Proceedings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Court Rights:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to an attorney (at your own expense)
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to an interpreter
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to examine evidence against you
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to present evidence and witnesses
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Right to appeal negative decisions
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Possible Outcomes:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Relief from removal:</strong> Asylum, cancellation, adjustment</li>
                        <li>• <strong>Voluntary departure:</strong> Leave at your own expense</li>
                        <li>• <strong>Removal order:</strong> Forced deportation</li>
                        <li>• <strong>Continuances:</strong> Case postponed for various reasons</li>
                        <li>• <strong>Administrative closure:</strong> Case temporarily closed</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 4: Appeals and Final Removal */}
            <ScrollReveal delay={0.4}>
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800 dark:text-red-200">
                    <FileText className="mr-2 h-6 w-6" />
                    Phase 4: Appeals and Final Removal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Appeal Rights:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          30-day deadline to file appeal to Board of Immigration Appeals (BIA)
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Possible federal court review after BIA decision
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Stay of removal while appeal is pending (if requested)
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          Motions to reopen/reconsider in certain circumstances
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Final Removal Process:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• ICE schedules removal date after final order</li>
                        <li>• 90-day removal period (can be extended)</li>
                        <li>• Countries may refuse to accept returnees</li>
                        <li>• Some individuals may be released under supervision</li>
                        <li>• Future entry to U.S. may be barred for years</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Special Protections */}
      <section className="py-16 bg-green-50 dark:bg-green-950">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-200 mb-6">
                Special Protections
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300">
                Additional rights and protections for vulnerable populations
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                    <UserCheck className="mr-2 h-5 w-5" />
                    U.S. Citizens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Cannot be deported (constitutional protection)</li>
                    <li>• May be detained if identity is questioned</li>
                    <li>• Should carry proof of citizenship</li>
                    <li>• Contact family/attorney immediately if detained</li>
                    <li>• File complaints if rights violated</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                    <Users className="mr-2 h-5 w-5" />
                    Vulnerable Populations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Pregnant women:</strong> Special custody determination</li>
                    <li>• <strong>Nursing mothers:</strong> Extended family detention alternatives</li>
                    <li>• <strong>Minors:</strong> Special procedures and protections</li>
                    <li>• <strong>Mentally ill:</strong> Competency evaluations required</li>
                    <li>• <strong>Victims of trafficking:</strong> Special visa protections</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                    <Home className="mr-2 h-5 w-5" />
                    Sanctuary Jurisdictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Local policies limiting ICE cooperation</li>
                    <li>• Advance notice of ICE operations (some areas)</li>
                    <li>• Know your local jurisdiction's policies</li>
                    <li>• ICE can still operate in sanctuary areas</li>
                    <li>• Contact local immigrant rights groups</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Emergency Resources & Contacts
              </h2>
              <p className="text-xl text-muted-foreground">
                Critical phone numbers and resources for immigration emergencies
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                    <Phone className="mr-2 h-6 w-6" />
                    National Hotlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">National Immigration Forum</strong>
                      <p className="text-2xl font-bold text-blue-600">1-800-954-6287</p>
                      <p className="text-sm text-muted-foreground">24/7 deportation defense hotline</p>
                    </div>
                    <div>
                      <strong className="text-lg">ACLU</strong>
                      <p className="text-2xl font-bold text-blue-600">Text "IMMIGRANT" to 88823</p>
                      <p className="text-sm text-muted-foreground">Know your rights information</p>
                    </div>
                    <div>
                      <strong className="text-lg">United We Dream</strong>
                      <p className="text-2xl font-bold text-blue-600">1-844-363-1423</p>
                      <p className="text-sm text-muted-foreground">Legal assistance referrals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                    <FileText className="mr-2 h-6 w-6" />
                    Government Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">Executive Office for Immigration Review</strong>
                      <p className="text-2xl font-bold text-green-600">1-800-898-7180</p>
                      <p className="text-sm text-muted-foreground">Court information automated system</p>
                    </div>
                    <div>
                      <strong className="text-lg">ICE Detainee Locator</strong>
                      <p className="text-lg font-bold text-green-600">ice.gov/detain/ice-ero/locate-detainee</p>
                      <p className="text-sm text-muted-foreground">Find detained family members</p>
                    </div>
                    <div>
                      <strong className="text-lg">Legal Orientation Program</strong>
                      <p className="text-lg font-bold text-green-600">vera.org/know-your-rights</p>
                      <p className="text-sm text-muted-foreground">Free legal education in detention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Create a Safety Plan:</strong> Prepare emergency contacts, important documents, and care arrangements for children/dependents. Share this plan with trusted family members or friends in case of detention.
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Important Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Immigration law is complex and constantly changing. Individual circumstances vary significantly. Always consult with a qualified immigration attorney for your specific situation. This information is based on federal law as of 2024 and may not reflect the most recent changes.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-8">
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Return to Main Legal Guidance
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}