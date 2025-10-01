# Execution Loop

## Purpose
Ticket zu Artefakt friktionsarm, automatisiert & CI-stabil transformieren.  

## Input
- AT-Tickets (Operator-Eingabe)  
- Prompts (Codex, Registry)  
- Repo-Konfig (.foundation.yml)  

## Output
- Artefakte (Docs, Reports, Config)  
- Merge-fähige PRs mit grünem CI  

## Operator-Rolle
- Ticket anlegen & prüfen (≤3 Actions/Ticket)  
- Optional Codex-Trigger (/codex, Label)  
- Review/Approve  

## Artefakte
- Ticket-Templates (Issue-Forms)  
- Governance-Workflow (`.github/workflows/governance.yml`)  
- Auto-Format Guardrails  
- Prompt Registry (`prompts/`, `PROMPTS.md`)  

## Tickets/Patches
- AT-001, AT-002  
- AT-PATCH-01, AT-PATCH-02, AT-PATCH-03, AT-PATCH-05  

## KPI
- CI-Green-Rate ≥90 % ohne Re-run  
- Operator-Actions/Ticket ≤3  
