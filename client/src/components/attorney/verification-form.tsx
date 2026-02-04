/**
 * Attorney Verification Form
 *
 * Form component for attorney attestations.
 * No bar credentials are collected or stored - only attestations.
 */

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

import { useAttorneySession } from "@/hooks/use-attorney-session";

const formSchema = z.object({
  isLicensedAttorneyActingForClient: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm you are a licensed attorney acting on behalf of a client",
    }),
  }),
  understandsPrivilegeRequirements: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge privilege requirements",
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isLicensedAttorneyActingForClient: false as unknown as true,
      understandsPrivilegeRequirements: false as unknown as true,
    },
  });

  const onSubmit = async (data: FormData) => {
    clearError();

    const success = await verify({
      isLicensedAttorney: data.isLicensedAttorneyActingForClient,
      actingOnBehalfOfClient: data.isLicensedAttorneyActingForClient,
      understandsPrivilegeRequirements: data.understandsPrivilegeRequirements,
      acceptsTermsOfService: true,
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
            name="isLicensedAttorneyActingForClient"
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
                      "I am a licensed attorney in good standing with my state bar association, and I am accessing these tools on behalf of a client I represent."
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
