import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  AlertTriangle, 
  Chrome, 
  Download, 
  Shield, 
  Users, 
  DollarSign,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function RecapExtensions() {
  useScrollToTop();
  const { t } = useTranslation();

  const browsers = [
    {
      name: 'Google Chrome',
      icon: Chrome,
      url: 'https://chrome.google.com/webstore/detail/recap/oiillickanjlaeghobeeknbddaonmjnc',
      descKey: 'recapExtensions.install.chromeDesc'
    },
    {
      name: 'Microsoft Edge',
      icon: Chrome,
      url: 'https://chrome.google.com/webstore/detail/recap/oiillickanjlaeghobeeknbddaonmjnc',
      descKey: 'recapExtensions.install.edgeDesc'
    },
    {
      name: 'Firefox',
      icon: Download,
      url: 'https://addons.mozilla.org/en-US/firefox/addon/recap-195534/',
      descKey: 'recapExtensions.install.firefoxDesc'
    },
    {
      name: 'Safari',
      icon: Download,
      url: 'https://apps.apple.com/us/app/recap/id1600281788',
      descKey: 'recapExtensions.install.safariDesc'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      titleKey: 'recapExtensions.benefits.saveMoney',
      descKey: 'recapExtensions.benefits.saveMoneyDesc'
    },
    {
      icon: Users,
      titleKey: 'recapExtensions.benefits.helpCommunity',
      descKey: 'recapExtensions.benefits.helpCommunityDesc'
    },
    {
      icon: FileText,
      titleKey: 'recapExtensions.benefits.instantAccess',
      descKey: 'recapExtensions.benefits.instantAccessDesc'
    },
    {
      icon: Shield,
      titleKey: 'recapExtensions.benefits.openSource',
      descKey: 'recapExtensions.benefits.openSourceDesc'
    }
  ];

  const howItWorksSteps = [
    'recapExtensions.howItWorks.step1',
    'recapExtensions.howItWorks.step2',
    'recapExtensions.howItWorks.step3',
    'recapExtensions.howItWorks.step4'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('recapExtensions.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            {t('recapExtensions.hero.subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">{t('recapExtensions.disclaimer.title')}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              <strong>{t('recapExtensions.disclaimer.important')}</strong> {t('recapExtensions.disclaimer.text')}
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>{t('recapExtensions.disclaimer.items.security')}</li>
              <li>{t('recapExtensions.disclaimer.items.risk')}</li>
              <li>{t('recapExtensions.disclaimer.items.availability')}</li>
              <li>{t('recapExtensions.disclaimer.items.review')}</li>
            </ul>
            <p className="mt-3 font-medium">
              {t('recapExtensions.disclaimer.acknowledge')}
            </p>
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('recapExtensions.whatIsRecap.title')}</CardTitle>
            <CardDescription>
              {t('recapExtensions.whatIsRecap.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('recapExtensions.whatIsRecap.description1')}
            </p>
            <p className="text-muted-foreground">
              {t('recapExtensions.whatIsRecap.description2')}
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium mb-2">{t('recapExtensions.whatIsRecap.developedBy')}</p>
              <p className="text-sm text-muted-foreground">
                {t('recapExtensions.whatIsRecap.nonprofitDesc')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('recapExtensions.benefits.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t(benefit.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">{t(benefit.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('recapExtensions.howItWorks.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {howItWorksSteps.map((stepKey, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-muted-foreground pt-1">{t(stepKey)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t('recapExtensions.install.title')}</CardTitle>
            <CardDescription>
              {t('recapExtensions.install.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {browsers.map((browser, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <browser.icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{browser.name}</CardTitle>
                        <CardDescription className="text-xs">{t(browser.descKey)}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      asChild
                      data-testid={`button-install-${browser.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <a 
                        href={browser.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {t('recapExtensions.install.installFor', { browser: browser.name })}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('recapExtensions.install.afterInstalling')}</strong> {t('recapExtensions.install.afterInstallingDesc')}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('recapExtensions.learnMore.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <a 
                  href="https://free.law/recap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('recapExtensions.learnMore.officialWebsite')}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://www.courtlistener.com/recap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('recapExtensions.learnMore.browseArchive')}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://free.law/about/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('recapExtensions.learnMore.aboutFreeLaw')}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="/court-records" 
                  data-testid="link-search-recap"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {t('recapExtensions.learnMore.searchArchive')}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
