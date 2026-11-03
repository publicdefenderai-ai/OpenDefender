import { describe, it, expect } from 'vitest';
// Design copy modules sit outside en/es/zh.ts and must not escape parity checks.
const modules = import.meta.glob('../client/src/locales/*-design.ts', { eager: true });
function shape(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return [prefix];
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, child]) => shape(child, `${prefix}.${key}`));
  throw new Error(`Non-text locale leaf: ${prefix}`);
}
describe('standalone design locale modules', () => {
  it('discovers modules', () => expect(Object.keys(modules).length).toBeGreaterThan(3));
  for (const [file, module] of Object.entries(modules)) {
    for (const [name, value] of Object.entries(module as Record<string, any>)) {
      it(`${file}: ${name} has matching nonempty text in all locales`, () => {
        for (const locale of ['en', 'es', 'zh']) {
          expect(value[locale]).toBeDefined();
          expect(shape(value[locale]).sort()).toEqual(shape(value.en).sort());
          const leaves = (v: any): string[] => typeof v === 'string' ? [v] : Object.values(v).flatMap(leaves);
          expect(leaves(value[locale]).every(s => s.trim().length > 0)).toBe(true);
        }
      });
    }
  }
});
