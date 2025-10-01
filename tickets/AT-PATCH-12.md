# AT-PATCH-12: Refinement Loop Einführung & Systemkarte-Anpassung

## Ziel

Den Execution Loop um einen vorgelagerten **Refinement-Schritt** erweitern, damit Tickets klarer, konsistenter und fundierter werden, bevor sie in die Umsetzung gehen.

Damit wird verhindert, dass unklare Deliverables/DoD direkt in die Umsetzung laufen.

## Deliverables

- Neues Loop-Dokument: `artefacts/loops/Refinement_Loop.md`.
- Update der Systemkarte (`artefacts/systemkarte.md`):
  - Ergänzung Refinement Loop.
  - Execution Loop wird offiziell „Execution + Refinement“.
- Ticket-Workflow-Regel: Kein AT-Ticket geht in Codex/Execution, bevor es ein Refinement-Durchgang hatte.

## DoR

- Systemkarte v0.2 im Repo.
- Bestehende Loop-Dokumente harmonisiert.

## DoD

- Refinement Loop dokumentiert (Purpose, Input, Output, Operator-Rolle, Artefakte, KPIs).
- Systemkarte erweitert: Refinement Loop integriert und mit Execution Loop verknüpft.
- Mindestens 1 Ticket (z. B. AT-PATCH-11) als Pilot im Refinement-Loop dokumentiert.

## KPI

- 100 % neue Tickets enthalten Refinement-Review, bevor sie umgesetzt werden.
- Operator-Zeit für Ticket-Rework <10 %.
- ≥80 % Tickets bestehen Refinement ohne Nachbearbeitung.
