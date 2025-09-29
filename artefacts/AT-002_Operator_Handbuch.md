AT-002 · Operator Handbuch (Step-by-Step)

Ausgangspunkt: tickets/AT-002.md liegt im Repo.
Ziel: Konsistente, CI-kompatible Prompt-Outputs & drei Verbesserungsfelder umgesetzt: Automatisierung, Governance, Feedback-Loop.

0) TL;DR – Kurzcheckliste

 Branch erstellen

 Ticket-Validator lokal auf tickets/AT-002.md laufen lassen

 Vier Artefakte via Meta-Prompt erzeugen und speichern

scripts/check-utf8.mjs

scripts/validate-ticket.mjs

tools/loop-log.mjs

.github/workflows/governance.yml

 Lokale Checks ausführen & fixen

 Loop-Log schreiben (Evidence)

 PR erstellen (Evidence + DoD belegen)

 CI grün → Merge

1) Vorbereitung

Branch anlegen

git switch -c codex/at-002-improve-execution
git pull --rebase origin main


Baseline prüfen

Stelle sicher, dass tickets/AT-002.md die Abschnitte Ziel, DoR/DoD, Verbesserungsfelder (Automatisierung/Governance/Feedback-Loop) enthält.

Optional: Schnell-Check der Zeilenenden & Encoding

git config core.autocrlf input


(Optional) .gitattributes sanity

Empfohlen, um „Binärdateien werden nicht unterstützt“-Effekte zu vermeiden:

*.md  text eol=lf
*.yml text eol=lf
*.mjs text eol=lf
*.js  text eol=lf
*.csv text eol=lf


Prüfen:

git check-attr -a tickets/AT-002.md

2) Governance first: Ticket-Validator auf AT-002

Ziel: Früh Fehler finden (Title-Muster, H1, DoR/DoD, Evidence-Punkte).

Artifact via Meta-Prompt erzeugen (nur falls Script noch fehlt)
In Codex den One-Click Meta-Prompt verwenden und folgenden Input einsetzen:

output_type: Code
name: scripts/validate-ticket.mjs
context: >
  Node.js-Script (ESM). Zweck: Prüft alle tickets/AT-*.md:
  - Dateiname passt auf 'AT-\d{3,}.md'
  - Erste H1 beginnt mit '# AT-\d{3,}: '
  - Sektionen DoR und DoD existieren
  - DoD enthält Punkte: CI grün, lint/format/test/docs/changelog, Evidence
  - Enthält Verbesserungsfelder Automatisierung/Governance/Feedback-Loop
  Output: Report pro Datei; Exit 1 bei Fehlern. Flags: --strict, --file <path>.
  Keine externen Dependencies.


Script aus Codex kopieren → speichern unter scripts/validate-ticket.mjs (BOM-frei).

Lokal ausführen

node scripts/validate-ticket.mjs --strict --file tickets/AT-002.md


Grün: weiter zu Schritt 3

Rot: Hinweise im Report abarbeiten (H1, DoR/DoD, fehlende Punkte), committen, erneut laufen lassen.

3) Automatisierung: Hygiene-Checks & Workflow
3.1 UTF-8/BOM & Markdown-Hygiene

Artifact via Meta-Prompt erzeugen (falls noch nicht vorhanden):

output_type: Code
name: scripts/check-utf8.mjs
context: >
  Node ESM. Prüft alle .md auf: UTF-8 ohne BOM, keine doppelten Leerzeilen,
  keine trailing spaces, finale Newline vorhanden. Exit 1 bei Verstößen.
  CLI: --root . --fix (auto-fix). Keine externen Dependencies.


Ausführen

node scripts/check-utf8.mjs --root . --fix


Prettier/markdownlint (falls vorhanden)

