# Ohio residual subdivision verification

This packet advances all fourteen unpublished mappings from the first major-offense batch. It does not add selectable charges, renew evidence, or repeat resolved attorney questions.

| Section | Scope | Statutory identity | Penalty branches |
| --- | --- | --- | --- |
| 2905.01 | A,B | kidnapping | C(1), C(2), C(3) |
| 2905.02 | A,B | abduction | C |
| 2905.11 | B | extortion | C |
| 2905.11 | D | sexual extortion | E(1), E(2), E(3) |
| 2905.22 | A(1) | Extortionate extension of credit - criminal usury | B |
| 2905.22 | A(2) | Extortionate extension of credit - criminal usury | B |
| 2905.22 | A(3) | Extortionate extension of credit - criminal usury | B |
| 2905.32 | A | trafficking in persons | E |
| 2905.33 | A | unlawful conduct with respect to documents | B |
| 2909.02 | A | aggravated arson | B(2), B(3) |
| 2909.03 | A,B | arson | D(2), D(3), D(4) |
| 2909.04 | A(1),A(2),B | disrupting public services | C |
| 2909.05 | A,B,C,D | vandalism | E |
| 2909.07 | A(1)-A(6) | Criminal mischief | C(2), C(3) |

## Material corrections

- Abduction now binds the sexual-motivation definition to 2971.01, preserving the same correction already merged for unlawful restraint.
- Document servitude retains all nine listed predicate sections, including 2907.321, 2907.322 and 2907.323.
- Extortion retains both listed menacing predicates. Sexual-extortion definitions and allied-offense language have their supporting state sections attached.
- Trafficking retains its actual local developmental-disability definition and its 2929.01 material/performance definition, instead of treating 5123.01 as the incorporated definition.
- The three usury entries now bind only their own numbered conduct paragraph. Public-service disruption excludes A(3); criminal mischief excludes A(7). Whole sections remain separately labeled context.
- The 2133.21(F) emergency-personnel definition is bound to 2909.04(D)(1) as excluded-branch context. It does not clear the unresolved 3727.01 dependency.

## Penalty distinctions retained

### 2905.01: kidnapping (A,B)

- C(1): F1 ordinarily; safe unharmed release reduces only A(1)-A(5), B(1), B(2). A(6) is not reduced.
- C(2): Trafficking specification: mandatory term and restitution under the expressly cited sentencing provisions; C(3) takes precedence.
- C(3): Victim under thirteen plus sexual-motivation specification: minimum fifteen years to life, or ten years to life on safe unharmed release. Not an ordinary F1 range.

### 2905.02: abduction (A,B)

- C: A(1)/A(2) and corresponding B: F3; A(3) and corresponding B: F2. Trafficking specification separately changes mandatory custody and restitution.

### 2905.11: extortion (B)

- C: Extortion in B; no grade inherited from sexual extortion in D.

### 2905.11: sexual extortion (D)

- E(1): Ordinary branch, subject to E(2)/E(3).
- E(2): Prior D violation or specified minor/elderly/disabled victim, subject to E(3).
- E(3): Two or more prior D violations, or the separately stated prior protected-victim offense and knowledge condition; preserve exact statutory conjunctions.

### 2905.22: Extortionate extension of credit - criminal usury (A(1))

- B: Only A(1): knowingly making or participating in extortionate credit.

### 2905.22: Extortionate extension of credit - criminal usury (A(2))

- B: Only A(2): knowingly engaging in criminal usury; definition includes exceptions for legally authorized rates and immediate family.

### 2905.22: Extortionate extension of credit - criminal usury (A(3))

- B: Only A(3): knowing possession of the specified transaction records; do not inherit F4 from siblings.

### 2905.32: trafficking in persons (A)

- E: Special 10-15-year selected term/minimum, not the ordinary F1 minimum. Before March 22, 2019 definite; on/after that date indefinite under 2929.14 and 2929.144.

### 2905.33: unlawful conduct with respect to documents (A)

- B: F3; each of the nine listed predicate sections remains attached as conduct evidence, not a separately published charge.

### 2909.02: aggravated arson (A)

- B(2): A(1) or A(3).
- B(3): A(2).

### 2909.03: arson (A,B)

- D(2): A(1)/B(1): M1 below $1,000 property value/harm; F4 at $1,000 or more.
- D(3): A(2), A(3), A(5), A(6), or B(3).
- D(4): A(4) or B(2).

### 2909.04: disrupting public services (A(1),A(2),B)

- C: Only A(1), A(2), B in candidate scope. A(3) remains excluded; its 2133.21 definition is retained as excluded-branch context, not clearance of 3727.01.

### 2909.05: vandalism (A,B,C,D)

- E: F5 ordinarily with expressly additional fine up to $2,500; F4 at $7,500 to below $150,000; F3 at $150,000 or more. Keep special fine separate from conventional sentencing fines.

### 2909.07: Criminal mischief (A(1)-A(6))

- C(2): A(1)-A(5): M3 ordinarily, M1 risk of harm; aircraft-property branches F5 risk, F4 substantial risk or occupied aircraft. Exact source conditions control.
- C(3): A(6): M1 ordinarily; F5 $1,000 to below $10,000 or specified aircraft risk; F4 $10,000 or more or specified aircraft substantial-risk/occupied branch. C(4)/A(7) excluded.

## Reuse and next step

Previously retained primary sources are reused without changing acquisition dates. Only two absent dependency documents were acquired: 2903.22 and 2907.323. Source bodies, exact spans, hashes, dates and URLs are retained in the JSON packets.
The historical mapping, twenty published definitions, and their receipt remain untouched. The new packet is the input for the next publication implementation; it does not claim that all exemptions, collateral consequences or recursive dependencies are cleared.

Verification: `node --import tsx scripts/data-review/ohio-residual-verification.ts --check` and `npx vitest run tests/ohio-residual-verification.test.ts`.
