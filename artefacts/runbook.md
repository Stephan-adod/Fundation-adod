# Operator Runbook v0.2 · Foundation

_Status: v0.2 · Owner: Operator · Ziel: nachvollziehbar, reproduzierbar, driftfrei_

Dieses Runbook beschreibt alle **9 Loops** aus Operator-Sicht. Es folgt stets dem Muster:
**Purpose → Inputs → DoR → Schritte → Outputs/DoD → Evidence → KPIs → Pitfalls**.

**Hinweis:** Die 9 Loops = frühere „8 Loops“ **plus** neuer **Refinement Loop**.

---

## 0. Quickstart (Cheat Sheet)

- **Branch-Name:** `feature/<TICKET_ID>-kurzbeschreibung` (z. B. `feature/AT-002-governance`).
- **PR-Template nutzen:** DoD abhaken, Ticket referenzieren.
- **Workflows beachten:** `auto-format`, `governance`, `docs-lite`, optional `/codex`.
- **Evidence persistieren:** `artefacts/reports/ci-metrics.jsonl`, `artefacts/loop_logs/*`, `artefacts/execution/*`.

---

## Loop 1 · Intake Loop (Business → Rebrief)

**Purpose**: Aus einer Idee ein klarer Auftrag (Ticket-Rohling).  
**Inputs**: Business-Idee, Kontext.  
**DoR**: Ziel skizziert; Nutzen grob benannt.  
**Schritte**

1. Rebrief: Ziel, Nutzen, Scope (in/out), Risiken notieren.
2. Ticket-Rohling anlegen (`tickets/AT-XXX.md` Draft).  
   **Outputs/DoD**: Draft vorhanden mit Ziel & grobem Scope.  
   **Evidence**: PR/Issue-Kommentar, Draft-Datei.  
   **KPIs**: ≤30 min bis Draft.  
   **Pitfalls**: Scope creep → in/out strikt notieren.

---

## Loop 2 · Refinement Loop (Ticket schärfen)

**Purpose**: Ticket vor Umsetzung inhaltlich wasserdicht machen.  
**Inputs**: Draft `tickets/AT-XXX.md`.  
**DoR**: Sektionen Ziel, Deliverables, DoR, DoD, KPI vorhanden.  
**Schritte**

1. **Refinement Prompt v0.2** anwenden (8 Fragen + 3 Empfehlungen).
2. Ticket anpassen gemäß Empfehlungen.  
   **Outputs/DoD**: Ticket enthält klare Deliverables, messbares DoR/DoD, KPIs.  
   **Evidence**: Analyse-Tabelle & Empfehlungen (als Anhang oder Loop-Log).  
   **KPIs**: ≥80 % Tickets ohne Rework nach Refinement.  
   **Pitfalls**: fehlende KPIs → später keine Erfolgsmessung.

---

## Loop 3 · Execution Loop (Implementierung)

**Purpose**: Änderungen sauber umsetzen (Code/Docs/Workflows).  
**Inputs**: Freigegebenes AT-Ticket, ggf. Execution Prompt.  
**DoR**: Abhängigkeiten geklärt; Branch erstellt.  
**Schritte**

1. Änderungen gemäß Ticket erstellen (nur Textartefakte).
2. PR eröffnen, PR-Template ausfüllen.
3. Optional: `/codex` für begleitende Aktionen.  
   **Outputs/DoD**: PR steht; alle Dateien vorhanden; keine Binärartefakte.  
   **Evidence**: PR-Beschreibung (DoD-Check), Artefakte im Diff.  
   **KPIs**: ≤3 Operator-Aktionen pro Ticket (Friction).  
   **Pitfalls**: unscharfe Deliverables → Nacharbeit.

---

## Loop 4 · Governance Loop (CI/Self-Healing)

**Purpose**: Qualitätssicherung via `auto-format`, `governance`, `docs-lite`.  
**Inputs**: Offener PR.  
**DoR**: Workflows aktiv, Pfadfilter & Concurrency gesetzt.  
**Schritte**

1. `auto-format` (Prettier check → auto-fix mit Guardrail).
2. `governance` (UTF-8, Ticket-Validator, Summary).
3. `docs-lite` (Markdown-Hygiene).  
   **Outputs/DoD**: CI grün oder auto-fixed; Summary im PR sichtbar.  
   **Evidence**: Step-Summary, Commits „chore(prettier)“.  
   **KPIs**: Green-Rate ≥95 %, Auto-Fix-Quote <20 %.  
   **Pitfalls**: Fork-PRs haben keine Push-Perms → Logs ggf. nicht committet.

---

## Loop 5 · Evidence & Metrics Loop

**Purpose**: Dauer/Kosten/Status persistieren, Loop-Logs schreiben.  
**Inputs**: CI-Runs.  
**DoR**: `scripts/ci-metrics.mjs`, `scripts/commit-if-changed.mjs`, `tools/loop-log.mjs`.  
**Schritte**

1. Am Jobende Dauer berechnen → `ci-metrics.mjs` schreiben.
2. Loop-Log mit `--ticket-from-branch` + Summary schreiben.
3. Nur bei Änderungen committen (same-repo).  
   **Outputs/DoD**: `artefacts/reports/ci-metrics.jsonl`, `artefacts/loop_logs/*.md`.  
   **Evidence**: JSONL & MD-Logs im Repo.  
   **KPIs**: vollständige Belege pro PR-Run.  
   **Pitfalls**: head_ref/fork → Commit skippt.

