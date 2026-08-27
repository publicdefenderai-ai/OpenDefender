# California authoritative charge review

**Review boundary:** California statewide records exposed by the legacy selector, checked August 2026.

The legacy catalog exposed 115 California rows. They are now reconciled through
`shared/california-authority.ts`, which is the release boundary for California
selector data, citations, CALCRIM references, explanations, exports, and
guidance charge lookup.

## Source manifest

| Source | Use | Promotion requirement |
|---|---|---|
| [California Legislative Information](https://leginfo.legislature.ca.gov/) | Current Penal, Health and Safety, Vehicle, Business and Professions, Revenue and Taxation, Family, and Welfare and Institutions Code text | Required |
| [California Judicial Council CALCRIM](https://www.courts.ca.gov/partners/california-jury-instructions) | Element cross-check and jury-instruction reference where an applicable instruction is identified | Used where applicable |
| California Legislative Information code text and punishment provisions | Classification, grading, penalty, and effective-date cross-check | Required |

A working statute URL or matching instruction number is not treated as proof of
offense identity. Each selectable record must also state its official title,
exact code/subsection, elements, mental state, grading, penalty, currentness
evidence, source, and explicit attorney-review status.

## Reconciliation result

| Disposition | Count | Selector behavior |
|---|---:|---|
| Retain | 49 | Exposed as canonical statewide offense records |
| Alias | 7 | Legacy ID normalizes to an exact canonical record |
| Reselection required | 44 | Rejected at the input boundary; user must select the exact offense |
| Remove | 15 | Not exposed as criminal-charge selector records |
| **Total legacy rows** | **115** | Every row has one explicit disposition |

Removed or reselection-required rows include generic wire/mail/tax fraud
labels, ambiguous hit-and-run/trespass/loitering/fake-ID concepts, local or
regulatory matters, enhancement-only records, juvenile proceedings, and
accomplice-liability or attempt concepts without a specified target offense.
They remain in the inventory for auditability but cannot silently reach
charge-specific guidance.

## Review status

Statutory sourcing and currentness evidence are present for the 49 selectable
records. Attorney review is **pending for every selectable record**. The
dataset does not represent statutory sourcing as attorney approval; promotion
to attorney-reviewed content requires an explicit reviewer and review date.

The joined inventory is available from
`getCaliforniaReconciliationInventory()`. Release-gate tests verify that the
legacy count remains 115, canonical records have non-empty evidence, selector
results contain only approved records, aliases remain compatible, and
unsupported IDs fail closed.