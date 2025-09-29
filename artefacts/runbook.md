# Operator-Runbook (Fundation-adon)

Dieses Runbook beschreibt aus **Operator-Sicht** alle Loops (Plan, Build, Doc, Use-Feedback, Improve, Guard, Ops, Scale).  
Ziel: Jeder Schritt ist nachvollziehbar, reproduzierbar und driftfrei.

---

## Plan_Loop

### Zweck
Tickets schreiben, priorisieren und für den Build_Loop vorbereiten.

### Schritte
1. **Ziele & Scope klären**  
   - Systemkarte prüfen.  
   - Ziel / Problem definieren.  
2. **Ticket anlegen**  
   - Datei `tickets/AT-###.md` mit DoR & DoD.  
3. **Priorisieren**  
   - Dringlichkeit & Wert beurteilen.  
   - Ticket ggf. in Systemkarte/Backlog markieren.  
4. **Übergabe an Build_Loop**  
   - Ticket ist Input für Execution Prompt.

### Stop-Checks
- Ticketdatei existiert.  
- DoR & DoD vollständig.  
- Priorität klar.  

### Beispiel
AT-001: Health-Check Script.

---

## Build_Loop

### Zweck
Tickets automatisiert in Code & Artefakte umsetzen.

### Schritte
1. **Ticket bereitstellen**  
   - `tickets/AT-###.md` vollständig.  
2. **Execution Prompt starten**  
   - Ticket-Inhalt als Input geben.  
   - Prompt erzeugt Branch + Änderungen + PR.  
3. **Checks beobachten**  
   - `ci`, `docs-lite`, `iteration-log-guard` (falls Log verändert).  
4. **Review & Merge**  
   - PR-Beschreibung prüfen, DoD-Checkliste abhaken.  
5. **Feedback Prompt nutzen**  
   - Feedback in Iteration-Log-Block übersetzen.  
   - Am Ende von `artefacts/iteration_log.md` anhängen.

### Stop-Checks
- Alle Checks grün.  
- PR gemerged.  
- Iteration-Log-Eintrag appended.  

### Beispiel
AT-001 erzeugt `tools/health-check.mjs`, `npm run health` und CI-Step.

---

## Doc_Loop

### Zweck
Wissen sichern, zugänglich machen, driftfrei halten.

### Schritte
1. **Prüfen, ob Ticket Doku erfordert**  
   - Änderungen an Systemkarte, Loop-Chartas, Runbook.  
2. **Execution Prompt nutzen**  
   - Doku-Updates werden über PR eingespielt, nicht manuell.  
3. **Auto-Fix abwarten**  
   - `docs-lite` korrigiert Markdown.  
4. **Operator-Review**  
   - Nur Inhalte prüfen, Format nicht.  
5. **Feedback Prompt nutzen** (falls Doku zentral geändert).

### Stop-Checks
- Änderungen kommen über Execution Prompt.  
- `docs-lite` grün.  
- Iteration-Log-Eintrag appended (falls relevant).

### Beispiel
AT-002 erweitert Systemkarte um KPI „Operator-Zufriedenheit“.

---

## Use-Feedback_Loop

### Zweck
Feedback aus Nutzung, CI und Operator-Erfahrungen sammeln.

### Schritte
1. **Feedback-Quellen beobachten**  
   - CI-Checks, Operator-Erfahrungen, externe Nutzer.  
2. **Feedback erfassen**  
   - Kurz dokumentieren, nicht verlieren.  
3. **Feedback Prompt nutzen**  
   - Input: Logs, PR-Status.  
   - Output: Iteration-Log-Block.  
4. **Iteration-Log anhängen**  
   - Block am Ende von `artefacts/iteration_log.md` ergänzen.  
5. **Optional: Ticket anlegen**  
   - Wenn Feedback klaren neuen Task ergibt.

### Stop-Checks
- Feedback dokumentiert.  
- Iteration-Log-Eintrag appended.  
- Ticket erstellt, falls nötig.

### Beispiel
PR #7: docs-lite musste Auto-Fix machen → Feedback Prompt erzeugt Iteration-Log-Eintrag + Ticket AT-002.

