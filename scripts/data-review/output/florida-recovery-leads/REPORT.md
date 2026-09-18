# Official authority recovery leads

**Status:** Development evidence only. Nothing here activates a runtime record, clears an existing hold, or constitutes legal approval.

## Result

Five bounded requests with no retries recovered official responses for all assigned missing authorities. Raw HTML, response provenance, retrieval timestamps, publisher-currentness markers, and SHA-256 hashes are retained in this directory. See `acquisition-receipt.json` for the complete receipt and `findings.json` for machine-readable conclusions.

| Authority | Official route and currentness evidence | Raw SHA-256 |
|---|---|---|
| Fla. Stat. § 381.986 | Florida Senate year-addressed route; title, breadcrumb, and heading say **2026 Florida Statutes** | `08cd43b0d67b2bbe8b1e2a0f3da740a615d7c617fefcee5411103fac8430bb6c` |
| Fla. Stat. § 39.01 | Florida Senate year-addressed route; title, breadcrumb, and heading say **2026 Florida Statutes** | `fdd4bf7dc3bd0126ae87983067b42207d688a77c75b68e5a55c19e628a06d439` |
| 21 U.S.C. § 802 | OLRC preliminary section; embedded `currentthrough:20260413_119-83` | `496d64307ccdd9b3d30d53d00d1f4495f6e3fe90c2c51a1598fe9e5372100c09` |
| 21 U.S.C. § 822 | OLRC preliminary section; embedded `currentthrough:20260413_119-83` | `4b3f009a3d54105d6f9a7982091a10e13ecd7922411f89cc4958bf588836fe1c` |
| 21 U.S.C. § 830 | OLRC preliminary section; embedded `currentthrough:20260413_119-83` | `eeda5b3f5647ccb2d3e19cb4022d2cda757dd0ef694b213e3b72f3371f9c4365` |

The Florida route is the official Florida Senate's explicitly year-addressed statute page, not the Online Sunshine exact-section or whole-chapter routes that previously returned a 2016 response for § 381.986. The federal route is the official Office of the Law Revision Counsel preliminary-edition section view.

## Currentness boundary

Retrieval time and edition currency are distinct:

- Florida pages were retrieved on September 18, 2026, but their current-edition evidence is the publisher's explicit **2026 Florida Statutes** identity.
- Federal pages were retrieved on September 18, 2026, but the represented preliminary release point is only **April 13, 2026 / Public Law 119-83**, as encoded by the publisher. The later retrieval date must not be treated as a later codification cutoff.

## Effect on held scopes

- **§ 893.13(3): source support now exists.** Current-edition § 381.986 is no longer acquisition-missing. The scope remains held until the exact medical-marijuana exclusion and relevant boundaries are extracted, reviewed, hashed into the shared dependency model, and approved.
- **§ 893.147(7): source support now exists.** The new responses cover the missing § 381.986 and 21 U.S.C. §§ 802, 822, and 830 dependencies. The scope remains held pending narrow subdivision extraction, cross-reference validation, shared-cache/analysis integration, integrity checks, and approval.
- **§ 827.04(1): source support now exists.** Current-edition § 39.01 is no longer acquisition-missing. The scope remains held pending exact dependent-child definition extraction, review of nested dependencies, integration, integrity checks, and approval.

No existing shared cache, ledger, analysis output, eligibility file, or runtime file was changed. A later owner must deliberately integrate reviewed documents and hashes into those artifacts; merely copying these raw pages would not satisfy the existing source-document contract.