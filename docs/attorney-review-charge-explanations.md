# Attorney Review Checklist — New Charge Explanations (added 2026-08)

**Status:** PENDING REVIEW  
**Date generated:** 2026-08  
**File:** `shared/charge-explanations.ts`  
**Entries requiring review:** 16 new entries (all now AI-drafted with statutory sources; the 13 originally unsourced entries were sourced against the 10 anchor jurisdictions in the 2026-08 sourcing pass and raised from `dataConfidence: "low"` to `"medium"` — attorney review is still pending for all 16)

---

## Instructions for Reviewing Attorney

The 16 entries below were drafted by an AI assistant from general legal knowledge, pattern jury instructions, and in some cases cited statutes. They have **not** been verified by a licensed criminal defense attorney.

**What to review in each entry:**
1. **`plainSummary`** — Is the plain-language description accurate, complete, and unlikely to mislead a non-attorney advocate? Does it cover the most common charging scenario?
2. **`keyTerms`** — Is each term defined correctly? Does the example accurately illustrate the concept?
3. **`degreeContext`** — Are the degree/grading generalizations defensible across the states that matter most? Are sentence ranges accurate?
4. **`notes` field** — Check the "Key risk areas" listed there; correct any inaccuracies in the entry text.

**When you approve an entry:**
- Replace the `// ⚠ PENDING ATTORNEY REVIEW (2026-08) — see docs/attorney-review-charge-explanations.md` comment on that entry's block with:
  ```
  // Attorney-reviewed: [Your name], [YYYY-MM-DD]
  ```
- Change `dataConfidence` from `"low"` to `"medium"` (or `"high"` if you sourced it) after approval.
- Update `lastVerified` to the review date (YYYY-MM).
- Correct the `notes` field to remove the ⚠ warning and replace with review notes.

---

## Entries Requiring Review

### 1. Perjury (`slug: "perjury"`)

**Pattern:** `/perjury|false.swearing/i`

**Plain summary:**
> Perjury means you made a false statement under oath, such as in court testimony, a deposition, or on a sworn document, while knowing the statement was false. The lie must be material, meaning it had the potential to affect the outcome of the case. An honest mistake or a statement you believed to be true at the time is not perjury.

**Key terms:**
- *Under Oath* — formally sworn or affirmed to tell the truth
- *Materiality* — must affect the case outcome, not a trivial detail
- *Knowing Falsity* — must know the statement was false when made

**Degree context:**
> Felony in all US jurisdictions. Federal: up to 5 years per count. State: typically 2–5 years. Multiple false statements can be charged as separate counts.

**Attorney attention points:**
- Recantation defense: does the summary need to mention that some jurisdictions allow a recantation defense before prosecution begins?
- Two-witness rule: the federal rule (18 U.S.C. § 1621) requires two witnesses or one witness plus corroboration — does the entry need to mention this?
- Subornation of perjury as a distinct related charge

---

### 2. Marijuana / Cannabis Possession (`slug: "marijuana-possession"`)

**Pattern:** `/possession.of.(?:marijuana|cannabis|thc)|marijuana.possession|...`

**Plain summary:**
> Marijuana possession means you had cannabis, THC products, or related items and it was either illegal in that state, exceeded the legal personal-use limit, or you were in a prohibited location…

**Key terms:**
- *Personal Use Limit* — typically 1–2 oz for adults in legal states
- *Over Legal Limit* — exceeding the legal personal allowance
- *THC* — active psychoactive compound; concentrates/edibles subject to same laws

**Degree context:**
> Small amount: misdemeanor or civil infraction. Larger amounts or school zone: more serious misdemeanor or felony. Over ~1 lb: trafficking.

**Attorney attention points:**
- Personal-use limits by state change frequently — is the "1 to 2 ounces" generalization accurate enough for current law?
- School-zone distances (500 ft vs. 1,000 ft): is this mentioned?
- Concentrate vs. flower weight treatment (many states treat them differently for penalty purposes)
- Trafficking weight threshold varies enormously by state

---

### 3. Rape (`slug: "rape"`)

**Pattern:** `/rape(?!.*child\s+abuse)|rape.in.the.(?:first|second|third)|rape.of.a.child/i`

**Plain summary:**
> Rape is the crime of non-consensual sexual penetration. It is the same conduct that many states now call 'sexual assault in the first degree,' but some states still use the term rape…

**Key terms:**
- *Penetration* — any sexual penetration, however slight; act does not have to be completed
- *Lack of Consent* — victim did not freely agree or was legally incapable
- *Force or Coercion* — physical force, threats, or exploiting incapacity

