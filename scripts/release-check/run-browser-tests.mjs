import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const releasePort = "5001";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const releaseCheckAdminToken = randomBytes(32).toString("hex");

function releaseCheckEnvironment() {
  const safeEnvironment = Object.fromEntries(
    Object.entries(process.env).filter(([name]) =>
      !/(?:KEY|TOKEN|SECRET|PASSWORD|PASS|CREDENTIAL|DATABASE|PAT)$/i.test(name)
    ),
  );
  return {
    ...safeEnvironment,
    RELEASE_CHECK: "true",
    RELEASE_CHECK_ADMIN_TOKEN: releaseCheckAdminToken,
  };
}

const buildProcess = spawnSync(npmCommand, ["run", "build"], {
  env: { ...releaseCheckEnvironment(), NODE_ENV: "production" },
  stdio: "inherit",
});

if (buildProcess.error) {
  console.error("Release build failed to start:", buildProcess.error);
  process.exit(1);
}

if (buildProcess.status !== 0) {
  process.exit(buildProcess.status ?? 1);
}

const sourceReadinessProcess = spawnSync(
  process.execPath,
  ["scripts/release-check/check-source-readiness.mjs"],
  {
    env: releaseCheckEnvironment(),
    stdio: "inherit",
  },
);

if (sourceReadinessProcess.error) {
  console.error("Source-readiness release check failed to start:", sourceReadinessProcess.error);
  process.exit(1);
}

if (sourceReadinessProcess.status !== 0) {
  process.exit(sourceReadinessProcess.status ?? 1);
}

