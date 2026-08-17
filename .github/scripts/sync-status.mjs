/** Mechanism 3 (KAN-212): ticket status as a function of git.
 *
 *  On the default branch every ticket owning a commit in the pushed range
 *  moves to Done. On a feature branch it moves to the in-review state, which
 *  is what finally makes that state transient — something other than a
 *  person's attention moves it.
 *
 *  Never fails the build. A Jira outage must not block a merge; the drift it
 *  causes is what the scheduled reconciliation is for.
 */
import { keysFromSubject, advanceTo, haveCredentials } from "./jira-lib.mjs";

const PREFIXES = (process.env.TICKET_PREFIXES ?? "KAN").split(",").map((s) => s.trim());
const LADDER = (process.env.STATUS_LADDER ?? "Idea,To Do,In Progress,Testing,Done")
  .split(",")
  .map((s) => s.trim());
const target = process.env.TARGET_STATUS ?? "Done";
const subjects = (process.env.COMMIT_SUBJECTS ?? "").split("\n").filter(Boolean);

const note = (msg) => {
  console.log(msg);
  const f = process.env.GITHUB_STEP_SUMMARY;
  if (f) import("node:fs").then((fs) => fs.appendFileSync(f, msg + "\n"));
};

if (!haveCredentials()) {
  note("JIRA_EMAIL / JIRA_API_TOKEN not set — skipping status sync (not a failure).");
  process.exit(0);
}

const keys = new Set();
for (const s of subjects) for (const k of keysFromSubject(s, PREFIXES)) keys.add(k);

if (keys.size === 0) {
  note(`No ticket keys in ${subjects.length} commit subject(s) — nothing to sync.`);
  process.exit(0);
}

note(`### Jira sync → ${target}\n`);
const results = [];
for (const key of keys) {
  try {
    results.push(await advanceTo(key, target, LADDER));
  } catch (err) {
    results.push({ key, result: "error", detail: String(err) });
  }
}

const label = {
  moved: "moved",
  already: "already there",
  backwards: "left alone (would move backwards)",
  "skipped-epic": "skipped (epic — closes when its children do)",
  unavailable: "no such transition from its current status",
  notfound: "not found in Jira",
  error: "error",
};

for (const r of results) {
  const detail = r.from ? ` (${r.from}${r.result === "moved" ? ` → ${r.to}` : ""})` : "";
  note(`- \`${r.key}\` — ${label[r.result] ?? r.result}${detail}${r.detail ? ` — ${r.detail}` : ""}`);
}

const moved = results.filter((r) => r.result === "moved").length;
note(`\n${moved} of ${results.length} ticket(s) moved to ${target}.`);