**Degree context:**
> Universally a felony. First-degree: 10–25 years or life. Second/third degree: 3–15 years. Rape of a child: mandatory 10–25 years to life. All convictions require sex offender registration.

**Attorney attention points:**
- Most states have moved away from "rape" terminology — confirm the chargePattern correctly catches current state statute names
- The consent standard varies: some states eliminated the "force" requirement, making lack-of-consent alone sufficient
- Statutory rape (age-based) vs. forcible rape — does this entry create confusion between them?
- "Rape of a child" within this same entry slug may need to be a separate entry
- Sex offender registration requirements vary significantly and change frequently

---

### 4. Forgery (`slug: "forgery"`) — *Has statutory sources; dataConfidence: high*

**Pattern:** `/forgery(?!.*check)|forging|uttering.(?:forged|false)/i`

**Plain summary:**
> Forgery means you made, altered, or used a false written document with the intent to defraud someone…

**Key terms:**
- *False Writing* — creating a falsely genuine document or altering a real one
- *Intent to Defraud* — meant to use the document to deceive
- *Uttering* — passing a forged document to someone else

**Degree context:**
> Felony for financial instruments/official documents/significant amounts. Minor forgeries may be misdemeanors. 1–3 years for less serious forgery; 5–10 years for large-scale fraud.

**Attorney attention points:**
- The 1–3 / 5–10 year sentence range generalizations — are these accurate across the 50 jurisdictions cited?
- Wobbler treatment (CA Prop 47 $950 threshold) — current?
- Does the entry adequately distinguish forgery from counterfeiting (a distinct federal charge)?

---

### 5. Failure to Appear (`slug: "failure-to-appear"`) — *Has statutory sources; dataConfidence: high*

**Pattern:** `/failure.to.appear|failure.to.report|bench.warrant.*failure/i`

**Plain summary:**
> Failure to appear means you missed a required court date without a legal excuse. This is a separate criminal charge on top of your underlying case, and it results in a bench warrant being issued for your arrest…

**Key terms:**
- *Bench Warrant* — judge-signed warrant; any routine traffic stop can result in immediate arrest
- *Notice of Court Date* — proof you knew about the hearing
- *Willfulness* — intentional choice, not a genuine emergency

**Degree context:**
> FTA on misdemeanor: typically a misdemeanor (fines + 6–12 months). FTA on felony: typically a separate felony (1–3 years additional). Bench warrant follows indefinitely.

**Attorney attention points:**
- Illinois abolished criminal FTA when it eliminated cash bail — is this important enough to include in the main summary?
- Several states (LA, MS, WY) have no standalone FTA offense — does the entry need to mention this?
- The "1–3 years additional" range for felony FTA — verify this is broadly accurate

---

### 6. Failure to Identify / Fake ID (`slug: "failure-to-identify"`)

**Pattern:** `/failure.to.identify|providing.false.information.to.police|fake.id|...`

**Plain summary:**
> Failure to identify means you refused to give your name and basic identifying information to a police officer who lawfully stopped you…

**Key terms:**
- *Lawful Stop or Detention* — officer must have had reasonable suspicion
- *Stop and Identify States* — about half of US states require identification
- *False Identification* — giving a fake name or false date of birth to an officer

**Degree context:**
> Failure to identify (where required): typically a misdemeanor with small fine. False information: more serious misdemeanor or low-level felony. Fake ID: misdemeanor in most states; felony for identity fraud.

**Attorney attention points:**
- The *Hiibel v. Nevada*, 542 U.S. 177 (2004) decision is the leading case — is the summary consistent with its holding?
- Confirm the "about half of US states" claim is current
- California, which is listed as a stop-and-identify state in the `keyTerms` example, actually does NOT have a stop-and-identify law — verify this is not a factual error
- The right to remain silent vs. the duty to provide name-only should be more clearly explained

---

### 7. Indecent Exposure / Gross Sexual Imposition / Offensive Touching (`slug: "indecent-exposure"`)

**Pattern:** `/indecent.exposure|public.urination|gross.sexual.imposition|indecent.assault|offensive.touching/i`

**Plain summary:**
> Indecent exposure means you exposed your genitals in a public place or in view of others who did not consent to seeing it. Gross sexual imposition and indecent assault cover unwanted sexual touching that falls short of penetration…

**Key terms:**
- *Public Exposure* — exposing private parts where others can see
- *Sexual Touching* — contact with intimate parts for sexual gratification without consent
- *Consent* — clear voluntary agreement; absence of protest is not consent