---

## Loop 6 · Diagnose/Drift Loop

**Purpose**: Soll-Ist-Abgleich (Plan ↔ Repo), Drift früh erkennen.  
**Inputs**: Projektplan, Systemkarte, Tickets, Workflows.  
**DoR**: Analyse-Prompts vorhanden.  
**Schritte**

1. Deep-Analysis Prompt (M1 vX.Y) ausführen.
2. Gaps priorisieren (Impact/Cost).  
   **Outputs/DoD**: Report unter `artefacts/reports/*.md`.  
   **Evidence**: Gap-Report committet.  
   **KPIs**: Drift <2 pro Meilenstein.  
   **Pitfalls**: doppelte Tabellen/Inkonsistenzen im Report.

---

## Loop 7 · Harmonization Loop (Systemkarte/Docs)

**Purpose**: Systemkarte & Loop Docs gegen Repo synchron halten.  
**Inputs**: Systemkarte, Loops, Repo-Inhalte.  
**DoR**: Alle Referenzen gesammelt.  
**Schritte**

1. Referenzen prüfen (existieren die genannten Artefakte?).
2. Nicht existierende streichen oder „light“ anlegen.  
   **Outputs/DoD**: Konsistente Doku, keine toten Referenzen.  
   **Evidence**: Diff mit Doku-Änderungen.  
   **KPIs**: 0 tote Links/Referenzen.  
   **Pitfalls**: Artefakte ankündigen aber nie anlegen.

---

## Loop 8 · Patch Loop (Quick Wins)

**Purpose**: Kleine, wirkungsvolle Patches (AT-PATCH-XX).  
**Inputs**: Patch-Idee, Ticket.  
**DoR**: Klarer Nutzen, geringe Komplexität.  
**Schritte**

1. Patch-Ticket erstellen (DoD klar, Evidence benannt).
2. Umsetzung → PR → CI → Merge.  
   **Outputs/DoD**: Patch wirkt messbar (z. B. Green-Rate).  
   **Evidence**: Step-Summary, JSONL, Screenshots.  
   **KPIs**: Aufwand <0.5 PT, Nutzen kurzfristig sichtbar.  
   **Pitfalls**: Patches ohne Ticket → Governance-Bruch.

---

## Loop 9 · Feedback & Retro Loop

**Purpose**: Lernen, KPIs bewerten, nächste Schritte ableiten.  
**Inputs**: Metrics/Evidence, Gap-Reports, CI-Historie.  
**DoR**: Daten vorhanden & verständlich.  
**Schritte**

1. KPIs auswerten (Green-Rate, Auto-Fix-Quote, Kosten).
2. Gaps → neue Tickets/Patches ableiten.  
   **Outputs/DoD**: Kurz-Retro + Backlog-Updates.  
   **Evidence**: Retro-Abschnitt im Artefakte-Log.  
   **KPIs**: Time-to-Fix ↓, Rework-Rate ↓.  
   **Pitfalls**: Retro ohne To-Dos → kein Fortschritt.

---

# `/codex`-Trigger: exakte Anleitung (Step-by-Step)

## Voraussetzungen

- Workflow **`.github/workflows/codex-run.yml`** liegt im Repo und hat:
  - `on: issue_comment: types: [created]`
  - `permissions: contents: write, pull-requests: write`
  - Schritt, der **`artefacts/reports/codex_triggers.log`** schreibt **und** committet (same-repo).
- PR stammt aus **demselben Repo** (keine Forks), damit der Commit erlaubt ist.

## Schritte

1. **Branch erstellen**  
   `feature/AT-002-<kurz>` (oder passendes Ticket). Änderungen committen & pushen.

2. **Pull Request öffnen**  
   Gegen `main`. PR-Template ausfüllen, Ticket referenzieren (z. B. „Closes AT-002“).

3. **Kommentar absetzen**
   Im **PR → Conversation** Tab einen **neuen Kommentar** mit **genau**:

## Appendix · Codex Trigger Checklist

Der `/codex` Trigger ist ein manueller Operator-Hebel. Er wird nur genutzt,
wenn ein Ticket dies im DoD verlangt (z. B. AT-PATCH-01: Hybrid Trigger Evidence).

### Wann einsetzen?
- Wenn Ticket-DoD "Hybrid Trigger" oder "Codex-Evidence" fordert
- Wenn du bewusst eine Sonderaktion dokumentieren möchtest (Prompt, Meta-Ausführung)

### Wie auslösen?
1. Öffne einen Pull Request aus demselben Repo (kein Fork).
2. Gehe in den **Conversation Tab** des PR.
3. Schreibe einen Kommentar mit exakt:
   ```
   /codex
   ```
4. Prüfe unter **Actions → codex-run**, dass der Workflow gestartet ist.
5. Verifiziere im Repo, dass `artefacts/reports/codex_triggers.log` einen neuen Eintrag enthält:
   ```
   2025-10-02T12:34:56Z codex trigger by @USER in PR #42
   ```

### Best Practices
- Einmal pro Ticket, wenn DoD es verlangt.
- Immer Branch-Namen nach Ticket konventionieren (`feature/AT-XXX-...`), damit Loop-Logs Ticket korrekt mappen.
- Evidence-Link in PR-Beschreibung ergänzen: "Codex Trigger Evidence: siehe artefacts/reports/codex_triggers.log".
