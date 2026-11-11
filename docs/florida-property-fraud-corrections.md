# Florida property and fraud corrections

This batch corrects seven existing Chapter 812 records and six Chapter 817 records in the older 101-record reviewed family. It brings the number of distinct records addressed by the correction batches to 67. The remaining 34 are outside these batches. These figures measure work on the existing catalog, not statewide completeness or live availability.

| Statutory scope | Records | Product and evidence changes |
| --- | ---: | --- |
| §812.014(2)(e), (2)(f), (3)(a), (3)(b), (3)(c) | 5 | Distinguish the under-$40 dwelling branch, ordinary value and residual branches, prior convictions, the gasoline license suspension and the special fine or service provision for repeat petit theft from specified victims. |
| §812.015(8)–(11) | 1 | Preserve the different retail-theft grading branches and bind the operative definition and required restitution under (12). Subsection (10) concerns multi-circuit aggregation and prosecution. |
| §812.019 | 1 | Preserve the two grades and describe the §812.025 verdict limitation when theft and dealing counts concern the same scheme. |
| §817.234(1)(a) | 1 | Separate the value-dependent felony ranges from the additional civil penalty for fraud aimed at obtaining motor-vehicle insurance proceeds. |
| §817.568(2), (4), (8), (9) | 4 | Distinguish actual use from possession when applying higher thresholds, the ordinary harassment misdemeanor and its alternatives, the mandatory $1,001 surcharge and possible restitution. |
| §817.61 | 1 | Link the six-month use and value allegations to the distinct misdemeanor and felony penalties in §817.67. |

The packet binds the 2026 official Florida Statutes by section, citation and text hash. Of the 16 retained sections, 11 were obtained for this batch and five reused from prior packets. The effective-date evidence for the conditional domestic-violence provision is limited to chapter 2026-86. All 13 records retain their existing names, IDs and translated summaries. The charge under §812.014(2)(e) and the §817.61 charge now show the ordinary misdemeanor first. Section 817.568(4) gains a supported conditional felony category. The primary-tier totals shift two records from felony to misdemeanor.

The reviewed-family receipt remains expired and does not bind the corrected aggregate. This batch supplies neither a replacement receipt nor evidence of live availability.

To reproduce the packet without network or database access:

```sh
node --import tsx scripts/data-review/florida-property-fraud/prepare.ts --check
```
