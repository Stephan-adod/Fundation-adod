# Refinement Prompt v0.2 · Operator-Artefakt

---

## Zweck

Dieser Prompt unterstützt den **Refinement Loop**:
Bevor ein Ticket (AT-XXX.md) umgesetzt wird, wird es kritisch geprüft.
Ziel: Klarheit schaffen, Deliverables und DoR/DoD schärfen, Operator-Friktion vermeiden.

---

## DoR (Definition of Ready für den Prompt)

Der Prompt wird nur ausgeführt, wenn das Ticket mindestens folgende Sektionen enthält:

- Ziel
- Deliverables
- DoR
- DoD
- KPI

Falls eine dieser Sektionen fehlt → Output:

> ❌ Ticket nicht ready für Refinement – bitte Sektionen ergänzen.

---

## Aufgaben

1. Stelle die **8 Kernfragen** (siehe unten).
2. Beantworte jede Frage konkret auf Basis des Tickets.
3. Dokumentiere die Antworten in einer **Tabelle** (Frage | Antwort | Status: ✅/⚠️/❌).
4. Formuliere **3 Handlungsempfehlungen** – priorisiert (1–3), mit Begründung und Next Action.
5. Schließe mit einer **Meta-Einschätzung**:
   _„Wie hoch ist die Wahrscheinlichkeit (1–5), dass dieses Ticket nach Refinement ohne Rework durchgeht?“_

---

## Die 8 Kernfragen

1. Ist das Ziel klar formuliert und auf das Projektzielbild rückführbar?
2. Sind die Deliverables vollständig, realistisch und testbar?
3. Sind DoR-Kriterien messbar und realistisch erreichbar?
4. Sind DoD-Kriterien eindeutig überprüfbar und nicht zu vage formuliert?
5. Decken die KPIs sowohl Qualität als auch Operator-Erfahrung ab?
6. Gibt es Abhängigkeiten zu anderen Tickets/Patches, und sind diese explizit genannt?
7. Ist der Scope angemessen (kein Over-Engineering, kein Mikro-Ticketing)?
8. Gibt es Risiken (z. B. Kosten, Drift, Operator-Friktion), und wie werden sie mitigiert?

---

## Output (Formatvorgabe)

### Analyse-Tabelle

| Frage                        | Antwort | Status   |
| ---------------------------- | ------- | -------- |
| 1. Ziel klar formuliert?     | …       | ✅/⚠️/❌ |
| 2. Deliverables vollständig? | …       | ✅/⚠️/❌ |
| …                            | …       | …        |

### Handlungsempfehlungen

1. [Empfehlung 1] – Begründung, Next Action
2. [Empfehlung 2] – Begründung, Next Action
3. [Empfehlung 3] – Begründung, Next Action

### Meta-Einschätzung

- Wahrscheinlichkeit Ticket ohne Rework umsetzbar: X/5

---

## KPI (für den Prompt selbst)

- 100 % Tickets laufen durch Refinement, bevor sie umgesetzt werden.
- ≥80 % Tickets gehen nach Refinement ohne Rework in die Umsetzung.
- Operator-Zeit für Ticket-Rework <10 %.
