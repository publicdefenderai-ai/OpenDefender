# Cross-state source verification and availability

Routine legal-source verification occurs quarterly, not weekly. The standard applies to all fifty states, DC and federal sources. It is a maintenance policy, not a claim that every jurisdiction has completed substantive review.

## Distinct responsibilities

1. **Existing legal review:** preserve approved statutory identities, conduct, penalties, attorney decisions, removals, source/version bindings and holds. Availability probes cannot approve or amend any of them.
2. **Quarterly comparison:** compare reviewed sources with newly acquired official evidence. Unchanged text and operative metadata can retain approval. Changed or missing provisions require targeted review; never infer legal effect from a changed archive hash alone. Known future transitions and court-related holds can require attention before a routine quarter ends.
3. **Weekly availability:** bounded public requests detect redirects, inaccessible pages and missing expected markers. No database, authenticated application endpoint, import, source-pin update, receipt renewal or legal interpretation occurs.

## Receipt migration is explicit

New verified receipts use `verificationPolicy: quarterly-v1`. Their deadlines are three calendar months after the evidence acquisition anchor, clamped at month end and preserving UTC time. When a batch combines acquisitions, use the oldest supporting retrieval, never merely the generator's current clock.

Ohio reviewed quarterly receipts must include one acquisition attestation per approved dependency: section, content hash and retrieval time. The validator requires the complete unique dependency set, rejects hash mismatches and invalid or post-review retrieval times, and caps expiry at three calendar months after the oldest attested acquisition. Issuance records comparison completion time so acquisitions made during the run precede the review. Regenerating the same acquisitions later cannot extend their deadline. Historical source retrieval dates are not substituted for the newly compared acquisitions.

Legacy receipts are not reinterpreted. They keep their exact recorded deadlines. This PR edits no receipt, source pin, eligibility file, legal decision, source hold or deployed setting. Moving a live state to the quarterly policy requires a genuinely supported comparison, review of its resulting receipt, and separately approved activation/deployment. Merely adding the policy field or extending a date in JSON is not an authorized renewal.

CA, Ohio pilot, Ohio separately reviewed sources, and Florida receipt validators support the explicit policy. Their routine issuance paths produce quarterly receipts. For the Ohio major-publication batch, run `node --import tsx scripts/data-review/refresh-ohio-major-sources.ts` to compare every dependency against the reviewed packet. Follow a successful comparison with `node --import tsx scripts/data-review/prepare-ohio-major-publication.ts`. The first command retains matching acquisition records, including actual retrieval times. The second reproduces the packet and quarterly deadline from those records. Replaying it later preserves the same deadline.

Other jurisdictions currently use manifest/source-specific controls. Their absence from the receipt monitor is **not** current verification or quarterly approval. Before adding a receipt for another state, bind a verified acquisition and reviewed dependency set using that state's adapter. Do not manufacture review dates from manifest generation timestamps. State-specific holds and activation requirements remain authoritative.

Quarterly scheduling alone does not remove existing runtime expiry gates. Changing behavior after an overdue verification is a separate product/safety decision; this PR does not silently make expired or held content selectable.

## Weekly monitoring, disabled until authorized

`.github/workflows/source-availability.yml` runs weekly only after an operator explicitly sets `SOURCE_AVAILABILITY_ENABLED=true`. No such setting is made by this PR. It uses read-only repository access and public source URLs; no production or database credential is required.

The inventory includes configured official portals, retained manifest section URLs, California statutory pins, and Ohio/Florida retained source-first evidence. Jurisdictions without retained section URLs are explicitly reported as portal-only; a working homepage is not verification that a statute is available. Pending/new source formats must extend the inventory and tests before claiming monitoring coverage.

Responses are bounded to ten seconds and 512 KB per URL, with four concurrent requests and a twenty-minute overall budget. Redirects are reported rather than followed. Binary content and HTTP-200 pages lacking recognizable section markers remain unconfirmed. Access challenges are not bypassed. Raw response bodies are not stored in reports.

The URL order rotates weekly; if the budget is exhausted, unchecked sources are counted and the job does not report complete coverage. Failure state is cached across runs. A new transient source failure is recorded; the second consecutive failure alerts, and unchanged persistent failures do not repeatedly alert. Missing cache history delays persistence classification until another observation. The artifact contains public-source URLs, statuses and counts only.

The same job reports existing receipt deadlines. Quarterly receipts receive a fourteen-day lead warning; legacy receipts retain a forty-eight-hour warning. Only newly changed actionable deadline states trigger notification. Unknown receipt policies fail validation. These checks are scheduling/integrity diagnostics, not substantive approval.

The former six-hour Ohio workflow is now manual-only so it cannot silently renew receipts or reseed production. Any operator-authorized Ohio refresh still obeys its database lease, source comparison, review, and activation boundaries. No monitoring or database prerequisite is installed here.

## California comparison-only safety

`refresh-retained.py --acquire --transport curl --candidate <local-directory>` without `--activate-unchanged` writes only candidate evidence. It no longer invalidates or replaces the active receipt/comparison during a research-only run. The explicit activation option retains its fail-closed behavior and requires separate authorization. Candidate acquisitions must still be recent when approved; a quarterly review interval is not permission to activate an old unreviewed download.

## Verification

- Policy tests cover calendar/leap-year boundaries, legacy non-extension, unknown-policy rejection, source-bound quarterly receipts, markers, blocked HTTP-200 responses, redirect refusal and persistent-failure deduplication.
- California Python tests prove comparison-only execution cannot alter active evidence and that quarter dates agree with calendar semantics.
- Existing source, expiry, dependency, hold and Ohio separation tests remain required.
- Do not run a live renewal or activate the workflow as part of this code review.
