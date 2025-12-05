import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertTriangle, Info } from "lucide-react";

interface DataSourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "live" | "free" | "paid" | "mock" | "government" | "partial";
  statusText: string;
  iconBgColor?: string;
}

export function DataSourceCard({ 
  icon, 
  title, 
  description, 
  status, 
  statusText
}: DataSourceCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "live":
      case "free":
      case "government":
        return <Check className="h-3 w-3" />;
      case "mock":
      case "partial":
        return <AlertTriangle className="h-3 w-3" />;
      case "paid":
        return <Info className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "live":
      case "government":
      case "free":
        return "text-primary";
      case "paid":
        return "text-muted-foreground";
      case "mock":
      case "partial":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="bg-card border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">{title}</h3>
            <span className={`text-xs font-medium ${getStatusVariant()} flex items-center gap-1`}>
              {getStatusIcon()}
              {statusText}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
