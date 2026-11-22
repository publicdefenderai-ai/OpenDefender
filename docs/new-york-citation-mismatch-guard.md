# Interim New York citation identity safeguard

PR290's frozen inventory identifies fourteen Training-data overlays whose cited law/section does not match their existing exact-ID authority mapping. This narrow runtime change marks those fourteen overlays `needs_review`. Twelve were previously `high`, while two were already `medium` and already withheld by verified-citation helpers.

The citation strings, URLs, verification dates, source descriptions and instruction fields remain unchanged as historical metadata. No replacement citation is guessed, no charge is retired or substituted, and no catalog name, statutory code, grade, penalty or authority manifest is changed. This does not complete New York substantive review.

| Exact ID | Recorded overlay identity | Existing manifest identity |
| --- | --- | --- |
| `ny-alcohol-in-park` | ABC 106 | NYC 10-125 |
| `ny-computer-fraud` | PEN 156.27 | PEN 156.05 |
| `ny-conspiracy` | PEN 105.10 | PEN 105.00 |
| `ny-curfew-violation` | FCT 712 | NYC 10-222 |
| `ny-fake-id` | ABC 65-b | PEN 170.25 |
| `ny-forgery` | PEN 170.10 | PEN 170.05 |
| `ny-harassment-stalking` | PEN 240.26 | PEN 120.45 |
| `ny-insurance-fraud` | PEN 176.05 | PEN 176.15 |
| `ny-money-laundering` | PEN 470.05 | PEN 470.20 |
| `ny-possession-of-prohibited-weapon` | PEN 265.02 | PEN 265.01 |
| `ny-recidivist-enhancement` | PEN 70.10 | PEN 70.08 |
| `ny-solicitation` | PEN 230.04 | PEN 230.00 |
| `ny-theft-by-receiving` | PEN 165.40 | PEN 165.50 |
| `ny-trespass-after-warning` | PEN 140.05 | PEN 140.10 |

## Consumer checks and limits

The shared `isCitationVerified`, `getVerifiedCitation` and `getVerifiedSourceUrl` helpers now withhold these overlays. The current fourteen records have no high-confidence inline fallback and no instruction reference/URL; the tests assert both facts, so a future change cannot silently restore the disputed citation through those paths.

The case-guidance selector uses those helpers for citation labels and statute links. Dashboard charge details and site-search citation metadata use `getVerifiedCitation`; the canonical guidance classification builder omits its `code` field when that helper returns null. All fourteen retain their existing charge identities in classification output, with `verifiedCitation: null`. This is citation withholding, not charge withholding.

Raw catalog codes, existing explanatory content, saved historical text and database-backed source records are separate surfaces and are not certified or removed by this change. In particular, the AI-input builder's existing fallback to the catalog code and search body text containing catalog codes remain unchanged; neither reads the now-withheld overlay as a verified citation. A later substantive publication must reconcile identities, overlays and content together. This safeguard does not claim every New York citation or legal statement is now correct.

All existing reselection/source holds, receipts, eligibility and startup/import restrictions remain unchanged. No production inspection or operation occurred.

## Validation

- Six focused suites: **146 tests passed**, including six new exact-scope/consumer tests and existing guidance, PDF, citation and NY research tests.
- Typecheck and production build passed.
- The runtime diff changes only fourteen `confidence` values in `shared/criminal-charge-citations.ts`.
- Independent tests enumerate the exact fourteen IDs, compare them with the frozen inventory, preserve the original overlay fields and catalog identity, and assert null citation/source/instruction helpers plus omitted classification codes. A separate NY verified citation and another state's citation remain available.

No new browser run is claimed. These results establish the shared helper/classification behavior, not live deployment or complete New York legal accuracy.
