import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  statusText,
  iconBgColor = "legal-blue"
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

  const getStatusColor = () => {
    switch (status) {
      case "live":
      case "government":
        return "success-green";
      case "free":
        return "success-green";
      case "paid":
        return "legal-blue";
      case "mock":
      case "partial":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <Badge className={`${getStatusColor()} text-white text-xs`}>
              {getStatusIcon()}
              <span className="ml-1">{statusText}</span>
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className={`text-xs ${status === "mock" || status === "partial" ? "text-amber-600" : "text-" + getStatusColor().replace("bg-", "")}`}>
          {status === "live" && "✓ Live Integration"}
          {status === "free" && "✓ Free Access"}
          {status === "government" && "✓ Official Government Data"}
          {status === "paid" && "✓ Commercial API"}
          {status === "mock" && "⚠ Development Phase"}
          {status === "partial" && "⚠ Partial Completion"}
        </div>
      </CardContent>
    </Card>
  );
}
