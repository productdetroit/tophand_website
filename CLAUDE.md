# TopHand marketing site — Claude Code Project Guide

The public marketing site at **tophand.ag**. The product itself is a separate repository,
`productdetroit/app.tophand.ag`, running at **app.tophand.ag**. Both ship under Jira project
`KAN`; this repo is where the pricing page, trial form, and the legal pages Twilio compliance
requires (`/privacy`, `/messaging-terms`) live.

## Stack

Next.js (App Router) + TypeScript, deployed on Vercel as the `tophand-website` project. Deploy by
pushing to GitHub — never drive Vercel directly.

## Tickets and status

- **Reference the KAN ticket in the branch name and the commit subject** when the work has one
  (`feat/kan-123-legal-pages`, `KAN-123: add /privacy and /messaging-terms`). The **Ticket check**
  looks in the branch name, PR title, PR body and commit subjects, and asks Jira whether the key
  actually resolves.
- **Status is derived from git.** Pushing a branch moves its tickets to In Progress; merging to
  `main` moves them to Done ([.github/workflows/jira-sync.yml](.github/workflows/jira-sync.yml)).
  Only the commit **subject** is read — a key in a body is a reference, not a delivery.
- **Why this repo has these at all:** KAN-123 shipped here on 27 July and sat in `Idea` for three
  weeks. It was live in production the whole time. It went unnoticed because this repository had
  no guardrails and nothing measured it, while the app repository had both.

Drift detection lives in the app repository and reads **both** repos, so there is no separate
weekly job here.

## Conventions

- One change per PR; PR-then-merge on `main`. A push to `main` deploys production.
- Branch from `origin/main`.
- This site is public-facing marketing copy. Product claims should match what
  `app.tophand.ag` actually does — if a claim here outlives the feature, that is the same
  documentation drift the trackers are built to prevent, just aimed at customers.