**Degree context:**
> Indecent exposure: misdemeanor first offense, felony for repeats or if a child witnessed. Gross sexual imposition/indecent assault: usually felonies (1–5 years). All sex-offense convictions may require sex offender registration.

**Attorney attention points:**
- *Critical:* Grouping indecent exposure with gross sexual imposition and offensive touching is legally significant — these are not the same offense. An attorney should advise whether this grouping misleads advocates
- Sex offender registration for misdemeanor indecent exposure varies enormously by state — the entry understates this uncertainty
- Public urination is included in the pattern but is generally a municipal infraction, not a sex offense, and should not imply registration risk
- "Gross sexual imposition" is Ohio-specific terminology — other states call this charge differently

---

### 8. Reckless Driving / Reckless Conduct (`slug: "reckless-driving"`)

**Pattern:** `/reckless.(?:driving|conduct|endangerment)|careless.driving.*criminal/i`

**Plain summary:**
> Reckless driving or reckless conduct means you operated a vehicle (or acted in some other way) with a conscious disregard for the substantial risk of harm to other people or property…

**Key terms:**
- *Conscious Disregard* — knew behavior was dangerous and chose to do it anyway
- *Substantial Risk* — significant and unjustifiable given circumstances
- *Reckless Endangerment* — related charge focusing on risk created even without accident

**Degree context:**
> Reckless driving: usually misdemeanor (fines, license suspension, up to 90 days–1 year). Causing injury: escalates to more serious misdemeanor or low-level felony. Causing serious injury or death: reckless endangerment 1–5 years; reckless homicide 2–10 years.

**Attorney attention points:**
- The entry groups driving and non-driving reckless conduct under one entry — are these consistently charged the same way?
- The mention of reckless homicide in the degreeContext may require a cross-reference to the vehicular homicide entry to avoid confusion
- Some states treat reckless driving as a traffic offense rather than a criminal charge — is this distinction important enough to include?

---

### 9. Public Intoxication / Minor in Possession / Open Container (`slug: "public-intoxication"`)

**Pattern:** `/public.intoxication|public.drunkenness|minor.in.possession.of.(?:alcohol|tobacco)|open.container|...`

**Plain summary:**
> Public intoxication means you were visibly drunk or impaired in a public place to a degree that you were a danger to yourself or others, or were causing a disturbance…

**Key terms:**
- *Public Place* — accessible to the general public; private property generally excluded
- *Danger to Self or Others* — more than just being visibly drunk
- *Minor in Possession* — person under 21 having alcohol, including unopened containers

**Degree context:**
> Almost always misdemeanors or civil infractions. Public intoxication often results in detainment rather than prosecution. Minor in possession: fine, community service, license suspension. Open container: typically a traffic infraction.

**Attorney attention points:**
- Texas decriminalized public intoxication — it is a civil offense there, not a criminal charge. Is this exception important enough to note?
- "Use and lose" license suspension laws for minor in possession (many states) are not mentioned
- The grouping of tobacco MIP with alcohol MIP may not be accurate — tobacco possession by minors has different laws in most states
- Some states specifically have no public intoxication law at all (e.g., historically Montana)

---

### 10. Loitering / Panhandling / Illegal Camping / Peace Disturbance (`slug: "loitering"`)

**Pattern:** `/loitering|panhandling|aggressive.solicitation|illegal.camping|sleeping.in.public|peace.disturbance|littering|illegal.dumping|...`

**Plain summary:**
> These are low-level public order and quality-of-life offenses. Loitering means lingering in a public place without apparent purpose in a way that raises suspicion or disturbs others…

**Key terms:**
- *Loitering* — remaining in a place without clear lawful purpose in an alarming way
- *Aggressive Solicitation* — begging in a way that involves following, blocking, or threatening
- *Infraction vs. Misdemeanor* — most are infractions with fines, not criminal charges

**Degree context:**
> Most are civil infractions or minor misdemeanors. Repeat violations or escalation to harassment can be more serious. Illegal camping prosecutions have decreased following court rulings.

**Attorney attention points:**
- *Martin v. City of Boise*, 920 F.3d 584 (9th Cir. 2018) — the constitutional limits on anti-camping enforcement are significant and should be mentioned
- Anti-loitering statutes have been widely struck down as unconstitutionally vague (*Papachristou v. Jacksonville*, 1972) — the entry may need to note that many of these charges are susceptible to constitutional challenge
- Fishing/hunting without a license (in the chargePattern) is a completely different type of offense from loitering — confirm this grouping is intentional
- This entry covers the widest range of distinct offenses of any entry; an attorney should advise whether it should be split

---

### 11. Hate Crime Enhancement (`slug: "hate-crime-enhancement"`) — *Has statutory sources; dataConfidence: high*

