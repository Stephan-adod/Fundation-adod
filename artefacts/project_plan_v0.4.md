# Projektplan · Foundation (Operator-First, Hybrid, v0.4)

## 🎯 Zielbild

Eine **Operator-First Foundation**, die

- **Self-Healing CI** sicherstellt,
- **Friction für Operatoren minimiert**,
- **Qualität und Konsistenz** der Artefakte gewährleistet,
- **Transparenz zu Kosten/Nutzen/Aufwand** herstellt,
- und eine **skalierbare AI-First Governance-Architektur** bildet.

---

## 🛣️ Meilensteine, Tickets & Patches

### ✅ M1 – Governance & Self-Healing (abgeschlossen)

**Ziele:** Baseline-CI mit Self-Healing, Operator-Governance.

- **AT-001 (Loop: Execution)**: Health-Check Script (docs-lite).
- **AT-002 (Loop: Execution)**: Execution Prompt Output + Governance Workflow (Prettier, UTF-8, Validator, Auto-Format).
- **AT-PATCH-01 (Loop: Execution/Feedback)**: Friction Reduction Bundle
  - PR-Template (DoD-Checkliste)
  - Issue-Form für Tickets
  - Editor Defaults (`.editorconfig`, `.prettierignore`)
  - VS Code Tasks & NPM Scripts
  - Hybrid Trigger `/codex`
  - Guardrail für Auto-Format (Max-Auto-Fixes).

**KPIs:**

- CI-Green-Rate ≥ 90 % ohne Re-run.
- Operator-Actions/Ticket ≤ 3.

---

### 🚧 M2 – Diagnose & Transparency

**Ziele:** Einheitliche Diagnose, Evidence-Generierung, Operator Enablement.

- **AT-003 (Loop: Diagnose)**: Ticket-agnostische Diagnose (diagnose.mjs + diagnose.yml, Reports JSON+MD).
- **AT-004 (Loop: Feedback/Enablement)**: Operator Enablement (Execution Guide, Loop Log Template, Retro-Log).
- **AT-PATCH-02 (Loop: Execution)**: CI Efficiency & Transparency Quick Wins
  - Concurrency + Path-Filters (alle Workflows).
  - Artefakt-Retention kürzen (7 Tage).
  - Governance Summary in `$GITHUB_STEP_SUMMARY`.
  - Non-blocking Diagnose-Run.
- **AT-PATCH-04 (Loop: Diagnose)**: Evaluation Harness & Golden Set
  - Golden-Testfälle für Tickets/Artefakte.
  - `scripts/eval.mjs` (Vergleich gegen Golden-Set).
  - Eval-Workflow (Shadow Mode, non-blocking).
- **AT-PATCH-06 (Loop: Feedback/Transparency)**: Observability & CI-Kosten-Dashboard
  - `scripts/ci-metrics.mjs` (Laufzeit, Auto-Fix-Count, Green-Rate).
  - Aggregation in `artefacts/reports/ci-metrics.jsonl`.
  - `docs/CI_Costs.md` mit Budget-Schwellen.

**KPIs:**

- Golden-Pass-Rate ≥ 95 %.
- CI-Report pro PR mit Step-Summary.
- Ø Minuten/PR < 10.
- Auto-Fix-Quote < 20 %.

**Go/No-Go-Kriterien für M3:**

- Eval-Harness stabil (≥95 % Pass).
- CI-Metriken sichtbar in Reports.
- Diagnose-Reports nutzbar, non-blocking.

---

### 📌 M3 – Modularisierung & Artefakt-Lifecycle

**Ziele:** Prompts & Artefakte modularisieren, Abhängigkeiten prüfbar machen.

- **AT-005 (Loop: Execution)**: Modularisierung der Prompts (Templates pro Artefakt-Typ).
- **AT-006 (Loop: Diagnose/Execution)**: Artefakt-Lifecycle & Frontmatter `requires:` (Dependencies prüfen, Diagnose integriert).
- **AT-PATCH-03 (Loop: Execution/Quality)**: Quality Hardening
  - Pre-Commit Hooks (Prettier, UTF-8).
  - Changelog Automation (aus Ticket-Headern generiert).
