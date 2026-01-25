/**
 * Attorney Verification Form
 *
 * Form component for attorney attestations.
 * No bar credentials are collected or stored - only attestations.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Loader2, Shield, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAttorneySession } from "@/hooks/use-attorney-session";

const formSchema = z.object({
  isLicensedAttorney: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm you are a licensed attorney",
    }),
  }),
  actingOnBehalfOfClient: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm you are acting on behalf of a client",
    }),
  }),
  understandsPrivilegeRequirements: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge privilege requirements",
    }),
  }),
  acceptsTermsOfService: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms of Service",
    }),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface VerificationFormProps {
  onSuccess?: () => void;
}

export function VerificationForm({ onSuccess }: VerificationFormProps) {
  const { t } = useTranslation();
  const { verify, isLoading, error, clearError } = useAttorneySession();
  const [tosDialogOpen, setTosDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isLicensedAttorney: false as unknown as true,
      actingOnBehalfOfClient: false as unknown as true,
      understandsPrivilegeRequirements: false as unknown as true,
      acceptsTermsOfService: false as unknown as true,
    },
  });

  const onSubmit = async (data: FormData) => {
    clearError();

    const success = await verify({
      isLicensedAttorney: data.isLicensedAttorney,
      actingOnBehalfOfClient: data.actingOnBehalfOfClient,
      understandsPrivilegeRequirements: data.understandsPrivilegeRequirements,
      acceptsTermsOfService: data.acceptsTermsOfService,
    });

    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Attestation Checkboxes */}
        <div className="space-y-4 rounded-lg border p-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-slate-600" />
            <span className="font-medium text-sm">
              {t("attorneyPortal.verify.attestationsTitle", "Required Attestations")}
            </span>
          </div>

          <FormField
            control={form.control}
            name="isLicensedAttorney"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t(
                      "attorneyPortal.verify.attestation1",
                      "I am a licensed attorney in good standing with my state bar association."
                    )}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actingOnBehalfOfClient"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t(
                      "attorneyPortal.verify.attestation2",
                      "I am accessing these tools on behalf of a client I represent."
                    )}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="understandsPrivilegeRequirements"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t(
                      "attorneyPortal.verify.attestation3",
                      "I understand that attorney-client privilege protections depend on proper use of these tools."
                    )}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptsTermsOfService"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t("attorneyPortal.verify.attestation4", "I accept the")}{" "}
                    <Dialog open={tosDialogOpen} onOpenChange={setTosDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-blue-600 hover:underline"
                        >
                          {t("attorneyPortal.verify.termsOfService", "Terms of Service")}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {t("attorneyPortal.verify.tosTitle", "Attorney Tools Terms of Service")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("attorneyPortal.verify.tosSubtitle", "Please review before accepting.")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="prose prose-sm dark:prose-invert">
                          <p>
                            {t(
                              "attorneyPortal.verify.tosContent",
                              "By using these attorney tools, you acknowledge and agree to the following:"
                            )}
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>Documents are generated as drafts only and require professional review before filing.</li>
                            <li>You are solely responsible for verifying the accuracy of all generated content.</li>
                            <li>You must provide truthful attestation of your bar membership status.</li>
                            <li>We do not verify bar credentials against external databases.</li>
                            <li>We are not liable for any errors, omissions, or unauthorized use of these tools.</li>
                            <li>Attorney-client privilege protections depend on proper use by the attorney.</li>
                            <li>Misrepresenting bar membership may violate state bar rules and applicable laws.</li>
                          </ul>
                        </div>
                      </DialogContent>
                    </Dialog>
                    .
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Privacy Notice */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {t(
              "attorneyPortal.verify.privacyNotice",
              "Your session data will be automatically deleted after 30 minutes."
            )}
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("attorneyPortal.verify.verifying", "Verifying...")}
            </>
          ) : (
            t("attorneyPortal.verify.submit", "Verify and Continue")
          )}
        </Button>
      </form>
    </Form>
  );
}
