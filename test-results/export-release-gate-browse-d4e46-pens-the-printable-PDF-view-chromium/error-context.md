# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: export-release-gate.spec.ts >> browser export release gate >> creates a DOCX draft and opens the printable PDF view
- Location: tests/e2e/export-release-gate.spec.ts:4:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Print or save as PDF: opens browser print dialog' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - link "Skip to main content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: Beta
      - paragraph [ref=e8]: Our guidance is carefully researched, but we're still refining features based on user feedback.
    - button "Close" [ref=e9] [cursor=pointer]
  - main [ref=e13]:
    - generic [ref=e15]:
      - navigation "Main navigation" [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - button "Go to home page" [ref=e20] [cursor=pointer]:
              - generic [ref=e21]: OpenDefender
            - navigation "Section navigation" [ref=e24]:
              - generic [ref=e25]:
                - button "Urgent help" [ref=e26] [cursor=pointer]
                - generic [ref=e29]: ·
              - generic [ref=e30]:
                - button "Understand your case" [ref=e32] [cursor=pointer]
                - generic [ref=e37]: ·
              - generic [ref=e38]:
                - button "Find help" [ref=e40] [cursor=pointer]
                - generic [ref=e45]: ·
              - generic [ref=e46]:
                - button "Immigration" [ref=e48] [cursor=pointer]
                - generic [ref=e53]: ·
              - button "Trust & explore" [ref=e56] [cursor=pointer]
          - generic [ref=e61]:
            - button "Search site" [ref=e62] [cursor=pointer]
            - combobox [ref=e64] [cursor=pointer]
            - button "Switch to dark mode" [ref=e72] [cursor=pointer]
      - generic [ref=e74]:
        - link "Advocate Hub" [ref=e75] [cursor=pointer]:
          - /url: /for-advocates
        - paragraph [ref=e78]: Advocate tool
        - heading "Mitigation Builder" [level=1] [ref=e79]
        - paragraph [ref=e80]: A structured intake form covering the social history domains courts respond to. Fill in what you know and your formatted summary appears on the right, ready to copy or print.
        - generic [ref=e81]:
          - generic [ref=e82]: Nothing is saved or sent anywhere
          - generic [ref=e83]: For use at bail, diversion, and sentencing hearings
      - paragraph [ref=e88]: For attorney use or use under direct attorney supervision. This tool does not create legal advice, and documents it produces are not automatically privileged. If you are the attorney of record, printed output may constitute attorney work product. If you are not an attorney, this document is not privileged and may be subject to disclosure. Review any output with supervising counsel before retaining or sharing it.
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]:
            - paragraph [ref=e93]: Header information
            - generic [ref=e94]:
              - generic [ref=e95]: Client name or identifieroptional
              - textbox "Client name or identifieroptional" [ref=e96]:
                - /placeholder: e.g. J. Smith — or leave blank
                - text: Release Gate Test
            - generic [ref=e97]:
              - generic [ref=e98]: Case / docket numberoptional
              - textbox "e.g. 2024-CR-00512" [ref=e99]
            - generic [ref=e100]:
              - generic [ref=e101]: Proceeding contextoptional
              - textbox "e.g. Bail hearing, diversion application, sentencing memo" [ref=e102]
          - generic [ref=e103]:
            - button "Community Ties 1 field filled" [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - generic [ref=e106]: Community Ties
                - generic [ref=e107]: 1 field filled
            - generic [ref=e110]:
              - generic [ref=e111]:
                - generic [ref=e112]: Time in communityoptional
                - textbox "Time in communityoptional" [ref=e113]:
                  - /placeholder: e.g. 12 years in [city/neighborhood]
                  - text: 12 years in the community
              - generic [ref=e114]:
                - generic [ref=e115]: Family members in the areaoptional
                - textbox "e.g. Mother, two siblings, spouse" [ref=e116]
              - generic [ref=e117]:
                - generic [ref=e118]: Civic, religious, or community involvementoptional
                - textbox "e.g. Volunteer at local food pantry, active member of church, coaches youth soccer" [ref=e119]
          - button "Housing Stability" [ref=e121] [cursor=pointer]
          - button "Employment" [ref=e127] [cursor=pointer]
          - button "Treatment Participation" [ref=e133] [cursor=pointer]
          - button "Family Responsibilities" [ref=e139] [cursor=pointer]
          - button "Character References" [ref=e145] [cursor=pointer]
          - button "Additional Context" [ref=e151] [cursor=pointer]
          - button "Clear all fields" [ref=e156] [cursor=pointer]
        - generic [ref=e157]:
          - generic [ref=e158]:
            - generic [ref=e159]: Summary output
            - generic [ref=e165]:
              - button "Copy" [ref=e166] [cursor=pointer]
              - button ".txt" [ref=e170] [cursor=pointer]
              - button ".docx" [ref=e174] [cursor=pointer]
              - button "Print or save as PDF — opens browser print dialog" [ref=e178] [cursor=pointer]: Print / PDF
            - paragraph [ref=e186]: Draft only. This summary contains only information you entered. Verify every claim independently before including it in any court filing or communication.
            - generic [ref=e187]: "MITIGATION SUMMARY — DRAFT Review every line before use. Do not file without attorney verification. Prepared: August 24, 2026 Client: Release Gate Test COMMUNITY TIES ──────────────────────────────────────── • Time in community: 12 years in the community ──────────────────────────────────────── This summary contains only information provided by the advocate. Verify every claim independently before including in any court filing."
          - generic [ref=e188]:
            - generic [ref=e189]:
              - generic [ref=e190]:
                - generic [ref=e193]: Polish with AI
                - generic [ref=e194]: Beta
              - button "Generate narrative" [disabled] [ref=e195]
            - paragraph [ref=e199]: "Field-locked: Claude will only use information you entered — empty fields are skipped and nothing is inferred. Output is unlabeled prose; your structured summary above remains unchanged. No data is stored or logged."
            - alert [ref=e201]:
              - generic [ref=e204]: Verification failed. Please try again.
            - paragraph [ref=e206]: Click "Generate narrative" above to convert your filled fields into court-ready prose.
          - generic [ref=e207]:
            - paragraph [ref=e208]: After the case resolves
            - generic [ref=e209]:
              - link "Expungement & record sealing eligibility →" [ref=e210] [cursor=pointer]:
                - /url: /support/reputation/eligibility
                - text: Expungement & record sealing eligibility
                - generic [ref=e211]: →
              - link "Rap sheet review & error correction →" [ref=e212] [cursor=pointer]:
                - /url: /support/reputation#rap-sheet
                - text: Rap sheet review & error correction
                - generic [ref=e213]: →
              - link "Background check rights (FCRA) →" [ref=e214] [cursor=pointer]:
                - /url: /support/reputation#fcra-rights
                - text: Background check rights (FCRA)
                - generic [ref=e215]: →
              - link "Certificates of relief →" [ref=e216] [cursor=pointer]:
                - /url: /support/reputation#certificates-of-relief
                - text: Certificates of relief
                - generic [ref=e217]: →
              - link "Employer & landlord communication templates →" [ref=e218] [cursor=pointer]:
                - /url: /support/reputation#reputation-comms
                - text: Employer & landlord communication templates
                - generic [ref=e219]: →
      - generic [ref=e220]:
        - generic [ref=e222]:
          - generic [ref=e223]:
            - generic [ref=e224]: OpenDefender
            - paragraph [ref=e228]: We help people understand their rights and find free legal information.
            - generic [ref=e229]: "Privacy First: We do not store your personal data. All input is deleted after session."
            - generic [ref=e232]:
              - link "OpenDefender on GitHub" [ref=e233] [cursor=pointer]:
                - /url: https://github.com/publicdefenderai-ai/OpenDefender
                - generic [ref=e237]: View on GitHub
              - link "OpenDefender on X (Twitter)" [ref=e238] [cursor=pointer]:
                - /url: https://x.com/OpenDefenderAI
                - generic [ref=e241]: Follow on X
          - generic [ref=e242]:
            - heading "Get Help" [level=4] [ref=e243]
            - list [ref=e244]:
              - listitem [ref=e245]:
                - link "Urgent help" [ref=e246] [cursor=pointer]:
                  - /url: /first-24-hours
              - listitem [ref=e247]:
                - link "Get Case Roadmap" [ref=e248] [cursor=pointer]:
                  - /url: /case-guidance
              - listitem [ref=e249]:
                - link "Know Your Rights" [ref=e250] [cursor=pointer]:
                  - /url: /rights-info
              - listitem [ref=e251]:
                - link "Understand a case stage" [ref=e252] [cursor=pointer]:
                  - /url: /case-timeline
              - listitem [ref=e253]:
                - link "Find a lawyer or resources" [ref=e254] [cursor=pointer]:
                  - /url: /legal-aid
              - listitem [ref=e255]:
                - link "Find Local Courts" [ref=e256] [cursor=pointer]:
                  - /url: /court-locator
          - generic [ref=e257]:
            - heading "About" [level=4] [ref=e258]
            - list [ref=e259]:
              - listitem [ref=e260]:
                - link "Our Mission" [ref=e261] [cursor=pointer]:
                  - /url: /mission-statement
              - listitem [ref=e262]:
                - link "Right to Counsel" [ref=e263] [cursor=pointer]:
                  - /url: /right-to-counsel
              - listitem [ref=e264]:
                - link "For Developers" [ref=e265] [cursor=pointer]:
                  - /url: /tech-docs
              - listitem [ref=e266]:
                - link "Privacy Policy" [ref=e267] [cursor=pointer]:
                  - /url: /privacy-policy
              - listitem [ref=e268]:
                - link "Notice & Disclaimers" [ref=e269] [cursor=pointer]:
                  - /url: /disclaimers
              - listitem [ref=e270]:
                - link "Verify sources" [ref=e271] [cursor=pointer]:
                  - /url: /data-sources
        - generic [ref=e273]:
          - paragraph [ref=e274]: General legal information only — not a substitute for professional legal advice. Always consult a qualified attorney for your specific situation.
          - paragraph [ref=e275]: © 2026 OpenDefender. Not a substitute for professional legal advice.
  - button "Open case support chat" [ref=e278] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test.describe("browser export release gate", () => {
  4  |   test("creates a DOCX draft and opens the printable PDF view", async ({ page }) => {
  5  |     await page.addInitScript(() => {
  6  |       const releaseWindow = window as Window & {
  7  |         __releaseGatePrintCalls?: number;
  8  |         __releaseGatePrintDocument?: string;
  9  |       };
  10 |       releaseWindow.__releaseGatePrintCalls = 0;
  11 |       releaseWindow.__releaseGatePrintDocument = "";
  12 | 
  13 |       window.open = () =>
  14 |         ({
  15 |           document: {
  16 |             open: () => undefined,
  17 |             write: (markup: string) => {
  18 |               releaseWindow.__releaseGatePrintDocument = markup;
  19 |             },
  20 |             close: () => undefined,
  21 |           },
  22 |           print: () => {
  23 |             const releaseWindow = window as Window & { __releaseGatePrintCalls?: number };
  24 |             releaseWindow.__releaseGatePrintCalls = (releaseWindow.__releaseGatePrintCalls ?? 0) + 1;
  25 |           },
  26 |         }) as unknown as Window;
  27 |     });
  28 | 
  29 |     await page.goto("/for-advocates/mitigation-builder");
  30 |     await page.getByLabel("Client name or identifier").fill("Release Gate Test");
  31 |     await page.getByLabel("Time in community").fill("12 years in the community");
  32 |     await expect(page.getByText("Summary output")).toBeVisible();
  33 | 
  34 |     const downloadPromise = page.waitForEvent("download");
  35 |     await page.getByRole("button", { name: ".docx", exact: true }).click();
  36 |     const download = await downloadPromise;
  37 |     expect(download.suggestedFilename()).toBe("mitigation-summary-draft.docx");
  38 |     const docxStream = await download.createReadStream();
  39 |     const docxChunks: Buffer[] = [];
  40 |     for await (const chunk of docxStream) docxChunks.push(chunk);
  41 |     const docxContents = Buffer.concat(docxChunks);
  42 |     expect(docxContents.subarray(0, 2).toString()).toBe("PK");
  43 |     expect(docxContents.length).toBeGreaterThan(100);
  44 | 
  45 |     await page.getByRole("button", {
  46 |       name: "Print or save as PDF: opens browser print dialog",
> 47 |     }).click();
     |        ^ Error: locator.click: Test timeout of 60000ms exceeded.
  48 | 
  49 |     await expect
  50 |       .poll(() =>
  51 |         page.evaluate(
  52 |           () => (window as Window & { __releaseGatePrintCalls?: number }).__releaseGatePrintCalls ?? 0,
  53 |         ),
  54 |       )
  55 |       .toBe(1);
  56 |     await expect
  57 |       .poll(() =>
  58 |         page.evaluate(
  59 |           () =>
  60 |             (window as Window & { __releaseGatePrintDocument?: string })
  61 |               .__releaseGatePrintDocument ?? "",
  62 |         ),
  63 |       )
  64 |       .toContain("Sentencing Mitigation Memorandum");
  65 |   });
  66 | });
```