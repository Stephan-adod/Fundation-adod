# Execution Guide v0.1

1. Öffne in Codex den One-Click Meta-Prompt, setze `output_type`, `name` und `context` gemäß gewünschtem Artefakt (z. B. `scripts/validate-ticket.mjs`) und generiere den Code; speichere die Antwort 1:1 im Repository ohne BOM.
2. Führe `node scripts/validate-ticket.mjs --strict --file <ticket>` aus, um Tickets gegen die DoR/DoD-Regeln zu prüfen, und behebe gemeldete Abweichungen sofort.
3. Starte `node scripts/check-utf8.mjs --root . --fix`, damit alle Markdown-Dateien UTF-8-konform, ohne überflüssige Leerzeichen und mit finaler Zeile gespeichert sind.
4. Dokumentiere Arbeitsläufe mit `node tools/loop-log.mjs --ticket <ID> --input "<Kontext>" --outputPath <Datei> --ci <Status> --notes "<Hinweis>"`, damit jede Aktion im Artefakt-Log nachvollziehbar bleibt.
5. Wiederhole bei Bedarf den Meta-Prompt mit aktualisiertem Kontext, bis Validator und Hygiene-Skripte fehlerfrei durchlaufen und das Loop-Log den Abschluss dokumentiert.
