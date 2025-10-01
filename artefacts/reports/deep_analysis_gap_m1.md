# Deep Analysis Gap Report – M1 (Governance & Self-Healing)

## 1. Übersicht (Ziel M1)
M1 zielt auf eine self-healing Governance-Basis mit Health-Check, konsistenter Prompt-Ausgabe sowie Reibungsreduktion für Operatoren (AT-001, AT-002, AT-PATCH-01).【F:artefacts/project_plan_v0.4.md†L17-L29】

## 2. Gap-Tabelle
| Ticket | Soll-Deliverables | Ist im Repo | Status | Kommentar |
| --- | --- | --- | --- | --- |
| AT-001 | Health-Check Script (docs-lite)【F:artefacts/project_plan_v0.4.md†L21-L21】 | `tools/health-check.mjs`, `npm run health` und CI-Step vorhanden; docs-lite Workflow hält Markdown hygienisch.【F:tools/health-check.mjs†L1-L1】【F:package.json†L5-L7】【F:.github/workflows/ci.yml†L1-L14】【F:.github/workflows/docs-lite.yml†L1-L34】 | OK | Iteration-Log dokumentiert Umsetzung, aber keine persistierten CI-Metriken als Evidence.【F:artefacts/iteration_log.md†L23-L66】【f93e8e†L1-L1】 |
| AT-002 | Execution Prompt Output + Governance Workflow (Prettier, UTF-8, Validator, Auto-Format)【F:artefacts/project_plan_v0.4.md†L22-L22】 | Governance-Workflow plus UTF-8- & Ticket-Validator vorhanden; Auto-Format-Job inkl. Guardrail aktiv.【F:.github/workflows/governance.yml†L1-L120】【F:scripts/check-utf8.mjs†L1-L71】【F:scripts/validate-ticket.mjs†L1-L120】【F:.github/workflows/auto-format.yml†L1-L71】 | Drift | Kein abgelegter Execution-Prompt-Output oder Prompt-Registry vorhanden, Loop-Logs fehlen; Operator-Handbuch beschreibt Prozess nur theoretisch.【0aebeb†L1-L2】【263afd†L1-L1】【F:artefacts/AT-002_Operator_Handbuch.md†L1-L152】 |
| AT-PATCH-01 | Friction Reduction Bundle (PR-Template, Issue-Form, Editor Defaults, VS Code Tasks, Hybrid Trigger, Guardrail)【F:artefacts/project_plan_v0.4.md†L23-L29】 | Guardrail via `MAX_AUTOFIX_COMMITS` in Auto-Format vorhanden; `.prettierignore` gepflegt.【F:.github/workflows/auto-format.yml†L23-L71】【F:.prettierignore†L1-L2】 | Drift | PR-Template, Issue-Form, `.editorconfig`, VS Code Tasks und Hybrid-Trigger fehlen vollständig.【a87a73†L1-L1】【4357b9†L1-L2】【0b26fe†L1-L2】【cb8957†L1-L1】【2d9890†L1-L6】 |

## 3. Globale Gaps
- **Friction-Bundle unvollständig:** Wichtige Operator-Artefakte (PR-Template, Issue-Form, `.editorconfig`, VS-Code-Tasks, Hybrid-Trigger) fehlen trotz Verpflichtung in M1.【F:artefacts/project_plan_v0.4.md†L23-L29】【a87a73†L1-L1】【4357b9†L1-L2】【0b26fe†L1-L2】【cb8957†L1-L1】【2d9890†L1-L6】
- **Execution-Prompt-Evidence fehlt:** Es gibt keine abgelegten Prompt-Ausgaben oder Loop-Logs, obwohl AT-002 Governance- und Feedback-Automatisierung fordert.【F:artefacts/project_plan_v0.4.md†L22-L22】【0aebeb†L1-L2】【263afd†L1-L1】
- **Artefakt-Drift in Systemkarte/Loops:** Systemkarte und Execution-Loop referenzieren Prompt-Registry, Issue-Forms und `.foundation.yml`, die im Repo nicht existieren.【F:artefacts/systemkarte.md†L15-L102】【F:artefacts/loops/Execution_Loop.md†L7-L34】【0aebeb†L1-L2】【a87a73†L1-L1】【4357b9†L1-L2】【0b26fe†L1-L2】
- **Evidence & Metriken unvollständig:** `scripts/ci-metrics.mjs` schreibt JSONL-Berichte, aber es gibt keine erzeugten `ci-metrics.jsonl`-Artefakte; CI-Green-Rate bleibt unbelegt.【F:scripts/ci-metrics.mjs†L1-L24】【f93e8e†L1-L1】

## 4. Handlungsempfehlungen (priorisiert)
1. **Friction-Bundle fertigstellen:** PR-Template mit DoD-Checkliste, Issue-Form, `.editorconfig`, VS-Code-Tasks und `/codex`-Trigger ergänzen, um Operator-Actions zu reduzieren und Planverpflichtungen zu erfüllen.【F:artefacts/project_plan_v0.4.md†L23-L29】【a87a73†L1-L1】【4357b9†L1-L2】【0b26fe†L1-L2】【cb8957†L1-L1】【2d9890†L1-L6】
2. **Execution-Prompt-Outputs & Loop-Logs materialisieren:** Prompt-Resultate (z. B. Meta-Prompt-Versionen) im Repo ablegen und `tools/loop-log.mjs` in den Workflows verankern, um Governance/Feedback-DoD nachweisbar zu machen.【F:artefacts/project_plan_v0.4.md†L22-L22】【0aebeb†L1-L2】【263afd†L1-L1】【F:tools/loop-log.mjs†L1-L118】
3. **Systemkarte & Loop-Dokumente harmonisieren:** Nicht existierende Artefakte entfernen oder implementieren (Prompt-Registry, Issue-Forms, `.foundation.yml`), damit Dokumentation und Repo übereinstimmen.【F:artefacts/systemkarte.md†L15-L102】【F:artefacts/loops/Execution_Loop.md†L7-L34】【0aebeb†L1-L2】【a87a73†L1-L1】【4357b9†L1-L2】【0b26fe†L1-L2】
4. **CI-Evidence automatisieren:** Sicherstellen, dass Governance/Auto-Format Workflows `scripts/ci-metrics.mjs` erfolgreich ausführen und `artefacts/reports/ci-metrics.jsonl` versionieren, um KPIs (Green-Rate) belegbar zu machen.【F:scripts/ci-metrics.mjs†L1-L24】【f93e8e†L1-L1】
