# State review and handoff checklist

Use this checklist at the start of a state lane, before freezing a publication package, and at a bounded first-launch handoff. A milestone does not establish exhaustive statewide coverage.

1. **Reconcile identities first.** Record each existing ID, statutory citation, disposition and known hold. Reconcile all open and abandoned review PRs by substantive record changes, not their titles or receipt status. Document remaining IDs and genuine omissions separately from aliases and intentionally retired records.
2. **Choose an independent benchmark.** Select a bounded sample from official charging, instruction, ranking or statutory sources before comparing the catalog. Explain selection and limitations; assert frequency only with actual frequency data. A same-section match requires conduct/subdivision review.
3. **Prove one complete research slice.** Acquire candidate evidence without importing or activating it. Bind each charge's name, conduct, grading, sentencing, definitions, exceptions and applicable judicial limits. Retain actual retrieval times, source versions and amendment chronology. Publisher timestamps and matching hashes alone do not establish legal applicability.
4. **Reuse evidence and decisions deliberately.** Deduplicate source acquisition; preserve genuine timestamps and answered decisions. Reuse only evidence that supports the current claims. Unknown grades or penalties remain explicit gaps. Keep deliberative review materials outside public artifacts.
5. **Test meaning as well as integrity.** Re-slice quoted spans, check hashes and exact dependency sets, and independently test thresholds, ordinary grades, conditional enhancements and date boundaries. Verify translations and saved-guidance behavior before product publication. Run the pure offline manifest/eligibility path before separately authorized operational work.
6. **Freeze content before packaging.** Reconcile pending corrections, then generate the exact report, eligibility, sources, links and receipt proposal. Compare logical dependencies and deduplicated physical links. Changes after the freeze require a new matching proposal; never silently rebind an approval or refresh dates.
7. **Separate four statuses.** Report reviewed, merged, offline-eligible and verified live counts separately, with their revisions and dates. A production gap is not missing legal research, and a stored ID is not necessarily selectable. Replit's read-only production comparison and any later import, activation or deployment require their own authorized scope.
8. **Hand off a tested revision and lessons.** Recheck current main and pending same-state work, test the combined merge order, and give exact artifacts, hashes, commands and remaining blockers. Record batch size, unique sources/reuse, tests, material corrections and avoidable rework. State concrete changes for the next lane, rather than commissioning another general audit. Keep operational restoration separate from new-state research.

The [state batch registry](state-batch-registry.md) remains the integration mechanism for published batch accounting. This checklist does not create a new activation mechanism or authorize database operations.

## Required consistency checks for eligibility or identity changes

Before handing off any batch that adds, retires, holds or changes a selectable identity:

- Keep the runtime catalog, committed manifest dispositions and pure seed eligibility in agreement. Preserve source evidence and timestamps when only a disposition changes. Update independently asserted counts; do not replace them with counts derived from the same implementation.
- Run `npm run test:batch-consistency`, plus the affected state's seed/selection tests and saved-guidance/export tests. This checks manifest/seed accounting, readiness response contracts and the admin coverage endpoint in the isolated test harness. It does not run database seed commands.
- Run the coverage report without `--write` and distinguish existing coverage shortfalls from technical exceptions. An expected below-target exit is not a passing coverage gate; a thrown manifest mismatch or HTTP 500 is a new blocker.
- Run typecheck and build. Record actual exit codes, exact revisions and any unresolved failures. Before merge, test the combined order against current main and update dependent drafts so they preserve both source decisions and corrections.

Research-only packets that change none of these surfaces still require evidence replay and their focused tests; a later publication integration must run these consistency checks.
