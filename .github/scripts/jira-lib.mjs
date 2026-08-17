/** Shared Jira helpers for the CI ticket rules (KAN-212).
 *
 *  Two deliberate choices worth keeping:
 *
 *  1. Transitions resolve by status NAME, never by id. MOT and KAN use the
 *     same names with different ids — on MOT id 41 is Done, on KAN id 41 is
 *     Testing. A hardcoded id silently does the wrong thing in one repo.
 *
 *  2. Only forward movement. A stray push must never drag a Done issue back.
 */

const BASE = process.env.JIRA_BASE_URL ?? "https://productdetroit.atlassian.net";
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_API_TOKEN;

export function haveCredentials() {
  return Boolean(EMAIL && TOKEN);
}

function auth() {
  return "Basic " + Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");
}

export async function jira(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      Authorization: auth(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON error pages are reported via status */
  }
  return { ok: res.ok, status: res.status, body, text };
}

/** Ticket keys from a commit SUBJECT only.
 *
 *  Bodies are excluded on purpose. A key in a body is a reference, not a
 *  delivery — a commit that explains itself by naming the ticket it builds on
 *  must not close that ticket. The sibling repo has live examples where a key
 *  appears on main solely as an unresolved decision; closing those from a body
 *  mention would erase the constraint.
 *
 *  Compound subjects are expanded: "KAN-185/186" yields both keys, which is
 *  the form this repo actually uses.
 */
export function keysFromSubject(subject, prefixes) {
  const alt = prefixes.join("|");
  const re = new RegExp(`(${alt})-([0-9]+)((?:/[0-9]+)*)`, "gi");
  const out = new Set();
  let m;
  while ((m = re.exec(subject)) !== null) {
    const prefix = m[1].toUpperCase();
    out.add(`${prefix}-${m[2]}`);
    for (const extra of (m[3] ?? "").split("/").filter(Boolean)) {
      out.add(`${prefix}-${extra}`);
    }
  }
  return [...out];
}

/** Resolvable means the issue exists — not that the string looks like a key. */
export async function resolveIssue(key) {
  const r = await jira(`/rest/api/3/issue/${key}?fields=issuetype,status,summary`);
  if (!r.ok) return null;
  return {
    key,
    type: r.body.fields.issuetype?.name ?? "",
    status: r.body.fields.status?.name ?? "",
    summary: r.body.fields.summary ?? "",
  };
}

/** Move `key` to `targetName`, but only forwards along `ladder`.
 *  Returns one of: moved | already | backwards | unavailable | notfound | error
 */
export async function advanceTo(key, targetName, ladder) {
  const issue = await resolveIssue(key);
  if (!issue) return { key, result: "notfound" };

  if (issue.type === "Epic") {
    return { key, result: "skipped-epic", from: issue.status };
  }

  const rank = (name) => ladder.findIndex((s) => s.toLowerCase() === name.toLowerCase());
  const from = rank(issue.status);
  const to = rank(targetName);

  if (issue.status.toLowerCase() === targetName.toLowerCase()) {
    return { key, result: "already", from: issue.status };
  }
  if (from >= 0 && to >= 0 && to < from) {
    return { key, result: "backwards", from: issue.status, to: targetName };
  }

  const t = await jira(`/rest/api/3/issue/${key}/transitions`);
  if (!t.ok) return { key, result: "error", detail: `transitions ${t.status}` };

  const match = (t.body.transitions ?? []).find(
    (x) =>
      (x.to?.name ?? x.name ?? "").toLowerCase() === targetName.toLowerCase(),
  );
  if (!match) {
    return { key, result: "unavailable", from: issue.status, to: targetName };
  }

  const done = await jira(`/rest/api/3/issue/${key}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: match.id } }),
  });
  if (!done.ok) return { key, result: "error", detail: `transition ${done.status}` };
  return { key, result: "moved", from: issue.status, to: targetName };
}
