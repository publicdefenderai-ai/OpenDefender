import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClickToCallProps {
  phoneNumber: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  "data-testid"?: string;
}

export function ClickToCall({
  phoneNumber,
  label,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
  "data-testid": testId,
}: ClickToCallProps) {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
  const displayNumber = label || phoneNumber;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "gap-2",
        variant === "default" && "bg-green-600 hover:bg-green-700 text-white",
        className
      )}
      asChild
      data-testid={testId}
    >
      <a href={`tel:${cleanNumber}`}>
        {showIcon && <Phone className="h-4 w-4" />}
        {displayNumber}
      </a>
    </Button>
  );
}

interface ClickToCallLinkProps {
  phoneNumber: string;
  className?: string;
  "data-testid"?: string;
}

export function ClickToCallLink({
  phoneNumber,
  className,
  "data-testid": testId,
}: ClickToCallLinkProps) {
  const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

  return (
    <a
      href={`tel:${cleanNumber}`}
      className={cn(
        "inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline transition-colors font-medium",
        className
      )}
      data-testid={testId}
    >
      <Phone className="h-3.5 w-3.5" />
      {phoneNumber}
    </a>
  );
}
