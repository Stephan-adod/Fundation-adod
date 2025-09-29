# FEEDBACK PROMPT — PR ➜ Befunde ➜ Iteration-Log (append-ready)

## Ziel

PR-Ergebnis und CI-Befunde in einen **Iteration-Log-Block** übersetzen (anhangfertig, append-only).

## INPUT

- PR-Status & Checks (ci, docs-lite, iteration-log-guard)
- Relevante Log-Ausschnitte (Fehler/Warnungen)
- PR-Beschreibung (Summary, DoD)

## OUTPUT

Erzeuge **nur** folgenden Markdown-Block (Operator hängt ihn manuell am Ende von `artefacts/iteration_log.md` an):

Iteration Log – <Kurzthema/Ticket>

Datum: YYYY-MM-DD
Loop: <Build_Loop / Improve_Loop / Doc_Loop …>
Quelle: PR #<nr> – <kurztitel>

Erkenntnisse

<wichtigster Befund 1>

<Befund 2>

Beschlossene Änderungen

<konkrete Änderung A>

<konkrete Änderung B>

Nächste Schritte

<Mini-ToDo oder „keine“>

## REGELN

- Erzeuge **keinen** Code.
- **Keine** Binärdateien, keine neuen Workflows.
- Der Output ist vollständig **append-ready** (Guard lässt nur Anhänge zu).
