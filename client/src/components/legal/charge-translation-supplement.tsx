import { translationSupplementNotice } from '@shared/translation-unavailable-notice';

export function ChargeTranslationSupplement({text, language}: {text?: string; language: string}) {
  if (!text) return null;
  return (
    <div className="mt-2 rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed" data-testid="charge-translation-supplement">
      <p className="font-medium mb-2" role="status">{translationSupplementNotice(language)}</p>
      <p lang="en">{text}</p>
    </div>
  );
}