npx prettier --write .
npx markdownlint **/*.md -c .markdownlint.yml -d || true

3.2 Governance Workflow (CI)

Artifact via Meta-Prompt erzeugen:

output_type: Code
name: .github/workflows/governance.yml
context: >
  GH Actions Workflow 'governance' auf pull_request (main):
    - setup-node@v20
    - run-prettier: npx prettier --check .
    - run-utf8: node scripts/check-utf8.mjs --root .
    - validate-tickets: node scripts/validate-ticket.mjs --strict
  Bricht bei Fehlern ab. Keine externen npm Installs nötig.


Datei speichern und committen.

4) Feedback-Loop: Evidence automatisch sichern

Artifact via Meta-Prompt erzeugen:

output_type: Code
name: tools/loop-log.mjs
context: >
  Node ESM. Schreibt JSONL unter artefacts/loop_logs/YYYY-MM/AT-002.jsonl.
  CLI Flags:
    --ticket AT-002
    --input "<kurzer Prompt-Kontext>"
    --outputPath "<relativer Pfad zur erzeugten/validierten Datei>"
    --ci "success|failure"
    --notes "<optional>"
  Legt Ordner an, Zeitstempel+Commit hash (falls git) und Flags in jede Zeile.
  Keine externen Dependencies.


Ausführen (Beispiel)

node tools/loop-log.mjs \
  --ticket AT-002 \
  --input "Initiale Governance & Hygiene-Checks" \
  --outputPath "scripts/check-utf8.mjs" \
  --ci "success" \
  --notes "Validator & UTF-8 Check eingerichtet"

5) (Optional) Docs & Operator Enablement

Kurzanleitung für Operatoren

In Codex erstellen:

output_type: Docs
name: docs/Execution_Guide_v0.1.md
context: "≤5 Schritte, operator-verständlich, markdownlint-konform; beschreibt die Nutzung des Meta-Prompts und der drei Scripts."


Loop-Log Template

In Codex erstellen:

output_type: Artefakt
name: artefacts/Loop_Log_Template.md
context: "Felder: Purpose, Input, Output, Operator-Rolle, KPI. Klar, knapp."

6) PR & Merge

Commit & Push

git add .
git commit -m "AT-002: Governance checks, UTF-8 hygiene & loop log tooling"
git push -u origin codex/at-002-improve-execution


Pull Request erstellen

Titel: AT-002: Improve Execution Prompt Output – Variante B + Governance

Beschreibung (Beispielformulierung):

Ziel & Business Value in 2 Sätzen

Evidence:

Ausgabe validate-ticket (grün)

Ausgabe check-utf8 (grün)

Auszug aus artefacts/loop_logs/YYYY-MM/AT-002.jsonl

DoD-Abgleich: CI grün, UTF-8/BOM-frei, DoR/DoD vorhanden, Verbesserungsfelder umgesetzt

CI prüfen

Workflow governance muss grün sein.

Bei Fehlern: Logs lesen → lokal fixen → pushen.

Merge

Nach Review & grüner CI → Merge in main.

7) Entscheidungspunkte & Späterer Übergang auf Variante A

Bleibe bei Variante B, solange:

< 10 Artefakt-Typen, geringe Varianz, schnelle Iteration wichtig.

Wechsle zu Variante A, sobald:

CI stabil, wiederkehrende Muster klar

Bedarf nach hartem Governance-Rahmen (Spezial-Templates je Artefakt)

Definition für „bereit für Variante A“ (Heuristik):

3 aufeinanderfolgende PRs ohne Prompt-Nacharbeiten

< 2 Lint-Fixes/PR

Mind. 1 vollständige Woche ohne CI-Flake

8) Troubleshooting (häufige Stolpersteine)

MD041 (first-line heading) bei .md:
→ Erste Zeile muss # <Titel> sein (kein Leerraum/Kommentar davor).

BOM/Encoding-Fehler:
→ node scripts/check-utf8.mjs --root . --fix laufen lassen.
→ Editor so einstellen: UTF-8 ohne BOM, LF.

„Binärdateien werden nicht unterstützt“:
→ .gitattributes prüfen (siehe oben).
→ Sicherstellen, dass keine .md/.csv via LFS getrackt wird.

Prettier schlägt fehl:
→ npx prettier --write .
→ Prüfe .prettierrc und ignorierte Pfade.

Workflow findet Node-Scripts nicht:
→ Pfade in governance.yml korrekt? Repo-Root vs. Unterordner beachten.

9) DoD – Abhakliste (kopierbar in PR)

 Execution-Outputs repo-fertig, ohne manuelle Nacharbeit

 CI (Lint/Format/Test/Docs/Changelog) grün

 Artefakte UTF-8, BOM-frei, markdownlint-konform

 Gewählte Variante dokumentiert + Begründung

 Automatisierung: Governance-Workflow + Hygiene-Script aktiv

 Governance: Ticket-Validator prüft Titel/H1/DoR/DoD/Evidence

 Feedback-Loop: JSONL-Eintrag erstellt und im PR verlinkt (Evidence)

Nächste sinnvolle Schritte (nach Merge)

Mini-Retrospektive im Loop-Log (--notes "Lessons Learned").

Falls 2–3 PRs stabil grün: Variante A (modulare Templates) vorbereiten.
