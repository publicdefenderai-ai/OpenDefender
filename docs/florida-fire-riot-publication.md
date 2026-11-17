# Florida wildfire and public-order charges

Ten choices from the 2026 Florida Statutes include both sampled sentencing-chart citations. Each choice binds its own conduct, grade and applicable penalty. The five fire choices cover intentional and reckless burning (§590.28(1) and (2)), disposal of lighted substances (§590.10(1)–(2)), leaving a recreational fire unattended (§590.11(1)–(2)) and obstructing wildfire prevention, detection or suppression (§590.25).

The intentional burning felony covers wild land or vegetative land-clearing debris, requires intent, and incorporates the authorization conditions in §590.125. The reckless misdemeanor covers wild lands. Both concern land outside the person's ownership or lawful possession. The summaries distinguish the grade-based criminal fine from liability under §590.14(2) for a wildfire or escaped or over-time authorized burn. That provision sets the greater of reasonable suppression expenses or $150.

Section 870.01(1)–(5) supplies five distinct choices. Affray requires consensual fighting in public that terrifies people. Riot requires willful participation in a violent disturbance involving at least three people with a common intent to assist each other in violent and disorderly conduct. The disturbance must cause injury, property damage or imminent danger of either. Aggravated riot adds a personal statutory aggravator during the riot. The crowd-size branch requires 25 *other* participants and the damage branch requires more than $5,000. The incitement choices preserve the difference between causing a riot or imminent danger of one, causing specified serious harm, and providing or teaching the preparation of a weapon with the required intent. Subsection (6) requires an appearance before a court deciding bail after arrest for the riot or incitement branches. Affray is expressly excluded.

*DeSantis v. Dream Defenders*, 389 So. 3d 413 (Fla. 2024), interprets §870.01(2). Peaceful presence at a protest that turns violent does not suffice. The participant must share the group's intent to assist the violent and disorderly conduct. The October 2024 federal appellate decision applied that construction and reversed the preliminary injunction. It assessed the likelihood of success on the facial challenges at that stage. The Chapter 870 choices preserve peaceful expression, and the aggravated-riot choice incorporates the same predicate. The retained statutes do not resolve liability for any particular protest or burn. [Florida Supreme Court opinion, SC2023-0053](https://supremecourt.flcourts.gov/content/download/2436202/opinion/Opinion_SC2023-0053.pdf) · [Eleventh Circuit opinion, 21-13489](https://media.ca11.uscourts.gov/opinions/pub/files/202113489.pdf)

The 30-row sentencing-chart benchmark now has 17 exact primary citations, ten same-section results and three absent sections (§§379.407, 483.901 and 849.23). That measures the sample only. The last item concerns property disposition; its presence in the chart does not itself establish chargeable conduct.

## Reproduce

```sh
node --import tsx scripts/data-review/florida-fire-riot/prepare.ts --check
node scripts/data-review/florida-launch/benchmark.mjs .
```