const testProcess = spawn(
  command,
  [
    "playwright",
    "test",
    "--config",
    "playwright.release.config.ts",
    "tests/e2e/navigation-accessibility.spec.ts",
    "tests/e2e/legal-review-l03-l04.spec.ts",
    "tests/e2e/immigration-content-updates.spec.ts",
    "tests/e2e/caregiver-forms.spec.ts",
    "tests/e2e/design-fidelity.spec.ts",
    "tests/e2e/urgent-help-design.spec.ts",
    "tests/e2e/urgent-guides.spec.ts",
    "tests/e2e/case-guidance-design.spec.ts",
    "tests/e2e/case-results-design.spec.ts",
    "tests/e2e/chat-design.spec.ts",
    "tests/e2e/chat-intake-parity.spec.ts",
    "tests/e2e/document-summarizer-design.spec.ts",
    "tests/e2e/letter-generator-design.spec.ts",
    "tests/e2e/how-to-design.spec.ts",
    "tests/e2e/rights-design.spec.ts",
    "tests/e2e/case-timeline-design.spec.ts",
    "tests/e2e/legal-resources-design.spec.ts",
    "tests/e2e/standalone-guides-design.spec.ts",
    "tests/e2e/right-to-counsel-design.spec.ts",
    "tests/e2e/immigration-situations-design.spec.ts",
    "tests/e2e/data-sources-design.spec.ts",
    "tests/e2e/developer-design.spec.ts",
    "tests/e2e/friends-family-design.spec.ts",
  "tests/e2e/support-hub-design.spec.ts",
  "tests/e2e/employment-design.spec.ts",
  "tests/e2e/finances-design.spec.ts",
  "tests/e2e/housing-design.spec.ts",
  "tests/e2e/transportation-design.spec.ts",
  "tests/e2e/childcare-design.spec.ts",
  "tests/e2e/family-care-design.spec.ts",
  "tests/e2e/mental-health-design.spec.ts",
  "tests/e2e/personal-health-design.spec.ts",
  "tests/e2e/record-clearance-design.spec.ts",
  "tests/e2e/reentry-design.spec.ts",
  "tests/e2e/court-records-design.spec.ts",
  "tests/e2e/court-date-guide-design.spec.ts",
  "tests/e2e/court-logistics-design.spec.ts",
  "tests/e2e/mitigation-builder-design.spec.ts",
  "tests/e2e/pd-intake-design.spec.ts",
  "tests/e2e/bail-preparation-design.spec.ts",
  "tests/e2e/court-locator-design.spec.ts",
  "tests/e2e/reputation-design.spec.ts",
    "tests/e2e/family-toolkit-design.spec.ts",
    "tests/e2e/collateral-design.spec.ts",
    "tests/e2e/directory-design.spec.ts",
    "tests/e2e/nrrc-resources.spec.ts",
    "tests/e2e/case-guidance-timeout-recovery.spec.ts",
    "tests/e2e/california-legacy-reselection.spec.ts",
    "tests/e2e/first24-design.spec.ts",
    "tests/e2e/design-review-regressions.spec.ts",
    "tests/e2e/export-release-gate.spec.ts",
    "tests/e2e/authority-boundary-release.spec.ts",
    "tests/e2e/charge-catalog-pagination.spec.ts",
    "tests/e2e/ohio-common-charge-release.spec.ts",
    "tests/e2e/ohio-major-publication-release.spec.ts",
    "tests/e2e/ohio-residual-publication-release.spec.ts",
    "tests/e2e/ohio-theft-fraud-publication-release.spec.ts",
    "tests/e2e/ohio-benefits-fraud-publication-release.spec.ts",
    "tests/e2e/ohio-justice-publication-release.spec.ts",
    "tests/e2e/ohio-animal-protection-publication-release.spec.ts",
    "tests/e2e/ohio-tools-transactions-publication-release.spec.ts",
    "tests/e2e/ohio-dangerous-driving-publication-release.spec.ts",
    "tests/e2e/ohio-crash-identity-publication-release.spec.ts",
    "tests/e2e/ohio-driving-license-publication-release.spec.ts",
    "tests/e2e/ohio-gambling-publication-release.spec.ts",
    "tests/e2e/ohio-weapons-location-publication-release.spec.ts",
    "tests/e2e/ohio-drug-remainder-publication-release.spec.ts",
    "tests/e2e/ohio-drug-conduct-publication-release.spec.ts",
    "tests/e2e/ohio-commercial-sex-publication-release.spec.ts",
    "tests/e2e/ohio-priority-gaps-publication-release.spec.ts",
    "tests/e2e/ohio-privacy-publication-release.spec.ts",
    "tests/e2e/ohio-protection-publication-release.spec.ts",
    "tests/e2e/ohio-family-publication-release.spec.ts",
    "tests/e2e/ohio-public-peace-publication-release.spec.ts",
    "tests/e2e/ohio-custody-publication-release.spec.ts",
    "tests/e2e/florida-persons-publication-release.spec.ts",
    "tests/e2e/florida-robbery-publication-release.spec.ts",
    "tests/e2e/florida-false-reports-publication-release.spec.ts",
    "tests/e2e/florida-road-racing-publication-release.spec.ts",
    "tests/e2e/florida-court-officials-publication-release.spec.ts",
    "tests/e2e/florida-justice-publication-release.spec.ts",
    "tests/e2e/florida-credit-card-publication-release.spec.ts",
    "tests/e2e/florida-restraint-publication-release.spec.ts",
    "tests/e2e/florida-crash-flight-publication-release.spec.ts",
    "tests/e2e/florida-legacy-property-release.spec.ts",
    "tests/e2e/florida-legacy-sexual-release.spec.ts",
    "tests/e2e/florida-legacy-remaining-release.spec.ts",
    "tests/e2e/california-batch-one-release.spec.ts",
    "tests/e2e/california-controlled-substances-release.spec.ts",
    "tests/e2e/california-drug-successor-release.spec.ts",
    "tests/e2e/california-driving-publication-release.spec.ts",
    "tests/e2e/california-traffic-release.spec.ts",
    "tests/e2e/california-vehicle-identification-release.spec.ts",
    "tests/e2e/california-violence-detention-release.spec.ts",
    "tests/e2e/california-sexual-offenses-release.spec.ts",
    "tests/e2e/california-registration-exploitation-release.spec.ts",
    "tests/e2e/california-weapons-threats-release.spec.ts",
    "tests/e2e/california-weapons-eligibility-release.spec.ts",
    "tests/e2e/california-justice-custody-release.spec.ts",
    "tests/e2e/california-property-arson-release.spec.ts",
    "tests/e2e/california-financial-tax-release.spec.ts",
    "tests/e2e/california-public-order-release.spec.ts",
    "tests/e2e/california-repeat-theft-assembly-release.spec.ts",
    "tests/e2e/california-financial-identity-release.spec.ts",
    "tests/e2e/california-officials-custody-release.spec.ts",
    "tests/e2e/california-reviewed-aliases-release.spec.ts",
    "tests/e2e/california-theft-animal-release.spec.ts",
    "tests/e2e/california-trespass-release.spec.ts",
    "tests/e2e/california-theft-conduct-release.spec.ts",
    "tests/e2e/california-priority-person-release.spec.ts",
    "tests/e2e/california-public-conduct-knives-release.spec.ts",
    "tests/e2e/california-other-code-priority-release.spec.ts",
      "tests/e2e/california-benefit-program-release.spec.ts",
      "tests/e2e/california-assault-weapon-conduct-release.spec.ts",
      "tests/e2e/california-loaded-firearm-release.spec.ts",
      "tests/e2e/california-engaging-conduct-release.spec.ts",
    "tests/e2e/source-readiness-gate.spec.ts",
    "tests/e2e/multilingual-mobile-layout.spec.ts",
    "tests/e2e/localized-mobile-actions.spec.ts",
  ],
  {
    env: {
      ...releaseCheckEnvironment(),
      RELEASE_CHECK_PORT: releasePort,
      PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${releasePort}`,
    },
    stdio: "inherit",
  },
);

testProcess.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});