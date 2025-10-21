import { useState } from "react";
import { Scale, HelpCircle, Menu, MessageSquare, Info, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Get Guidance",
      href: "/case-guidance",
      icon: MessageSquare,
      description: "Start personalized legal assessment"
    },
    {
      title: "Learn Your Rights",
      href: "/rights-info",
      icon: Info,
      description: "Understand your constitutional rights"
    },
    {
      title: "Immigration Assistance",
      href: "/immigration-guidance",
      icon: Globe,
      description: "Immigration enforcement guidance"
    }
  ];

  return (
    <header className="bg-background shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 legal-blue rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Public Defender AI</h1>
              <p className="text-sm text-muted-foreground">Free Legal Guidance & Rights Information</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/mission-statement">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-help"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground md:hidden"
                  data-testid="button-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-4 px-4"
                          data-testid={`menu-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 mt-0.5 text-blue-600" />
                            <div className="text-left">
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-sm text-muted-foreground font-normal">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
