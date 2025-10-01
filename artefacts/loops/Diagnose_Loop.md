# Diagnose Loop

## Purpose

Tickets/Repo auf Konformität prüfen, Evidence erzeugen.

## Input

- Ticket-Dateien (AT-XXX.md)
- Repo-Struktur
- Golden Set

## Output

- Diagnose-Reports (JSON, MD)
- Evidence für Governance

## Operator-Rolle

- Diagnose anstoßen (manuell oder CI)
- Reports interpretieren

## Artefakte

- `scripts/validate-ticket.mjs`
- `scripts/diagnose-repo.mjs`
- Diagnose-Workflow (`diagnose.yml`)
- Eval-Harness (`eval/golden/`, `scripts/eval.mjs`)

## Tickets/Patches

- AT-003
- AT-PATCH-02 (non-blocking Diagnose-Run)
- AT-PATCH-04 (Evaluation Harness & Golden Set)

## KPI

- Golden-Pass-Rate ≥95 %
- Diagnose-Reports für 100 % Tickets
- Fehlende Pflicht-Sektionen ≤5 %
