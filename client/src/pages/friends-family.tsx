import { motion } from "framer-motion";
import { Users, Phone, FileText, Clock, MapPin, AlertCircle, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function FriendsFamily() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-background">
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                <Users className="inline h-10 w-10 mr-2 mb-2" />
                Helping an Arrested Friend or Family Member
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Practical steps you can take to support someone who has been arrested or detained
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Immediate Actions */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="mb-12 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>First 24 Hours Are Critical:</strong> Quick action can make a significant difference in helping your loved one. Focus on gathering information, securing legal representation, and providing support.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Step-by-Step Action Plan
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            {/* Step 1 */}
            <ScrollReveal delay={0.2}>
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <span>Find Out Where They Are Being Held</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The first step is locating which facility is holding your loved one.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        How to Find Them:
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>• Call local police station or county jail</li>
                        <li>• Check online inmate locator (county sheriff website)</li>
                        <li>• Call the court clerk's office</li>
                        <li>• For federal arrests: call Federal Bureau of Prisons</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Information to Provide:
                      </h4>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>• Full legal name</li>
                        <li>• Date of birth</li>
                        <li>• Approximate date/time of arrest</li>
                        <li>• Location where arrested (if known)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={0.3}>
              <Card className="border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <span>Secure Legal Representation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Getting a lawyer involved early is one of the most important things you can do.
                  </p>
                  
                  <div className="space-y-3">
                    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <strong>Important:</strong> If they cannot afford an attorney, they have the right to a public defender. Don't delay - request one at the first court appearance (arraignment).
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Public Defender</h4>
                        <p className="text-sm text-muted-foreground">
                          Free for those who financially qualify. Request at arraignment or through court clerk.
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Legal Aid Organizations</h4>
                        <p className="text-sm text-muted-foreground">
                          Free or low-cost legal services for qualifying individuals.
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Private Attorney</h4>
                        <p className="text-sm text-muted-foreground">
                          Hired representation. Can be expensive but may offer more personalized attention.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={0.4}>
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <span>Gather Important Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Collect details that will help their attorney and prepare for court proceedings.
                  </p>
                  
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Key Information to Document:
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-purple-800 dark:text-purple-200">
                      <li>• Booking number/inmate number</li>
                      <li>• Charges filed against them</li>
                      <li>• Court date and time</li>
                      <li>• Bail amount (if set)</li>
                      <li>• Names of arresting officers</li>
                      <li>• Case number</li>
                      <li>• Name of assigned public defender (if applicable)</li>
                      <li>• Witness contact information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delay={0.5}>
              <Card className="border-l-4 border-l-orange-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      4
                    </div>
                    <span>Understand Bail and Bonding</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Bail allows temporary release from jail while awaiting trial.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">Bail Options:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>Cash Bail:</strong> Pay full amount to court (refunded after case ends)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>Bail Bond:</strong> Pay 10-15% to bondsman (non-refundable)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>Property Bond:</strong> Use property as collateral</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>Release on Recognizance:</strong> Released without payment (low flight risk)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Alert className="h-fit">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Bail Bondsman Warning:</strong> If you use a bondsman, you're responsible if the person doesn't appear in court. You could lose your collateral or be required to pay the full bail amount.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 5 */}
            <ScrollReveal delay={0.6}>
              <Card className="border-l-4 border-l-indigo-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      5
                    </div>
                    <span>Provide Ongoing Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Being arrested is stressful. Here's how you can help throughout the process.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                        Practical Help:
                      </h4>
                      <ul className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>• Attend court hearings for support</li>
                        <li>• Help gather character references</li>
                        <li>• Collect employment records</li>
                        <li>• Secure important documents</li>
                        <li>• Manage their affairs while detained</li>
                        <li>• Deposit money for commissary/phone calls</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Emotional Support:
                      </h4>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>• Stay in contact through approved channels</li>
                        <li>• Write letters if visits aren't possible</li>
                        <li>• Remain positive and encouraging</li>
                        <li>• Don't discuss case details on monitored calls</li>
                        <li>• Help them stay connected with family</li>
                        <li>• Support mental health needs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Important Warnings */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Important Reminders
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>Never Discuss Case Details on Jail Phones:</strong> All calls from jail are recorded and can be used as evidence. Only discuss the case with their attorney through approved confidential channels.
                </AlertDescription>
              </Alert>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Don't Try to Interfere:</strong> Never attempt to contact witnesses, destroy evidence, or interfere with the investigation. This can result in additional charges for both you and your loved one.
                </AlertDescription>
              </Alert>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Every situation is different. Consult with a qualified attorney for guidance specific to your loved one's case.
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