**Pattern:** `/hate.crime|federal.hate.crime|bias.motivated/i`

**Plain summary:**
> A hate crime charge or enhancement means the underlying offense was motivated by the victim's race, religion, national origin, sexual orientation, gender identity, or disability…

**Key terms:**
- *Bias Motivation* — crime committed because of victim's actual or perceived protected-group membership
- *Enhancement vs. Separate Charge* — most states add years to existing sentence; federally also a separate crime
- *Protected Characteristics* — race, color, religion, national origin, sexual orientation, gender identity, disability

**Degree context:**
> Enhancements typically increase sentence 50–100% over base offense. Federal (Matthew Shepard Act): up to 10 years additional, or life if kidnapping/sexual assault/death resulted.

**Attorney attention points:**
- The 50–100% enhancement estimate — is this accurate across the 44 jurisdictions cited?
- Wyoming and Arkansas have been confirmed as having no hate crime enhancement law — should the entry note this?
- The protected characteristics list: some states omit gender identity (PA, MI as noted in sources) — should the entry be more specific about inconsistency?

---

### 12. Murder in the Third Degree (`slug: "murder-in-the-third-degree"`)

**Pattern:** `/murder.in.the.third.degree|third.degree.murder|murder.*3rd.degree/i`

**Plain summary:**
> Third degree murder exists in only a handful of states (including Minnesota, Florida, and Pennsylvania)…

**Key terms:**
- *Depraved Mind* — extreme recklessness showing complete disregard for human life without targeting a specific person
- *Without Intent to Kill a Specific Person* — key distinction from second degree murder
- *Drug-Induced Murder (Florida)* — providing drugs that cause another's death charged as third-degree felony murder

**Degree context:**
> Serious felony. Minnesota: maximum 25 years. Pennsylvania: up to 40 years.

**Attorney attention points:**
- *Critical:* Minnesota's third degree murder statute was at the center of *State v. Chauvin* and the Minnesota Supreme Court's 2022 ruling — the current state of the law must be verified against current case law
- Pennsylvania defines third degree murder by common law "malice" rather than a "depraved mind" standard — the entry conflates these
- Florida's third degree murder (§782.04(4)) is specifically a *felony murder* rule (death during third degree felony) — the entry's "drug-induced murder" example does not capture the full scope
- The entry should note which states use this charge vs. which use manslaughter for the same conduct

---

### 13. Recidivist / Sentencing Enhancement (`slug: "recidivist-enhancement"`)

**Pattern:** `/prior.felony.*enhancement|recidivist|habitual.offender|three.strikes|repeat.offender.*enhancement|...`

**Plain summary:**
> Recidivist or sentencing enhancement charges are not standalone crimes. They are legal findings that increase your sentence because of your prior criminal history…

**Key terms:**
- *Prior Conviction* — previous guilty verdict or plea used to trigger enhanced sentences
- *Qualifying Offense* — not all priors trigger enhancements; laws specify which "strikes" count
- *Mandatory Minimum* — sentence judge must impose; enhancements often remove judicial discretion

**Degree context:**
> Can dramatically increase sentences from doubling to mandatory life. Imposed by judge at sentencing. Attorney may challenge whether priors qualify, were constitutionally obtained, or whether enhancement was properly noticed.

**Attorney attention points:**
- The right to a jury finding on recidivism (*Almendarez-Torres v. United States*, 523 U.S. 224 (1998)) is a contested area of law worth mentioning
- "Properly noticed before trial" varies by state — some states require the prosecution to file a notice of intent to seek enhancement within a specific period
- The statement that enhancements "can reach mandatory life sentences" under three-strikes may be an overstatement; most three-strikes states require 25 years to life, not automatic life without parole

---

### 14. Illegal Entry / Illegal Re-Entry (`slug: "illegal-entry-reentry"`)

**Pattern:** `/illegal.(?:entry|re.?entry)|illegal.re.?entry.after.removal|federal.immigration|unlawful.entry.*federal/i`

**Plain summary:**
> Illegal entry (8 U.S.C. § 1325) is a federal misdemeanor for entering the United States at a place or time not authorized by a border agent, or by fraud. Illegal re-entry (8 U.S.C. § 1326) is a federal felony for returning to the US after having been previously deported or removed…

**Key terms:**
- *Entry Without Inspection* — crossing at unauthorized location or presenting false documents
- *Removal / Deportation* — prior formal order to leave; makes subsequent entry illegal re-entry
- *Aggravated Felony Enhancement* — prior aggravated felony conviction dramatically increases § 1326 sentence