- **AT-PATCH-05 (Loop: Execution)**: Prompt Registry & SemVer
  - `prompts/` Ordner mit Versionierung (SemVer).
  - `PROMPTS.md` als Changelog.
  - Prompt-Provenance in Artefakten.
- **AT-PATCH-07 (Loop: Governance)**: Security & Permissions Hardening
  - `docs/security_policy.md` mit Least-Privilege-Strategie.
  - Fork-PR-Handling: Hybrid Trigger nur für MEMBER/OWNER.
  - Max-Auto-Fixes Guardrails dokumentiert.
- **AT-PATCH-08 (Loop: Governance/Transparency)**: Config-Unification
  - `.foundation.yml` als Single Source of Truth für Regeln (Ticket-Muster, Pfadfilter, Artefakt-Retention, Prompt-Version).

**KPIs:**

- Prompt-Registry eingeführt, 100 % Artefakte mit Provenance.
- Abhängigkeitsprüfungen (requires:) laufen automatisiert.
- Changelog-Einträge ≥ 90 % PRs automatisch gepflegt.
- Security-Policy dokumentiert und aktiv.

**Go/No-Go-Kriterien für M4:**

- Prompt-Versionierung aktiv, Provenance in Reports.
- Config-Unification live, kein Drift zwischen Code/Workflows/Docs.
- Security-Policy dokumentiert und CI durchgesetzt.

---

### 📌 M4 – Systemweite Diagnose & Business-Ebene

**Ziele:** Foundation auf System- & Business-Level erweitern.

- **AT-007 (Loop: Diagnose/Systemic)**: Diagnose-Erweiterung
  - Blinde Flecken & 2nd/3rd Order Effects.
  - Systemkarte-Drift-Erkennung.
- **AT-008 (Loop: Business)**: Execution Loop Business-Erweiterung
  - Automatisierte Nutzen/Aufwand/Abhängigkeiten-Scores.
  - Roadmap-Einordnung.
  - Deliverables:
    - `scripts/business-metrics.mjs`
    - `artefacts/reports/business-metrics.jsonl`
- **AT-PATCH-09 (Loop: Governance/Shadow)**: Rollout-Strategie (Shadow → Enforce)
  - Shadow Mode für neue Prompts/Validatoren.
  - Enforce nach stabilen Eval-Ergebnissen.
- **AT-PATCH-10 (Loop: Business)**: Business-Metriken Plumbing
  - Diagnose schreibt Lines-Changed, CI-Zeit, Ticket-Kategorie.
  - Heuristik-Scoring + Operator-Override.

**KPIs:**

- Business-Metriken > 80 % Tickets.
- Shadow-Pass-Rate ≥ 95 % vor Enforce.
- Zero ungeplante Blocker bei neuen Regeln.

---

## ⏳ Gesamtaufwände & Kosten (aktualisiert)

| Phase      | Tickets & Patches                                      | Aufwand Operator (Std.) | CI-Kosten (~€) |
| ---------- | ------------------------------------------------------ | ----------------------- | -------------- |
| **M1**     | AT-001, AT-002, PATCH-01                               | ~12h                    | ~40            |
| **M2**     | AT-003, AT-004, PATCH-02, PATCH-04, PATCH-06           | ~24h                    | ~90            |
| **M3**     | AT-005, AT-006, PATCH-03, PATCH-05, PATCH-07, PATCH-08 | ~32h                    | ~100           |
| **M4**     | AT-007, AT-008, PATCH-09, PATCH-10                     | ~24h                    | ~80            |
| **Gesamt** | 8 Tickets + 11 Patches                                 | ~92h (~2,3 Wochen)      | ~310           |

---

## 🔗 Anschlussfähigkeit & Best Practices

- **Loops**: Alle Tickets/Patches sind nun klar einem Loop (Execution, Diagnose, Feedback, Business, Governance) zugeordnet.
- **AI-First**: Eval-Harness (PATCH-04), Prompt-Registry (PATCH-05), CI-Metrics (PATCH-06) → zentrale AI-First Practices.
- **Observability**: CI-Metrics (PATCH-06) + Business-Metriken (PATCH-10).
- **Security**: AT-PATCH-07 mit klarer Security-Policy, Least-Privilege & Fork-Handling.
- **Rollout-Strategie**: PATCH-09 (Shadow → Enforce) für sichere Adoption neuer Regeln.

---
