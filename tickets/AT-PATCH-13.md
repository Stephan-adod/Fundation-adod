# AT-PATCH-13: Evidence Completer für M1 (Codex, Metrics, Loop-Logs)

## Ziel

Meilenstein M1 auf **READY** heben, indem drei Evidence-Lücken geschlossen werden:

1. **Codex-Trigger Evidence**: persistentes Log bei `/codex`-Runs
2. **CI-Metrics Coverage**: Governance/Validator/UTF-8 Laufzeiten & Kosten in `ci-metrics.jsonl`
3. **Loop-Log Lesbarkeit**: Ticket-basiertes Markdown-Summary statt Pfadverweise

## Scope

**In:** `.github/workflows/codex-run.yml`, `.github/workflows/governance.yml`, `tools/loop-log.mjs`, `artefacts/reports/*`, `artefacts/loop_logs/*`  
**Out:** neue Validatoren/Health-Checks, Prettier-Konfiguration, inhaltliche Code-Änderungen

## Dependencies

- AT-002 (Loop-Log & Scripts vorhanden)
- AT-PATCH-01 (codex-run existiert)
- AT-PATCH-12 (Governance-Auto-Fix aktiv)
- Repo-Action-Permissions: `contents: write`

## Deliverables

1. **Codex Trigger Evidence**
   - `codex-run.yml`: Schritt „Persist codex trigger log“ mit Same-Repo-Guard  
     schreibt Zeile in `artefacts/reports/codex_triggers.log` (ISO8601, PR#, Actor)  
     → persistiert via `scripts/commit-if-changed.mjs`.

2. **CI-Metrics Coverage (Governance)**
   - `governance.yml`: vor/ nach jedem Hauptstep (Prettier re-check, UTF-8, Validator, Summary)
     Job-Dauer & Name in `artefacts/reports/ci-metrics.jsonl` appendieren (Format kompatibel zu bestehender Datei).
   - Persistenz via `commit-if-changed` (Same-Repo-Guard).

3. **Loop-Log Summary (lesbar & ticketbasiert)**
   - `tools/loop-log.mjs`: erweitern um
     - Ticket-Parsing aus Branch/PR-Title (`AT-\d+`)
     - Markdown-Summary mit Feldern: Ticket, Outcome (✅/❌), Prettier-Fix (ja/nein), Run-URL, Dauer, Zeitstempel
     - Dateiname: `artefacts/loop_logs/AT-<ID>_<YYYYMMDD-HHMMSS>.md`
   - Integration im Governance-Workflow (post-Step).

## Definition of Ready (DoR)

- [ ] AT-002, AT-PATCH-01, AT-PATCH-12 auf `main`
- [ ] `scripts/commit-if-changed.mjs` vorhanden/aufrufbar
- [ ] Same-Repo-Bedingung geprüft (Fork-PRs überspringen Persist-Schritte)
- [ ] Branch: `feature/AT-PATCH-13-evidence`

## Umsetzung / technische Notizen

- **Same-Repo-Guard:**  
  `if: ${{ github.event.pull_request.head.repo.full_name == github.repository }}`
- **Persistenz nur bei Änderungen:**  
  `node scripts/commit-if-changed.mjs artefacts/reports/ci-metrics.jsonl`
- **Metrics-Format (Beispiel):**  
  `{"ts":"2025-10-02T12:34:56Z","wf":"governance","job":"validator","duration_ms":8200,"cost_usd":0.0009,"sha":"<short>"}`

## Definition of Done (DoD)

- [ ] `artefacts/reports/codex_triggers.log` existiert + enthält **min. 1 neuen** Eintrag nach `/codex`
- [ ] `artefacts/reports/ci-metrics.jsonl` enthält Einträge für **Prettier re-check, UTF-8, Validator, Summary**
- [ ] `artefacts/loop_logs/AT-PATCH-12_<ts>.md` zeigt vollständige Summary (Ticket, Outcome, Prettier-Fix, Run-URL)
- [ ] Deep-Analysis **v1.5** bewertet M1 als **READY** (Report im Repo)

## KPIs

- **Codex-Evidence-Quote:** 100 % der `/codex`-Runs → Log-Eintrag
- **Governance-Metrics-Coverage:** ≥ 90 % der Governance-Steps werden in `ci-metrics.jsonl` erfasst
- **Loop-Log-Ticket-Mapping:** 100 % der neuen Logs haben Ticket-ID ≠ `unknown`

## Risiken & Mitigation

- Doppel-Commits / Commit-Loops → `commit-if-changed` + Same-Repo-Guard; max. 1 Commit je Run
- Fehlendes Ticket im Branch → Fallback: `unknown`, aber Dateiname bleibt eindeutig (Zeitstempel)
- Rechte in Forks → Persist-Schritte überspringen (Workflow läuft trotzdem grün)

## Rollback

- Entfernen der ergänzten Workflow-Schritte + Revert der Änderungen an `tools/loop-log.mjs`; keine Datenmigration nötig
