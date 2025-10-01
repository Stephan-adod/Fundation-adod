# AT-PATCH-11: Green-Rate Hardening & Shadow Mode

## Ziel
Die Green-Rate in CI dauerhaft ≥95 % halten und Operator-Friktion reduzieren.  

Dies geschieht durch:  
- Auto-Format Workflow → non-blocking, Self-Healing via Auto-Fix (max. 2 Commits).  
- Governance Workflow → non-strict Checks nur informativ, strict nur für neue/änderte Tickets.  
- Einführung **Shadow Mode** für neue Checks (warnend, nicht-blockend).  
- Sammeln von CI-Metriken (Green/Red, Auto-Fix-Quote) für Transparenz und Observability.

## Deliverables
- `.github/workflows/auto-format.yml`: Umbau zu non-blocking, Auto-Fix mit Guardrail, Job-Summary.  
- `.github/workflows/governance.yml`: `SHADOW_MODE`-Flag, non-strict informativ, kompakte Governance-Summary.  
- `scripts/ci-metrics.mjs`: JSONL-Logging pro Run (`artefacts/reports/ci-metrics.jsonl`).  

## DoR (Definition of Ready)
- AT-002 (Governance-Workflow) erfolgreich im Repo.  
- Systemkarte v0.2 & Loops harmonisiert.  
- Drift-Check (Harmony) läuft grün.  

## DoD (Definition of Done)
- Keine roten Runs mehr durch Format/UTF-8/Legacy-Tickets.  
- Governance-Step-Summary im PR sichtbar mit Zahlen: Prettier, UTF-8, Tickets, Shadow Mode.  
- `ci-metrics.jsonl` enthält Einträge (Workflow, Job, Result).  
- Evidence: Screenshot aus Actions + JSONL-Datei im Repo.  

## KPI
- Green-Rate ≥95 % ohne Re-run.  
- Auto-Fix-Quote <20 %.  
- Shadow-Pass-Rate neuer Regeln ≥95 % vor Enforce.  