---

## Improve_Loop

### Zweck
Systematische Verbesserungen aus Feedback & Gaps umsetzen.

### Schritte
1. **Input prüfen**  
   - Iteration-Log, Feedback, Gap-Analysen.  
2. **Entscheiden**  
   - Sofort fixen, parken oder neues Ticket.  
3. **Ticket anlegen (falls nötig)**  
   - DoR/DoD definieren.  
4. **Umsetzen**  
   - Kleine Fixes direkt, größere via Build_Loop.  
5. **Iteration-Log ergänzen**  
   - Verbesserungen dokumentieren.

### Stop-Checks
- Verbesserung dokumentiert.  
- Ticket erstellt (falls nötig).  
- Keine Ad-hoc-Änderungen ohne Log.

### Beispiel
AT-002: Improve Execution Prompt Template.

---

## Guard_Loop

### Zweck
Governance automatisieren, Drift verhindern.

### Schritte
1. **Branch-Protection prüfen**  
   - Require PRs, required checks aktiv.  
2. **PR-Checks überwachen**  
   - `ci`, `docs-lite`, `iteration-log-guard`.  
3. **Auto-Fix akzeptieren**  
   - Keine manuelle Formatkorrektur.  
4. **Iteration-Log Guard beachten**  
   - Nur Append erlaubt.  
5. **Phase-Wechsel prüfen**  
   - Phase 1 tolerant, Phase 2 strenger.

### Stop-Checks
- Alle PRs grün.  
- main nur via PR.  
- Iteration-Log nur appended.

### Beispiel
AT-001: docs-lite auto-fix commit → PR bleibt grün.

---

## Ops_Loop

### Zweck
Täglicher, wöchentlicher und monatlicher Betrieb sichern.

### Schritte
- **Daily:**  
  - PR-Checks prüfen.  
  - Iteration-Log ggf. ergänzen.  
  - Health Check laufen lassen.  
- **Weekly:**  
  - Systemkarte/Loops Review.  
  - Offene Befunde priorisieren.  
- **Monthly:**  
  - Guard_Loop-Einstellungen prüfen.  
  - KPIs prüfen.  
  - Phase-Wechsel entscheiden.

### Stop-Checks
- Daily: keine roten PRs übersehen.  
- Weekly: Prioritäten klar.  
- Monthly: KPIs geprüft, Governance angepasst.

### Beispiel
Weekly Review zeigt wiederholt Auto-Fix → Ticket AT-003.

---

## Scale_Loop

### Zweck
System gezielt erweitern: neue Use Cases, Automationen, Templates.

### Schritte
1. **Input erkennen**  
   - Iteration-Log, KPIs, externe Anforderungen.  
2. **Hypothese bilden**  
   - Was bringt Wert? Automation, Use Case, Template?  
3. **Ticket anlegen**  
   - DoR/DoD definieren, Scope klar.  
4. **Umsetzung starten**  
   - Build_Loop via Execution Prompt.  
5. **Wirkung prüfen**  
   - Feedback Prompt → Iteration-Log-Eintrag.  
   - Im Weekly Review Nutzen evaluieren.

### Stop-Checks
- Skalierungsschritt klar & stabil.  
- Ticket angelegt.  
- Feedback dokumentiert.

### Beispiel
AT-003: Lockfile-Check in CI → stabilerer Workflow.

---

# Zusammenfassung

- **Plan_Loop:** Tickets schreiben.  
- **Build_Loop:** Tickets umsetzen.  
- **Doc_Loop:** Wissen aktuell halten.  
- **Use-Feedback_Loop:** Befunde sammeln.  
- **Improve_Loop:** Verbesserungen einleiten.  
- **Guard_Loop:** Governance automatisieren.  
- **Ops_Loop:** Betrieb sichern.  
- **Scale_Loop:** System erweitern.  

👉 Dieses Runbook ist der **Operator-Guide**.  
Die Loop-Chartas (`artefacts/loops/*`) bleiben high-level, während hier die **konkrete Ausführung** beschrieben ist.
