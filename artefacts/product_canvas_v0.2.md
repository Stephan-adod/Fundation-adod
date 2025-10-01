# Product Canvas · Foundation (Operator-First, Hybrid, v0.2)

---

## 1. Vision

Eine **Operator-First AI Foundation**, die

- Selbstheilende und automatisierte Governance-Prozesse etabliert,
- Operatoren maximale Klarheit und minimale Friktion bietet,
- Qualität, Konsistenz und Rückverfolgbarkeit von Artefakten sicherstellt,
- Transparenz über Aufwand, Kosten und Nutzen liefert,
- und damit die Basis für skalierbare AI-First Micro-SaaS-Projekte bildet.

---

## 2. Zielgruppen & Needs

**Primäre Zielgruppe:** Operatoren (Projektleiter, Entwickler, Data Owner).

- **Need 1:** Friktionsarme Ticket-to-Execution Pipelines (≤3 Actions/Ticket).
- **Need 2:** Transparente, objektive Qualitätssicherung (Eval-Harness, Golden Set).
- **Need 3:** Governance-Gates ohne Blockade bei Legacy, aber strikt bei neuen Tickets.
- **Need 4:** Klare Security & Rollout-Strategien (Fork-PRs, Auto-Commits, Shadow Mode).
- **Need 5:** Business-Klarheit: Aufwand/Nutzen/Abhängigkeiten sichtbar und messbar.

---

## 3. Value Proposition

- **Für Operatoren:** Weniger Reibung, klarere Governance, Zeitersparnis pro Ticket.
- **Für das Projekt:** Höhere Green-Rate in CI, weniger Drift, stabilere Loops.
- **Für Business-Ebene:** Sichtbarkeit von Aufwand/Kosten/Nutzen → bessere Roadmap-Entscheidungen.

---

## 4. Loops (Systemkarte-Einbindung)

- **Execution Loop:** Ticket → Prompt → Artefakt → CI → Merge (Self-Healing).
- **Diagnose Loop:** Ticket/Repo-Scan → Validator/Eval → Reports → Evidence.
- **Feedback Loop:** Operator-Enablement, Loop-Logs, Retro.
- **Governance Loop:** Config-Unification, Security Policy, Shadow → Enforce.
- **Business Loop:** Aufwand/Nutzen/Abhängigkeiten Scores, Roadmap-Fit.

---

## 5. Key Artefacts

- **Execution:**
  - Ticket-Templates (AT-XXX, Issue-Forms).
  - Governance-Workflow (Prettier, UTF-8, Validator, Auto-Fix).
  - Auto-Format Guardrails.
- **Diagnose & Quality:**
  - `diagnose.mjs` & `diagnose.yml`.
  - **Eval-Harness & Golden Set** (`eval/golden/`, `scripts/eval.mjs`).
  - **CI-Metrics Dashboard** (`scripts/ci-metrics.mjs`, Reports JSON/MD).
- **Feedback & Enablement:**
  - Execution Guide.
  - Loop Log Template.
  - Retro-Reports.
- **Governance & Security:**
  - **Prompt Registry & Provenance** (`prompts/`, `PROMPTS.md`).
  - **Config-Unification** (`.foundation.yml`).
  - **Security Policy** (`docs/security_policy.md`).
  - **Rollout-Strategie** (Shadow Mode → Enforce).
- **Business:**
  - **Business-Metriken Plumbing** (`scripts/business-metrics.mjs`, Reports JSONL).
  - Nutzen/Aufwand/Abhängigkeiten-Scores.
  - Roadmap-Einordnung.

---

## 6. Success KPIs

- **Operator:** ≤3 Actions/Ticket, Ø 15 Min weniger Rework/Ticket.
- **CI:** Green-Rate ≥95 % ohne Re-run, Auto-Fix-Quote <20 %.
- **Quality:** Golden-Pass-Rate ≥95 %, ≥90 % Artefakte mit Prompt-Provenance.
- **Governance:** Keine Drift (Config vs. Workflows vs. Docs), Security-Policy eingehalten.
- **Business:** >80 % Tickets mit Aufwand/Nutzen/Abhängigkeiten-Metriken.

---

## 7. Risiken & Mitigation

- **Over-Engineering** → Shadow Mode (Eval/Validator) vor Enforce.
- **Kostensteigerung CI** → Path-Filters, Retention, CI-Metrics Monitoring.
- **Akzeptanzprobleme** → Operator-Enablement & Retro-Loop.
- **Security-Risiken (Auto-Commit, Forks)** → Security-Policy + Hybrid Trigger.

---

## 8. Roadmap (High-Level)

- **M1:** Governance & Self-Healing (Tickets + Patch-01).
- **M2:** Diagnose & Transparency (Tickets + Patch-02, Patch-04, Patch-06).
- **M3:** Modularisierung & Artefakt-Lifecycle (Tickets + Patch-03, Patch-05, Patch-07, Patch-08).
- **M4:** Systemweite Diagnose & Business (Tickets + Patch-09, Patch-10, AT-008).

---
