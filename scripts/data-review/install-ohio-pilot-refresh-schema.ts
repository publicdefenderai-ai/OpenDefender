/**
 * Development post-merge installer, not a server startup migration.
 * Production installation uses the approved migration/deployment workflow.
 */
import { readFileSync } from "node:fs";
import { pool } from "../../server/db";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Use the approved production migration workflow, not the development installer");
  }
  await pool.query(readFileSync("migrations/0005_ohio_pilot_refresh.sql", "utf8"));
}
main().catch(() => {
  console.error("Ohio pilot schema installation failed");
  process.exitCode = 1;
}).finally(() => pool.end());