# AT-PATCH-12: Prettier Auto-Fix im Governance-Workflow (CI-Rot minimieren)

## Ziel
Prettier-Fehler sollen PRs **nicht mehr blockieren**. Der Governance-Workflow soll:
1) zunächst `prettier --check` ausführen,  
2) bei Bedarf **automatisch formatieren** (max. **1** Bot-Commit, nur **same-repo** PRs),  
3) danach **re-checken** und die restlichen Qualitätsschritte (UTF-8, Ticket-Validator, Summary) **immer** ausführen.

## Scope
**In:** `.github/workflows/governance.yml` – Prettier-Sequenz + Guardrail.  
**Out:** Stilregeln/Prettier-Config, weitere Workflows, Code-Logik.

## Dependencies
- `.github/workflows/auto-format.yml` (bestehende Prettier-Nutzung) – **keine** Änderungen hier, nur Governance.  
- Repo-Permissions für CI: `contents: write` (Bot-Commit).  
- Same-Repo-PRs (Fork-PRs dürfen **nicht** committieren → Step wird sauber übersprungen).

## Deliverables
- Anpassung in `governance.yml`:
  - **Prettier (check)** mit `continue-on-error: true`.
  - **Prettier (write & commit)** nur wenn:
    - `steps.prettier.outcome == 'failure'`
    - `steps.count.outputs.n < env.MAX_AUTOFIX_COMMITS` (Guardrail)
    - `head.repo.full_name == github.repository` (same-repo)
  - **Prettier (re-check)** unmittelbar danach.
  - **Guardrail:** `env.MAX_AUTOFIX_COMMITS = 1`.
  - Nachfolgende Jobs (**UTF-8**, **Ticket-Validator**, **Summary**) laufen **immer**.
- Kurze Doku-Notiz im PR (What/Why/Guardrail).

## Definition of Ready (DoR)
- [ ] PR stammt **nicht** aus Fork.  
- [ ] `contents: write` für Actions vorhanden.  
- [ ] `env.MAX_AUTOFIX_COMMITS: 1` vorgesehen.  
- [ ] Ticket referenziert in PR-Titel/Branch (`feature/AT-PATCH-12-...`).

## Umsetzung / Schritte
1) Prettier-Check-Step auf **non-blocking** setzen (`continue-on-error: true`).  
2) Zähl-Step für frühere Bot-Commits (awk/grep, fail-safe).  
3) Bedingten Auto-Fix implementieren (write & commit, same-repo, Guardrail).  
4) Re-Check.  
5) Restliche Governance-Steps **immer** laufen lassen.  
6) PR-Beschreibung mit kurzer Begründung + Guardrail-Hinweis ergänzen.

## Definition of Done (DoD)
- [ ] **CI grün** auf mind. **1 PR**, der vorher an Prettier scheiterte.  
- [ ] **Auto-Fix-Commit** sichtbar: `chore(prettier): auto-format via CI` (oder „nothing to commit“ geloggt).  
- [ ] **UTF-8**, **Ticket-Validator** & **Summary** laufen im selben Workflow-Run nach Prettier.  
- [ ] **Evidence** im Repo:
  - Link zum Governance-Run mit Auto-Fix-Step  
  - Diff mit Bot-Commit  
  - Hinweis in `artefacts/loop_logs/*` (Summary)  
- [ ] **Retro-Log aktualisiert** (kurzer Abschnitt: Outcome, Effekt auf Green-Rate/Friction).  

## KPIs
- **Governance Rot-Rate durch Prettier**: ↓ auf **< 5 %** (über letzte 20 Runs).  
- **Auto-Fix-Quote**: **< 20 %** der PRs (zeigt, dass lokale Setups i. d. R. ok sind).  
- **Operator-Friction**: zusätzliche manuelle Aktionen wegen Formatierung **≤ 1** pro PR (Selbstauskunft + CI-Historie).

## Risiken & Mitigation
- **Commit-Loop** → Guardrail `MAX_AUTOFIX_COMMITS = 1`, Zähl-Step fail-safe.  
- **Fork-PRs ohne Rechte** → same-repo-Guard; Step überspringt Commit, Workflow bleibt informativ.  
- **Überformatierung** → nur Prettier; keine inhaltlichen Änderungen.

## Rollback
- Revert des Workflow-Diffs (ein Commit); keine Datenmigration.

## Hinweise
- Branch-Konvention: `feature/AT-PATCH-12-<kurz>`.  
- Ergänze in der PR-Beschreibung: „Prettier Auto-Fix aktiv, Guardrail = 1 Commit, Same-Repo-Guard an.“
