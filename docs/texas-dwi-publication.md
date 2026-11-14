# Texas DWI authority integration

Four choices use Penal Code §49.04(a) for the conduct and identify their grading subdivisions separately.

| Choice | Stable ID | Grading provision |
|---|---|---|
| Ordinary Class B | tx-dui-first-offense | §49.04(b) |
| Open alcohol container in immediate possession | tx-dwi-open-container | §49.04(c) |
| Specimen analysis at 0.15 or more | tx-dwi-bac-015 | §49.04(d) |
| One qualifying prior | tx-dui-second-offense | §49.09(a), subject to (b) |

The narrower labels distinguish these branches in the selector. The two existing IDs survive. Saved answers without an ID and with only a Texas DWI section cannot safely identify a branch. Guidance includes the September 1, 2025 school-crossing-zone change, enhanced prior-conviction rules and the additional Transportation Code §709.001 fine with its indigency waiver. English content is labeled when requested in Spanish or Chinese.

The acquisition importer and offline replay use the same TCSS section parser and manifest builder. The primary title must match the official DWI heading. Each supporting role allows only its declared code, section, subdivision, official URL and reviewed full-text hash. The seed builder revalidates selectable DWI records before writes. The current-selection and provenance paths require a completed import, matching current links and the reviewed database-format content hash. An old successful ingestion lacks these links and withholds both existing DWI IDs as well as the two new ones. Other Texas identities retain their earlier evidence and dispositions.

There are 113 Texas manifest rows, 35 eligible choices in the prepared seed, 78 held rows and 38 distinct sources. The current public observation in the preceding benchmark recorded 33 live choices. Deployment with the old ingestion would leave at most 31 of those choices available until an authorized import binds the new evidence. Check actual production counts, each ID and its supporting links separately after any approved import. Merging code does not establish live availability.

To replay only the four records, download the four exact TCSS chapters named in the benchmark to a directory, verify the retained chapter hashes, then run the offline replay. Its output is a candidate for comparison and does not access a database.

```sh
python3 scripts/data-review/texas-verification/check_dwi_sources.py /path/to/chapters
node --import tsx scripts/data-review/texas-verification/replay-dwi.ts /path/to/chapters
```

The benchmark's November 13 Pacific observation and its compact manifest identity index remain historical. No new comparison of the other 109 catalog records or statewide renewal is implied by the DWI manifest assembly time.
