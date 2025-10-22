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
import { Separator } from '@/components/ui/separator';

export default function RecapExtensions() {
  const browsers = [
    {
      name: 'Google Chrome',
      icon: Chrome,
      url: 'https://chrome.google.com/webstore/detail/recap/oiillickanjlaeghobeeknbddaonmjnc',
      description: 'Chrome Web Store'
    },
    {
      name: 'Microsoft Edge',
      icon: Chrome,
      url: 'https://chrome.google.com/webstore/detail/recap/oiillickanjlaeghobeeknbddaonmjnc',
      description: 'Via Chrome Web Store'
    },
    {
      name: 'Firefox',
      icon: Download,
      url: 'https://addons.mozilla.org/en-US/firefox/addon/recap-195534/',
      description: 'Firefox Add-ons'
    },
    {
      name: 'Safari',
      icon: Download,
      url: 'https://apps.apple.com/us/app/recap/id1600281788',
      description: 'Mac App Store'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Save Money',
      description: 'Access documents others have already purchased, reducing your PACER costs'
    },
    {
      icon: Users,
      title: 'Help the Community',
      description: 'Every document you buy from PACER is automatically saved to the free archive'
    },
    {
      icon: FileText,
      title: 'Instant Access',
      description: 'See which documents are free directly in PACER before you buy'
    },
    {
      icon: Shield,
      title: 'Open Source & Privacy Focused',
      description: 'Maintained by Free Law Project, a nonprofit dedicated to legal transparency'
    }
  ];

  const howItWorks = [
    'Install the RECAP extension for your browser',
    'When you search PACER, free documents from RECAP are highlighted',
    'If you purchase a document from PACER, RECAP automatically saves it to the archive',
    'Other RECAP users can then access that document for free'
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            RECAP Browser Extensions
          </h1>
          <p className="text-lg text-muted-foreground">
            Free browser tools to make court records more accessible and affordable
          </p>
        </div>

        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Third-Party Tool Disclaimer</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              <strong>Important:</strong> RECAP browser extensions are developed and maintained by 
              Free Law Project, an independent nonprofit organization. While we provide these links 
              for your convenience, please note:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>We are not responsible for the security, functionality, or privacy practices of the RECAP extensions</li>
              <li>Installation and use of these extensions is at your own risk</li>
              <li>We do not guarantee the availability or performance of these third-party tools</li>
              <li>Please review Free Law Project's own terms of service and privacy policy before installing</li>
            </ul>
            <p className="mt-3 font-medium">
              By clicking the links below, you acknowledge that you are leaving our site and accessing 
              a third-party service.
            </p>
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What is RECAP?</CardTitle>
            <CardDescription>
              RECAP turns PACER around (it's PACER spelled backwards!)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              RECAP is a suite of browser extensions that makes federal court records free and accessible. 
              When you use PACER (the federal court records system that charges per page), RECAP automatically 
              saves your purchases to a free, public archive. Anyone with RECAP installed can then access 
              those documents for free.
            </p>
            <p className="text-muted-foreground">
              With tens of thousands of users contributing, the RECAP Archive now contains millions of 
              federal court documents that would otherwise cost money to access. It's a crowdsourced 
              solution to making justice more accessible.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium mb-2">Developed by Free Law Project</p>
              <p className="text-sm text-muted-foreground">
                RECAP is maintained by Free Law Project, a 501(c)(3) nonprofit dedicated to making 
                legal materials more accessible through technology, data, and advocacy.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Why Use RECAP?</CardTitle>
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
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Install RECAP</CardTitle>
            <CardDescription>
              Choose your browser to install the extension
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
                        <CardDescription className="text-xs">{browser.description}</CardDescription>
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
                        Install for {browser.name}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>After installing:</strong> The extension works automatically in the background. 
                Just use PACER normally, and RECAP will show you which documents are free and save 
                your purchases to the archive.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Learn More</CardTitle>
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
                  RECAP Official Website
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://www.courtlistener.com/recap/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Browse RECAP Archive
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://free.law/about/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  About Free Law Project
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="/court-records" 
                  data-testid="link-search-recap"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Search RECAP Archive
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
