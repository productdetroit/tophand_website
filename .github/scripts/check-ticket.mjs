/** Mechanism 2 (KAN-212): fail a pull request that does not resolve to a ticket.
 *
 *  The branch convention already exists — mot-133-phase-11-valuation,
 *  mot-16x-studio, feat/kan-207-... — it simply was not enforced. This makes
 *  violation fail loudly instead of silently costing a reconciliation later.
 *
 *  Looks in the branch name, the PR title, the PR body and every commit
 *  subject. Any one resolvable key is enough.
 */
import { keysFromSubject, resolveIssue, haveCredentials } from "./jira-lib.mjs";

const PREFIXES = (process.env.TICKET_PREFIXES ?? "KAN").split(",").map((s) => s.trim());
const branch = process.env.PR_BRANCH ?? "";
const title = process.env.PR_TITLE ?? "";
const body = process.env.PR_BODY ?? "";
const subjects = (process.env.COMMIT_SUBJECTS ?? "").split("\n").filter(Boolean);

const sources = [
  ["branch name", branch],
  ["PR title", title],
  ["PR body", body],
  ...subjects.map((s) => ["commit", s]),
];

const candidates = new Map();
for (const [where, text] of sources) {
  for (const key of keysFromSubject(text, PREFIXES)) {
    if (!candidates.has(key)) candidates.set(key, where);
  }
}

if (candidates.size === 0) {
  console.error(
    `No ticket key found.\n\n` +
      `This PR must reference a ${PREFIXES.join(" or ")} ticket in its branch name, ` +
      `title, body, or a commit subject.\n` +
      `Branch convention: ${PREFIXES[0].toLowerCase()}-<number>-<short-description>\n` +
      `Checked: branch "${branch}", the PR title and body, and ${subjects.length} commit subject(s).`,
  );
  process.exit(1);
}

if (!haveCredentials()) {
  console.error(
    `Found ${[...candidates.keys()].join(", ")} but JIRA_EMAIL / JIRA_API_TOKEN are not set, ` +
      `so the key could not be confirmed to exist.\n` +
      `Add both as repository secrets — a key that merely matches the pattern is not a resolvable ticket.`,
  );
  process.exit(1);
}

const resolved = [];
const missing = [];
for (const [key, where] of candidates) {
  const issue = await resolveIssue(key);
  if (issue) resolved.push({ ...issue, where });
  else missing.push({ key, where });
}

for (const r of resolved) {
  console.log(`ok  ${r.key}  [${r.type}/${r.status}]  ${r.summary}  (from ${r.where})`);
}
for (const m of missing) {
  console.log(`--  ${m.key} does not exist in Jira (from ${m.where})`);
}

if (resolved.length === 0) {
  console.error(
    `\nTicket key(s) present but none exist in Jira: ${missing.map((m) => m.key).join(", ")}.\n` +
      `A key that matches the pattern but resolves to nothing is exactly the drift this check exists to stop.`,
  );
  process.exit(1);
}

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(
    summary,
    `### Ticket check\n\n` +
      resolved.map((r) => `- **${r.key}** (${r.type}, ${r.status}) — ${r.summary}`).join("\n") +
      `\n`,
  );
}
console.log(`\nResolved ${resolved.length} ticket(s).`);
