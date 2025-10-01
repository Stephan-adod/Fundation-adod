# Governance Loop

## Purpose
Regeln, Security, Config als Single Source of Truth.  

## Input
- Projektplan & Config (.foundation.yml)  
- Security-Policy  

## Output
- Validierte Tickets  
- Governance-konforme PRs  
- Security & Rollout-Richtlinien  

## Operator-Rolle
- Regeln pflegen (DoR/DoD, Config)  
- Policy-Einhaltung prüfen  

## Artefakte
- `.foundation.yml`  
- `docs/security_policy.md`  
- Rollout-Strategie (Shadow → Enforce)  

## Tickets/Patches
- AT-PATCH-07 (Security & Permissions Hardening)  
- AT-PATCH-08 (Config-Unification)  
- AT-PATCH-09 (Rollout-Strategie Shadow → Enforce)  

## KPI
- 0 Policy Violations in CI  
- Kein Drift Config vs. Workflows  
- Shadow-Pass-Rate ≥95 % vor Enforce  

