import { motion } from "framer-motion";
import { 
  Building2, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  FileText,
  Phone,
  Users,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function WorkplaceRaids() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link href="/immigration-guidance">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 mb-4" data-testid="button-back-immigration">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('immigration.hub.backButton')}
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center ring-1 ring-white/20">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">{t('immigration.raids.badge')}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-workplace-raids-title">
                  {t('immigration.raids.title')}
                </h1>
              </div>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-workplace-raids-subtitle">
              {t('immigration.raids.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 mb-8 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200" data-testid="alert-workplace-critical">
          <strong>{t('immigration.raids.criticalAlert')}</strong> {t('immigration.raids.criticalAlertText')}
        </AlertDescription>
      </Alert>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" data-testid="text-your-rights-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {t('immigration.raids.yourRights.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.yourRights.silent')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.silentText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.yourRights.refuse')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.refuseText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.yourRights.attorney')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.attorneyText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.yourRights.basis')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.basisText')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3" data-testid="text-what-not-to-do-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center ring-1 ring-red-500/20">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    {t('immigration.raids.whatNotToDo.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.whatNotToDo.run')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.runText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.whatNotToDo.falseDocs')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.falseDocsText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.whatNotToDo.lie')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.lieText')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground">{t('immigration.raids.whatNotToDo.sign')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.signText')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-employer-obligations-title">
              {t('immigration.raids.employer.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    {t('immigration.raids.employer.mustProvide')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.must1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.must2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.must3')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    {t('immigration.raids.employer.canDo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.can1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.can2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.can3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{t('immigration.raids.employer.can4')}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" data-testid="text-after-raid-title">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('immigration.raids.afterRaid.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{t('immigration.raids.afterRaid.detained')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t('immigration.raids.afterRaid.detained1')}</li>
                      <li>• {t('immigration.raids.afterRaid.detained2')}</li>
                      <li>• {t('immigration.raids.afterRaid.detained3')}</li>
                      <li>• {t('immigration.raids.afterRaid.detained4')}</li>
                      <li>• {t('immigration.raids.afterRaid.detained5')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('immigration.raids.afterRaid.notDetained')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• {t('immigration.raids.afterRaid.notDetained1')}</li>
                      <li>• {t('immigration.raids.afterRaid.notDetained2')}</li>
                      <li>• {t('immigration.raids.afterRaid.notDetained3')}</li>
                      <li>• {t('immigration.raids.afterRaid.notDetained4')}</li>
                      <li>• {t('immigration.raids.afterRaid.notDetained5')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">{t('immigration.raids.emergency.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('immigration.raids.emergency.subtitle')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.raids.emergency.nilc')}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">1-844-NILC-123</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.raids.emergency.aclu')}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">1-800-775-2258</p>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
