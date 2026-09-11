# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web learning platform. Session Replay was already enabled; Error Tracking and Support were enabled, and health, error, and support ticket signal sources are now active. Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/601014/inbox) within about 30 minutes as new data arrives and scheduled checks run.

## AI data processing

Approved by the wizard prerequisite.

## GitHub

The PostHog GitHub App was already connected before this setup. GitHub Issues was not selected as a connected tool, so no GitHub Issues responder was enabled.

## Products enabled

| Product | Result | Web SDK check |
|---|---|---|
| Session Replay | Already enabled | Clean: the browser `posthog.init` does not disable session recording. |
| Error Tracking | Enabled | Clean: the browser init explicitly enables exception capture. |
| Support (Conversations) | Enabled | An inbound email, inbox, or Slack channel must still be connected before tickets arrive. |

## Signal sources

| Signal source | Action |
|---|---|
| `health_checks` / `health_issue` | Enabled — source config `01a09038-2442-7b90-b96e-aa8e93efa835`. |
| `error_tracking` / `issue_created` | Enabled — source config `01a09038-23ef-7949-9955-f35541cfabe0`. |
| `error_tracking` / `issue_reopened` | Enabled — source config `01a09038-23f8-7db4-aa81-0d594be6e7e5`. |
| `error_tracking` / `issue_spiking` | Enabled — source config `01a09038-242d-721e-87d3-235684930fab`. |
| `conversations` / `ticket` | Enabled — source config `01a09038-244d-7dd2-8171-64e694542486`; remains idle until a Support channel is connected. |
| `signals_scout` / `cross_source_issue` | On by default; no opt-out row existed, so no row was created. |
| `session_replay` / `session_analysis_cluster` | Deliberately skipped; this retired path is replaced by Replay Vision scanners below. |
| `replay_vision` | Deliberately skipped as a source row; each scanner self-authorizes with `emits_signals: true`. |

## Connected tools

No external issue tracker, support desk, error tracker, scanner, review, or search tool was selected. No connected-tool responder was enabled.

## Scout troop

**Enabled (6 of 29 total)**

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Cross-product patterns and otherwise-uncovered surfaces. |
| `signals-scout-product-analytics` | Core product engagement-flow regressions. |
| `signals-scout-web-analytics` | Browser traffic, attribution, and landing-page health. |
| `signals-scout-observability-gaps` | Important event activity lacking analytical coverage. |
| `signals-scout-course-engagement-funnel` | Approved custom coverage for course discovery becoming start-learning intent. |
| `signals-scout-lesson-exploration-reach` | Approved custom coverage for course-content exploration becoming lesson selection. |

**Disabled canonical scouts (23)**

| Scouts | Reason |
|---|---|
| `signals-scout-ai-observability`, `signals-scout-apm`, `signals-scout-logs` | No evidence that AI observability, distributed tracing, or Logs is used. |
| `signals-scout-anomaly-detection`, `signals-scout-insight-alerts` | No established saved dashboard/insight or alert surface was found to monitor. |
| `signals-scout-conversations` | Support tickets are already routed through the native ticket source. Enable later if aggregate Support operations monitoring is needed. |
| `signals-scout-csp-violations` | No Content-Security-Policy reporting was found. |
| `signals-scout-customer-analytics` | No account/group analytics evidence was found. |
| `signals-scout-data-pipelines`, `signals-scout-data-warehouse` | No pipeline or warehouse source is connected. |
| `signals-scout-error-tracking` | Covered by the native Error Tracking signal sources. |
| `signals-scout-experiments`, `signals-scout-feature-flags` | No active experiments or feature-flag usage evidence was found. |
| `signals-scout-health-checks` | Health issues are already routed through the native health source. |
| `signals-scout-inbox-validation` | Fresh setup; there are no completed Self-driving fixes to re-measure yet. |
| `signals-scout-mcp-tool-calls`, `signals-scout-skills-store`, `signals-scout-tasks` | No matching PostHog MCP, skills-store, or task-management surface was identified. |
| `signals-scout-replay-vision`, `signals-scout-session-replay` | Replay is covered by the two Replay Vision scanners below rather than a duplicate scout route. |
| `signals-scout-revenue-analytics` | No payment or revenue-data evidence was found. |
| `signals-scout-surveys` | Surveys are not enabled or in use. |
| `signals-scout-web-vitals` | Web analytics is enabled, but no dedicated Web Vitals monitoring was selected. |

**Run budget:** 100 runs/day maximum; 0 used today and 100 remaining at setup time. The project is enrolled in early access. Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | What it watches | Discriminator and coverage gap |
|---|---|---|
| `signals-scout-course-engagement-funnel` | Course selection becoming start-learning intent. | Reports material conversion declines only when course-selection volume holds. It covers the platform-specific course journey; the built-in product scout focuses on existing saved behavioral flows. |
| `signals-scout-lesson-exploration-reach` | Course-content exploration becoming lesson selection. | Reports material reach declines only when upstream exploration remains steady. It covers the platform-specific lesson navigation seam not owned by native sources or a saved-flow scout. |

Both proposals were approved. The custom scouts require schema discovery at run time before querying, and they close out conservatively if event data is unavailable or too thin. If either becomes noisy, set `emit: false` on its scout configuration in PostHog to switch it to dry-run.

Surfaces considered but not added: replay and error bursts (already have dedicated routes), support operations (no channel yet and native ticket route is active), revenue, surveys, experiments, flags, AI observability, logs, pipelines, and account analytics (no evidence of use).

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes genuine visible defects to the inbox. It is the only part of this setup that spends Replay Vision quota. Scanner findings arrive at half weight, so independent corroboration is needed before they are promoted into a report.

| Brief | Scanner | Status | Query scope | Sampling | Estimate |
|---|---|---|---|---:|---|
| Breakage monitor | Learning journey breakage | Created | URLs containing `/courses/`, covering the course catalog and course-detail flow where learners move toward lessons. | 0.5 | 0 observations/month; 0 credits/month at setup time. |
| Frustration monitor | Learning journey frustration | Created | Sessions containing `$rageclick` only; no URL filter was added. | 1.0 | 0 observations/month; 0 credits/month at setup time. |

The organization has 2,500 Replay Vision credits remaining in the current period, no credits used, and no existing scanners. No recordings matched the estimates yet; both monitors are armed and will start working as recordings arrive.

## Files modified or created

- Created `posthog-self-driving-report.md` (this report).
- No application source files were modified.
- Installed workflow references under `.claude/skills/` for the setup and Replay Vision scanner briefs.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled ticket source can receive tickets.
- [ ] Re-authenticate the MCP connection with `property_definition:read` if you want schema discovery to be available during interactive investigations; the custom scouts will also check schema availability before acting.
- [ ] Enable another canonical scout later only when its product surface is actively used; the remaining fleet is intentionally disabled to keep the troop selective.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scouts draw from the project’s 100-run daily budget, and their findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/601014/inbox). Immediately actionable reports can begin coding tasks after they are reviewed.
