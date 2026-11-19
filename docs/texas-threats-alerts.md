# Texas threats and false emergency alerts

This candidate adds sixteen individually scoped choices under Penal Code §§22.07, 42.06 and 42.0601. The two retained 2025 DPS adult-arrest priorities are rank 44, code 16020010 (family/household terroristic threat, 4,261), and rank 45, code 16020009 (imminent-serious-injury fear, 4,007). Combined 8,268 means adult arrests, not convictions, unique people, or counts for each alternative. Related false-emergency-report branches have no assigned annual count in this packet.

The old `tx-terroristic-threat` whole-section identity is withheld and requires exact reselection: §22.07 includes misdemeanor and felony grades, so a saved blanket identity cannot safely be assigned to an ordinary branch. Its prior evidence is preserved in Git history; no pending or production source record is overwritten. Other holds and decisions remain unchanged.

## Individual choices

| Choice | Conduct | Grading | Ordinary tier |
| --- | --- | --- | --- |
| Terroristic threat (intent to cause an emergency-agency reaction) (`tx-pc-22-07-emergency`) | §22.07(a)(1) | Tex. Penal Code § 22.07(b) | Class B misdemeanor |
| Terroristic threat (ordinary intent to cause imminent-serious-injury fear) (`tx-pc-22-07-ordinary-fear`) | §22.07(a)(2) | Tex. Penal Code § 22.07(c) | Class B misdemeanor |
| Terroristic threat (family, household or family violence) (`tx-pc-22-07-family`) | §22.07(a)(2) | Tex. Penal Code § 22.07(c)(1) | Class A misdemeanor |
| Terroristic threat (against a public servant) (`tx-pc-22-07-public-servant`) | §22.07(a)(2) | Tex. Penal Code § 22.07(c)(2) | Class A misdemeanor |
| Terroristic threat (known sheriff, constable, municipal officer or DPS officer) (`tx-pc-22-07-peace-officer`) | §22.07(a)(2) | Tex. Penal Code § 22.07(c-1) | State jail felony |
| Terroristic threat (known judge) (`tx-pc-22-07-judge`) | §22.07(a)(2) | Tex. Penal Code § 22.07(c-1) | State jail felony |
| Terroristic threat (intended interruption without the $1,500 loss finding) (`tx-pc-22-07-interruption`) | §22.07(a)(3) | Tex. Penal Code § 22.07(d) | Class A misdemeanor |
| Terroristic threat (interruption causing at least $1,500 owner loss) (`tx-pc-22-07-interruption-loss`) | §22.07(a)(3) | Tex. Penal Code § 22.07(d) | State jail felony |
| Terroristic threat (intent to impair public services) (`tx-pc-22-07-public-service`) | §22.07(a)(4) | Tex. Penal Code § 22.07(e) | Third-degree felony |
| Terroristic threat (intent to cause serious-injury fear in the public) (`tx-pc-22-07-public-fear`) | §22.07(a)(5) | Tex. Penal Code § 22.07(e) | Third-degree felony |
| Terroristic threat (intent to influence a government branch or agency) (`tx-pc-22-07-government`) | §22.07(a)(6) | Tex. Penal Code § 22.07(e) | Third-degree felony |
| False alarm or report (ordinary) (`tx-pc-42-06-ordinary`) | §42.06(a) | Tex. Penal Code § 42.06(b) | Class A misdemeanor |
| False alarm or report (listed institution or public-service emergency) (`tx-pc-42-06-institution-service`) | §42.06(a) | Tex. Penal Code § 42.06(b) | State jail felony |
| False report to induce emergency response (ordinary) (`tx-pc-42-0601-ordinary`) | §42.0601(a) | Tex. Penal Code § 42.0601(b) | Class A misdemeanor |
| False report to induce emergency response (repeat) (`tx-pc-42-0601-repeat`) | §42.0601(a) | Tex. Penal Code § 42.0601(b)(1) | State jail felony |
| False report to induce emergency response (injury death) (`tx-pc-42-0601-injury-death`) | §42.0601(a) | Tex. Penal Code § 42.0601(b)(2) | Third-degree felony |

## Boundaries

Every threat branch requires a threatened violent offense plus its particular specific intent. The individual-fear branch requires imminent serious bodily injury; that wording is not transplanted into the public/group-fear alternative. The ordinary branch excludes family/public-servant and known-officer/judge circumstances. Family, household, dating-violence and child-abuse definitions and incorporated blood/marriage relationships are retained separately.

The known-peace-officer/judge threat grade does not require the official-duty/retaliation condition used by the separate assault statute. The narrowed officer selector includes only the common article 2A.001(1)-(4) roles in both retained versions. Other legally qualifying officer roles are not thereby reduced to Class A: the public-servant summary explicitly preserves §22.07(c-1), without clearing additional officer-role choices. Protected expression and case-specific defenses remain distinct from the statutory intent elements.

The interruption threshold is $1,500 of resulting owner economic loss, not a general theft threshold or exclusively property damage. False-alarm reporting requires knowledge of falsity and the statutory would-ordinarily effect. It does not silently require an actual response. The institution enhancement distinguishes public primary/secondary schools from public-or-private higher education.

The separate emergency-response offense requires an actual response and recklessness about directly causing bodily injury. Its repeat enhancement requires two prior convictions under that section. The third-degree branch requires a false criminal-offense report and serious injury or death directly resulting from lawful responsive conduct. The statute was added September 1, 2021 and is not assigned to earlier conduct. Its federal savings clause is disclosed without interpreting separate federal liability or immunity; those federal provisions are not independently adjudicated by this packet. Prosecution under both statutes is not described as automatic cumulative punishment.

## Evidence and delivery

Twenty-two official sections acquired November 18, 2026 bind 133 required per-record references. All 17 overlapping retained texts match the preceding reviewed evidence. Exact URLs, effective-date metadata, acquisition timestamps, chapter/text/snapshot hashes and per-record subdivisions are committed. No existing receipt or evidence acquisition date is extended.

The publisher's current CPJC 22.28 page was checked directly. It supports only the individual imminent-serious-injury-fear conduct theory, not every §22.07 intent or special grade. Only those five applicable choices display that bounded instruction link. Other rows omit an unverified instruction link without asserting that none exists. No publisher instruction body is reproduced.

New non-English requests show the English-content notice. The canonical-ID, explanation, saved-answer/PDF reselection and manifest gates all reject the retired blanket ID; changing its manifest disposition by itself cannot restore it.

## Candidate accounting and reproduction

Parent PR262 contains 331 configured Texas records and 256 offline eligible IDs. This candidate has 347 configured and 271 offline eligible (+16 new, minus one newly held); 76 held. The seed builder produces 183 source keys and 2,414 snapshot/links. Only the prior blanket threat record changes; the other 330 parent records and manifest generation timestamp are unchanged. These are offline candidate figures, not public availability claims.

Run `npx tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts threats-alerts` to rebuild the sixteen records from committed official evidence with the actual manifest builder. Tests verify exact records, every required reference, missing/altered-evidence rejection, retained statutory conditions, language notices and saved-identity/forged-disposition rejection. The built-selector check verifies all sixteen descriptions and grades plus exclusion of the blanket ID.

PR262 is merged; this draft targets main and preserves its officer-grading and publisher-edition corrections. No database, import, migration, source activation, receipt renewal or deployment is performed.

Validation: 193 affected tests passed with six deliberate database integration skips; the final explicit PDF notice addition passed all 20 PDF tests, including two new cases. Typecheck and production build passed. All 17 isolated built-selector checks passed.
