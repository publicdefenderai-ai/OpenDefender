# Apparent statutory errors and source anomalies

This inventory records discrepancies in official source text separately from our interpretations. An apparent error is not a legislative correction or a judicial holding. Preserve the official text and version; never silently repair it. Future entries should include the literal reference, supporting sources, confidence/status, reviewer decision, and remaining research. Do not count ordinary parser failures as statutory errors.

## OH-001: Apparent exception cross-reference error in §4301.21(D)

- **Recorded:** September 24, 2026, following project-owner attorney review.
- **Status:** Apparent source cross-reference error; intended destination likely, not conclusively established.
- **Official source:** [§4301.21(D)](https://codes.ohio.gov/ohio-revised-code/section-4301.21) refers to §4301.62(B)(8).
- **Discrepancy:** The inspected §4301.62 has B(1)–(5), with the relevant qualifying-market exception at C(8). The [September 28, 2016 version](https://codes.ohio.gov/ohio-revised-code/section-4301.62/9-28-2016) also places that exception at C(8).
- **Likely interpretation:** [§4301.62(C)(8)](https://codes.ohio.gov/ohio-revised-code/section-4301.62), subject to its actual conditions, appears to be the intended exception.
- **Attorney decision:** Preserve the literal B(8) reference and label C(8) as the likely interpretation. Do not rewrite the statute.
- **Remaining agent work:** Complete enrolled-act history and any relevant interpretive-authority research; capture historical evidence to publication standard. Do not represent legislative intent as conclusively established.
- **Platform effect:** No automatic citation substitution, source-text change, or publication approval. Any eventual explanation must distinguish statutory text from interpretation.

### Snapshot traceability

The evidence is retained in the [dependency research ledger](../scripts/data-review/ohio-verification/dependency-review.json) and [base batch](../scripts/data-review/ohio-verification/batch-one.json). The following hashes identify the inspected statutory text, not a guarantee that the live website remains unchanged.

- §4301.21: effective date `2016-08-31`; SHA-256 `19a1c8ec66f15d0467037b2336548c3f4868e967ec2c6b7f9b5cdcdffaf7b4ec`.
- §4301.62: effective date `2024-04-30`; SHA-256 `e05b8c011c5d9c45903ae495ba4edc3a5c8a82157c29af6c766db39bbbbd2ce0`.

## CA-001: Overlapping 100-pound fireworks penalty bands in HSC §12700(b)

- **Recorded:** September 27, 2026, during the remaining California catalog pass.
- **Status:** Apparent boundary overlap; interpretation unresolved, no attorney decision yet.
- **Official source:** [HSC §12700(b)(2)–(3)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=12700.).
- **Discrepancy:** The 25–100-pound and 100–5,000-pound bands both include exactly 100 pounds of unaltered dangerous fireworks, gross including packaging. Their fine ranges and felony alternatives differ.
- **Treatment:** Preserve both literal bands. Do not silently change an inclusive endpoint or choose a penalty for the overlap.
- **Attorney question:** Identify controlling authority for exactly 100 pounds, or leave the boundary unresolved. See the [focused review questions](california-remaining-attorney-questions.md).
- **Traceability:** `scripts/data-review/output/california-batch-six-review.json`, `documents["HSC:12700"]`, retains official XML, version metadata, content hash, and URL from the September 24 snapshot.

## CA-002: Lifeguard definition points to the process-server paragraph

- **Recorded:** September 27, 2026, during the protected-person source review.
- **Status:** Apparent cross-reference error; no attorney decision or authoritative correction established.
- **Literal source:** [Penal Code §243(f)(7)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=243.) defines lifeguard by reference to paragraph (5) of §241(d).
- **Discrepancy:** In the same retained snapshot, [§241(d)(5)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=241.) defines process server; §241(d)(4) defines lifeguard.
- **Likely interpretation:** Paragraph (4) appears to be the intended destination. This is an editorial inference, not an attorney-approved or judicial interpretation.
- **Treatment:** Preserve the literal paragraph (5) reference. Do not silently change the statute or use the inferred destination to clear lifeguard-related publication. This batch adds only §243(c)(2)'s separately supported peace-officer injury branch, not the broader (b)/(c)(1) branches.
- **Remaining agent work:** Inspect amendment history and relevant interpretive authority before requesting any legal decision needed for publication.
- **Traceability:** `scripts/data-review/output/california-protected-person-review.json`, `sourceAnomalies[0]`, binds the three exact excerpts and source-version hashes to the September 24 archive. The source XML itself is unchanged.
