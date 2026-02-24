# Quarterly Data Review Playbook

This playbook accompanies the GitHub Issue created each quarter by the
`quarterly-data-review` workflow. Work through each section of the issue
in order, check off every item, then open a PR with all changes.

**Estimated time:** 3–4 hours per quarter.

---

## Before You Start (5 minutes)

1. Open the GitHub Issue labeled `data-review`.
2. Checkout a new branch:
   ```bash
   git checkout main && git pull
   git checkout -b data-review-$(date +%Y-Q%q)
   ```
3. Open reference tabs:
   - [ICE Detention Facilities](https://www.ice.gov/detain/detention-facilities)
   - [State Dept Foreign Embassies](https://www.state.gov/foreign-embassies-in-the-united-states/)
   - [EOIR Free Legal Services](https://www.justice.gov/eoir/list-of-free-legal-services-providers)
   - [LSC Grantee Finder](https://lsc-granteefinder.lsc.gov/)

---

## Section 1: ICE Detention Facilities (~60 minutes)

**File to edit:** `shared/data/detention-facilities.ts`

### "Phone Changed" items
1. Click the verify link in the issue (ice.gov facility page).
2. Find the facility in the ICE table.
3. **If ICE confirms the new number:** update `phone` in the data file. Check the box.
4. **If ICE shows our stored number:** the automated check may have had a false positive — add a comment in the issue: *"ICE page matches stored value; no change."* Check the box.
5. **If uncertain:** call the facility's main number. Note the outcome in a comment, then check the box.

### "Not Found on Source" items
1. Search `[facility name] ICE detention` to check for recent closure or renaming news.
2. Look for the facility on the [ICE page](https://www.ice.gov/detain/detention-facilities).
3. **If confirmed closed:** do **not** delete — set `isActive: false` on the entry. Document closure date in a comment in the data file. Check the box.
4. **If renamed:** update `name` and `id` fields. Check the box.
5. **If ICE page appears to have a temporary listing error:** add a comment in the issue and note it as "recheck next quarter." Check the box.

### "New on Source" items
1. Look up the facility on the ICE page to confirm it is currently operating.
2. Determine:
   - `type`: listed on ICE page (IGSA, CDF, SPC, FRC, FRC)
   - `fieldOffice`: listed on ICE page
   - `averageCapacity`: listed on ICE page if available
3. **If the facility holds civil immigration detainees:** add a new entry following the `DetentionFacility` interface. Leave `visitationInfo` blank until verified by phone. Check the box.
4. **If not relevant (e.g., purely a criminal holding facility):** add a comment explaining why, then check the box.

### "Manual Verification Required" (visitation hours)
These require a phone call for each facility.

1. Call the facility's main phone number.
2. Ask: *"What are the current visitation hours for detainees?"*
3. Update `visitationInfo.en` and `visitationInfo.es` in the data file.
4. If the facility says hours change daily or by pod, use:
   ```
   "Contact facility for current visitation schedule."
   ```
   (already the default — no change needed)
5. Check the box.

> **Prioritize calls:** Focus on facilities where the automated check also
> detected a phone or address change — these are most likely to have changed
> in other ways too.

---

## Section 2: Consulates (~30 minutes)

**File to edit:** `shared/data/consulates.ts`

### "Phone Changed" items
1. Open the consulate's official website (the `website` field in the data file).
2. Go to their Contact or Consular Services page.
3. **If the website confirms the new number:** update `mainConsulate.phone` (or `mainPhone`). Check the box.
4. **If the website is down** (also flagged as "Website Down"): search `[country] consulate [city] contact` and use the first `.gov` or official-looking result. Document the source in a code comment.
5. **If you cannot confirm with confidence:** set the field to the value you can best verify and add a `// UNVERIFIED — recheck next quarter` comment. Check the box.

### "Website Down" items
1. Try the URL in a browser.
2. **If redirected to a new URL:** update the `website` field. Check the box.
3. **If a temporary outage (site loads intermittently):** add a comment in the issue: *"Appears intermittent; no change made."* Check the box.
4. **If the site is gone and you cannot find an official replacement:** add a comment and escalate — a consulate without a public website is unusual and may warrant direct contact.

### Emergency Phone Numbers (always manual — one per consulate)
Emergency/after-hours numbers have no automated source. For each entry:

1. Open the consulate's official website.
2. Look for: "After Hours," "Emergency," "Citizen Services," or "Consular Emergencies."
3. **If the number is listed and matches our stored value:** check the box with a note: *"Confirmed current."*
4. **If the number has changed:** update `emergencyPhone`. Check the box.
5. **If no emergency number is published anywhere on the official site:** set `emergencyPhone: undefined`. A missing number is safer than a stale one. Check the box.

> **Safety note:** Emergency phone numbers are used when someone is detained
> or facing deportation. If you cannot verify a number with confidence from
> an official source, remove it rather than leave a number that may not connect.

---

## Section 3: Legal Aid Organizations (~90 minutes)

**File to edit:** `server/data/legal-aid-organizations-seed.ts`

### "Phone Changed" items
1. Visit the organization's website (`website` field).
2. Navigate to their Contact page.
3. **If the website confirms the new number:** update `phone`. Check the box.
4. **If the website is also down:** try calling the stored number. If disconnected, search `[org name] [city] contact`. Document the source.

### "Website Down" items
1. Try the URL in a browser.
2. **If redirected:** update `website`. Check the box.
3. **If the organization appears to have closed:**
   - Search `[org name] closed [year]` to confirm.
   - If closed: set `isActive: false`. Do **not** delete (historical reference). Check the box.
4. **If temporary outage:** note in the issue. The next quarterly run will re-flag if still down. Check the box.

### "Not Found on Source" items (EOIR/LSC soft flags)
These are informational — an org not appearing in EOIR or LSC does not mean it closed.

1. Visit the organization's website.
2. **If they appear to be actively serving clients:** no change needed. Add a comment: *"Org appears active; not EOIR-listed."* Check the box.
3. **If the website is gone and Google confirms it closed:** set `isActive: false`. Check the box.
4. **If unsure:** add a comment noting you checked and the status is uncertain. Check the box.

### "New on Source" (new EOIR/LSC entries)
1. Visit the EOIR entry and the organization's website.
2. Confirm:
   - Are they providing services we cover? (immigration defense, criminal defense)
   - Are they actively accepting clients?
3. **If yes:** add a new entry following the existing data structure. Set `dataSource` to `'EOIR'` or `'LSC'`. Check the box.
4. **If no or unclear:** add a comment explaining why it was not added. Check the box.

### DB Sync Note
The seed file populates the `legal_aid_organizations` database table. After making changes:
```bash
# On staging/dev — NOT production directly
npm run db:push
```
Confirm the changes applied correctly before merging the PR.

---

## Wrapping Up (15 minutes)

1. **Verify all boxes are checked.** Any unchecked item must have a comment explaining why (deferred, not applicable, needs follow-up next quarter).

2. **Update `lastUpdated` comments** at the top of each modified file with today's date.

3. **Commit your changes:**
   ```bash
   git add shared/data/detention-facilities.ts \
           shared/data/consulates.ts \
           server/data/legal-aid-organizations-seed.ts
   git commit -m "data: quarterly review $(date +%Y-Q%q) — [N] updates"
   ```

4. **Open a PR** against `main`:
   - Title: `Data Review: Q[N] [Year] — [N] contact info updates`
   - Body: link to the GitHub Issue
   - Request review from one other team member (second set of eyes on safety-critical data)

5. **After merge:** close the GitHub Issue (or it closes automatically if the PR references it with `Closes #NNN`).

---

## Tips

- **When in doubt, leave it out.** A missing phone number is better than a wrong one, especially for emergency contacts.
- **Document your sources.** Add an inline comment when you update data, noting where you verified it and when.
- **Flag recurring issues.** If the same facility or org comes up every quarter with the same problem, note it for escalation.
- **Escalate closures of ICE facilities.** If a facility closes, it may mean detainees have been transferred — this is newsworthy and worth flagging to advocacy partners if applicable.
