import { useState } from "react";
import { Share2, Copy, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  "data-testid"?: string;
}

export function ShareButton({
  title,
  text,
  url,
  variant = "outline",
  size = "sm",
  className,
  "data-testid": testId,
}: ShareButtonProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || title;

  const canUseWebShare = typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
        toast({
          title: t("share.error", "Unable to share"),
          description: t("share.errorDescription", "There was a problem sharing this content."),
          variant: "destructive",
        });
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: t("share.copied", "Link copied!"),
        description: t("share.copiedDescription", "The link has been copied to your clipboard."),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying:", error);
      toast({
        title: t("share.copyError", "Unable to copy"),
        description: t("share.copyErrorDescription", "There was a problem copying the link."),
        variant: "destructive",
      });
    }
  };

  if (canUseWebShare) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={cn("gap-2", className)}
        data-testid={testId || "button-share"}
      >
        <Share2 className="h-4 w-4" />
        {size !== "icon" && t("share.share", "Share")}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          data-testid={testId || "button-share"}
        >
          <Share2 className="h-4 w-4" />
          {size !== "icon" && t("share.share", "Share")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {t("share.copyLink", "Copy link")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
                `${shareText}\n\n${shareUrl}`
              )}`,
              "_blank"
            )
          }
          className="gap-2 cursor-pointer"
        >
          <Link2 className="h-4 w-4" />
          {t("share.email", "Send via email")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ShareResourceProps {
  resourceTitle: string;
  resourceDescription?: string;
  className?: string;
  resourceId?: string;
}

export function ShareResource({
  resourceTitle,
  resourceDescription,
  className,
  resourceId,
}: ShareResourceProps) {
  const { t } = useTranslation();

  return (
    <ShareButton
      title={t("share.resourceTitle", "Check out this legal resource: {{title}}", {
        title: resourceTitle,
      })}
      text={resourceDescription || resourceTitle}
      variant="ghost"
      size="sm"
      className={className}
      data-testid={resourceId ? `button-share-${resourceId}` : "button-share-resource"}
    />
  );
}
