export type LiveStatuteErrorKey = 'citationFailed' | 'invalidCitation' | 'citationNotFound';

export function getLiveStatuteErrorKey(
  error: unknown,
  responseError?: string,
): LiveStatuteErrorKey {
  const status = error instanceof Error
    ? Number(error.message.match(/^(\d{3}):/)?.[1])
    : undefined;
  const errorText = responseError?.toLowerCase() || '';

  if (status === 400 || errorText.includes('invalid citation')) {
    return 'invalidCitation';
  }
  if (status === 404 || errorText.includes('not found')) {
    return 'citationNotFound';
  }
  return 'citationFailed';
}