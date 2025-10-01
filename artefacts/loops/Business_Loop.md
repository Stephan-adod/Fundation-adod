# Business Loop

## Purpose

Aufwand/Nutzen/Abhängigkeiten sichtbar machen, Roadmap-Fit sichern.

## Input

- AT-Tickets mit Business-Feldern
- CI-Daten (Lines-Changed, Laufzeit)

## Output

- Business-Metriken-Report
- Scores (Nutzen, Aufwand, Abhängigkeiten)
- Roadmap-Einordnung

## Operator-Rolle

- Operator-Override bei Scores
- Business-Metriken interpretieren

## Artefakte

- `scripts/business-metrics.mjs`
- `artefacts/reports/business-metrics.jsonl`

## Tickets/Patches

- AT-008
- AT-PATCH-10 (Business-Metriken Plumbing)

## KPI

- > 80 % Tickets mit Aufwand/Nutzen/Abhängigkeiten-Scores
- Abweichung Heuristik vs. Operator <20 %