**Degree context:**
> Illegal entry: up to 6 months first offense, 2 years subsequent. Illegal re-entry: 2 years without prior felony; 10 years with prior felony; 20 years with prior aggravated felony.

**Attorney attention points:**
- The sentencing ranges come from statutory maximums but actual sentences under USSG § 2L1.2 depend heavily on criminal history — this distinction is critical for advocates
- *United States v. Taylor* (2022) and subsequent cases have affected what counts as a "crime of violence" predicate for the highest re-entry tier — should be verified
- Fast-track programs exist in some districts but not others; the entry should clarify geographic variation
- The interaction with simultaneous civil immigration removal proceedings is critical for advocates and should be mentioned
- The statutory maximum for § 1325 was increased by legislation — verify the 2-year figure for subsequent offenses is current

---

### 15. Juvenile Proceedings (`slug: "juvenile-proceedings"`)

**Pattern:** `/juvenile.delinquency|juvenile.transfer.to.adult|juvenile.firearm|transfer.*adult.court|waiver.hearing|federal.juvenile/i`

**Plain summary:**
> Juvenile charges are handled differently from adult criminal cases. A 'delinquency adjudication' is the juvenile equivalent of a guilty verdict…

**Key terms:**
- *Delinquency Adjudication* — juvenile court finding of delinquency, not a criminal conviction
- *Transfer to Adult Court* — hearing where judge decides whether case goes to adult court
- *Disposition* — juvenile court's sentence (probation, counseling, community service, placement)

**Degree context:**
> Juvenile adjudications generally cannot result in prison. Maximum: placement until 18 or 21 depending on state. Transfer to adult court: all adult sentencing ranges apply. Records often expungeable at 18, with exceptions.

**Attorney attention points:**
- Juvenile court age cutoffs vary by state (16 in some states historically; now typically 17 or 18 with ongoing reforms)
- "Direct file" or "prosecutorial discretion transfer" in some states allows the prosecutor to file directly in adult court without a hearing — the entry only mentions judicial waiver
- Sex offense adjudications often require registration even from juvenile court in many states — the entry doesn't mention this
- Federal Juvenile Delinquency Act (18 U.S.C. §§ 5031–5042) applies to juveniles in federal proceedings — is this covered by the pattern?
- The statement that records "can often be expunged at 18" is overly optimistic in many states — verify

---

### 16. Check Fraud / Bad Check (`slug: "check-fraud"`)

**Pattern:** `/check.{0,20}fraud|bad.{0,5}check|insufficient.{0,10}funds.{0,10}check|476a?(\b|$)|...`

**Plain summary:**
> Check fraud under California law covers two related offenses. The most common is Penal Code § 476a: writing, passing, or using a check when you knew your account didn't have enough money…

**Key terms:**
- *Intent to Defraud* — trying to obtain money/goods/services with a check you knew was worthless
- *Insufficient Funds (§ 476a)* — account balance too low to cover the check amount
- *Fictitious or Forged Check (§ 476)* — check on nonexistent, closed, or someone else's account
- *Making, Drawing, Uttering, or Delivering* — any step in creating or passing the check counts
- *Wobbler* — can be filed as misdemeanor or felony depending on amount and record

**Degree context:**
> § 476a wobbler: misdemeanor = up to 1 year county jail; felony = up to 3 years county jail. Checks over $950 and repeat offenses more likely filed as felony. Diversion/civil compromise sometimes available.

**Attorney attention points:**
- *This entry is explicitly California-specific* — confirm the chargePattern does not accidentally match non-CA charges and serve CA law to advocates in other states
- Prop 47's $950 threshold has been the subject of ongoing reform efforts — verify it is still in effect
- Civil compromise under Penal Code § 1377 availability should be verified with a CA criminal defense practitioner
- The "make good" / 30-day demand letter that many CA prosecutors require before filing is not mentioned

---

## How to Signal Completion

After completing your review, update this file header:

```
**Status:** REVIEWED — [Attorney name], [YYYY-MM-DD]
**Reviewed by:** [Name], [Bar number/state], [Firm/affiliation]
```

And in `shared/charge-explanations.ts`, for each entry you've approved:
1. Change the `// ⚠ PENDING ATTORNEY REVIEW` comment to `// Attorney-reviewed: [name], [YYYY-MM-DD]`
2. Change `dataConfidence: "low"` to `dataConfidence: "medium"` (or `"high"` if you sourced additional statutes)
3. Update `lastVerified` to the review month
4. Replace the `notes` content with your review notes

---

*This checklist was auto-generated from the charge-explanations source file on 2026-08. Contact the development team with any questions about the data structures.*
