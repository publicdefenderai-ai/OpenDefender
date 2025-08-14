import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface RightsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  href?: string;
  iconBgColor?: string;
}

export function RightsCard({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onClick,
  href,
  iconBgColor = "legal-blue"
}: RightsCardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</p>
        {href ? (
          <Link href={href}>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary-foreground hover:bg-primary font-medium text-sm p-0 h-auto"
              data-testid={`button-${buttonText.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {buttonText} <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            onClick={onClick}
            className="text-primary hover:text-primary-foreground hover:bg-primary font-medium text-sm p-0 h-auto"
            data-testid={`button-${buttonText.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {buttonText} <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
