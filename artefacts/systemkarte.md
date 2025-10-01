# Systemkarte v0.2 – Foundation (Operator-First, Hybrid)

---

## Ziele

- **Friction Reduction:** Operator muss ≤3 Actions/Ticket durchführen.
- **Self-Healing:** Governance & CI laufen weitgehend automatisiert.
- **Quality & Consistency:** Artefakte evaluiert, versioniert, rückverfolgbar.
- **Transparency:** Aufwand/Kosten/Nutzen sichtbar.
- **Scalability:** Loops & Artefakte modular, systemisch erweiterbar.

---

## Loops → Artefakte → Tickets/Patches → KPIs

### 🔹 Execution Loop

**Purpose:** Ticket zu Artefakt friktionsarm, automatisiert & CI-stabil.

- **Artefakte**
  - Ticket-Templates (AT-XXX, Issue-Forms)
  - Governance-Workflow (`.github/workflows/governance.yml`)
  - Auto-Format Guardrails
  - Prompt Registry (`prompts/`, `PROMPTS.md`)

- **Tickets/Patches**
  - AT-001 (Health-Check Script)
  - AT-002 (Execution Prompt Output + Governance Workflow)
  - AT-PATCH-01 (Friction Reduction Bundle)
  - AT-PATCH-02 (CI Efficiency & Transparency)
  - AT-PATCH-03 (Quality Hardening)
  - AT-PATCH-05 (Prompt Registry & SemVer)

- **KPIs**
  - CI-Green-Rate ≥90 % ohne Re-run
  - Operator-Actions/Ticket ≤3

---

### 🔹 Diagnose Loop

**Purpose:** Tickets/Repo auf Konformität prüfen, Evidence erzeugen.

- **Artefakte**
  - `scripts/validate-ticket.mjs`
  - `scripts/diagnose-repo.mjs`
  - Diagnose-Workflow (`diagnose.yml`)
  - Eval-Harness (`eval/golden/`, `scripts/eval.mjs`)

- **Tickets/Patches**
  - AT-003 (Ticket-agnostische Diagnose)
  - AT-PATCH-02 (Non-blocking Diagnose-Run)
  - AT-PATCH-04 (Evaluation Harness & Golden Set)

- **KPIs**
  - Golden-Pass-Rate ≥95 %
  - Diagnose-Reports für 100 % Tickets
  - Fehlende Pflicht-Sektionen ≤5 %

---

### 🔹 Feedback Loop

**Purpose:** Operatoren befähigen, Loops dokumentieren, Retro sicherstellen.

- **Artefakte**
  - Execution Guide (`docs/execution_guide.md`)
  - Loop Log Template (`artefacts/loop_log_template.md`)
  - Retro-Log (`artefacts/retro_log.md`)
  - CI-Metrics Dashboard (`artefacts/reports/ci-metrics.jsonl`)

- **Tickets/Patches**
  - AT-004 (Operator Enablement)
  - AT-PATCH-01 (PR-Template, Issue-Form)
  - AT-PATCH-06 (Observability & CI-Kosten-Dashboard)

- **KPIs**
  - Operator-Zeitersparnis ≥15 Min/Ticket
  - CI-Report pro PR im `$GITHUB_STEP_SUMMARY`
  - Retro-Dokumentation für ≥80 % Tickets

---

### 🔹 Governance Loop

**Purpose:** Regeln, Security, Config als Single Source of Truth.

- **Artefakte**
  - `.foundation.yml` (Single Source of Truth)
  - `docs/security_policy.md`
  - Shadow-Rollout-Strategie

- **Tickets/Patches**
  - AT-PATCH-07 (Security & Permissions Hardening)
  - AT-PATCH-08 (Config-Unification)
  - AT-PATCH-09 (Rollout-Strategie Shadow → Enforce)

- **KPIs**
  - 0 Policy Violations in CI
  - Kein Drift zwischen Config & Workflows
  - Shadow-Pass-Rate ≥95 % vor Enforce

---

### 🔹 Business Loop

**Purpose:** Aufwand/Nutzen/Abhängigkeiten sichtbar machen, Roadmap-Fit sichern.

- **Artefakte**
  - `scripts/business-metrics.mjs`
  - `artefacts/reports/business-metrics.jsonl`
  - Business-Score Heuristik + Operator-Override

- **Tickets/Patches**
  - AT-008 (Execution Loop Business-Erweiterung)
  - AT-PATCH-10 (Business-Metriken Plumbing)

- **KPIs**
  - > 80 % Tickets mit Aufwand/Nutzen/Abhängigkeiten-Scores
  - Abweichung Heuristik vs. Operator <20 %

---

### 🔹 Diagnose/Systemic Loop

**Purpose:** Ganzheitliche Analyse auf System-Ebene, Blinde Flecken aufdecken.

- **Artefakte**
  - Systemkarte (`artefacts/systemkarte.md`)
  - Blinde-Flecken-Report (`artefacts/reports/blindspots.md`)

- **Tickets/Patches**
  - AT-007 (Systemweite Diagnose & 2nd/3rd Order Effects)

- **KPIs**
  - 100 % Loops dokumentiert & verknüpft
  - Drift-Erkennung Systemkarte vs. Realität aktiv
  - ≥2 identifizierte 2nd/3rd Order Effects pro Quartal

---

### 🔹 Refinement Loop

**Purpose:** Vor der Umsetzung Tickets schärfen, DoR/DoD prüfen, Abhängigkeiten klären.

- **Artefakte**
  - Ticket-Dateien (AT-XXX.md)
  - Loop-Log Einträge (Refinement-Review)

- **Tickets/Patches**
  - AT-PATCH-12 (Refinement Loop Einführung)
  - Pilot: AT-PATCH-11 (Green-Rate Hardening & Shadow Mode)

- **KPIs**
  - 100 % Tickets durchlaufen Refinement.
  - Operator-Rework-Zeit <10 %.
  - ≥80 % Tickets bestehen Refinement ohne Nachbearbeitung.

---

## Nächste Schritte

- **Loop-Dokumente (`artefacts/loops/*_Loop.md`)** aktualisieren:
  - Liste der zugehörigen Tickets/Patches je Loop ergänzen.
  - Artefakte aus Systemkarte eintragen.
- **Automatisierung (später Patch AT-PATCH-11):**
  - Script `scripts/check-harmony.mjs` → prüft Drift zwischen Systemkarte ↔ Loop-Dokumenten ↔ Projektplan.

---
