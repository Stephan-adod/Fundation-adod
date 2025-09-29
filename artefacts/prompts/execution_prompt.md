# EXECUTION PROMPT — Ticket ➜ Code ➜ PR (binärsicher)

## Ziel

Aus einem Ticket (AT-###) arbeitsfähigen Code + Artefakte erzeugen und als PR bereitstellen — ohne Binärdateien, ohne manuelle Doku-Nachpflege.

## HARTE REGELN

- Erzeuge/ändere ausschließlich **Textdateien**: `.md`, `.yml/.yaml`, `.json`, `.mjs/.js/.ts`.
- **Keine** Binärdateien, **keine** Metrik-/Report-Dateien (keine `.csv/.png/.pdf`, etc.).
- Arbeite in einem **Feature-Branch**, erstelle einen **PR**.
- Respektiere vorhandene Workflows (`ci`, `docs-lite`, `iteration-log-guard`).

## INPUT

- Ticket: `tickets/AT-###.md` mit **DoR** & **DoD**.
- Repo-Kontext (Dateien/Struktur).

## OUTPUT (PR muss enthalten)

1. Implementierte Änderungen (nur Textdateien).
2. PR-Beschreibung mit:
   - **Summary** (1–3 Sätze, Zweck & Impact)
   - **Changed files** (Liste, kurz je Zweck)
   - **DoD-Checkliste** (s.u.) mit ✅/❌
   - **Rollback-Hinweis** (welche Dateien rückgängig machen)
3. Falls Doku betroffen: **genau eine** Stelle im Artefakt anpassen (keine Duplikate).

## DoR (muss im Ticket stehen)

- Problem, Zielzustand, Scope (in/out), Constraints
- Akzeptanzkriterien (DoD)
- Risiken/Edge Cases

## DoD (prüfe & abhaken)

- [ ] `ci` grün
- [ ] `docs-lite` grün (Auto-Fix ok)
- [ ] `iteration-log-guard` grün (wenn Log angepasst)
- [ ] **Keine Binärartefakte**
- [ ] Doku/Artefakte konsistent (Systemkarte/Loop-Charta falls nötig)
- [ ] Iteration-Log **Block vorbereitet** (noch nicht anhängen)

## VORGEHEN (Schritte)

1. Ticket lesen → Mini-Plan (welche Dateien, welche Änderungen).
2. Änderungen durchführen (**nur Textdateien**).
3. PR eröffnen mit oben genannter Beschreibung.
4. Auf Checks warten; `docs-lite` darf Auto-Commit ausführen.
5. Wenn alle Checks grün → Operator reviewed/merged; **Feedback Prompt** ausführen.

## GRENZEN

- Kein Refactor jenseits des Tickets.
- Keine neuen Workflows ohne Ticket.
- Keine Format-/Linter-Regeländerungen ohne Ticket.
