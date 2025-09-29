# Iteration Log (append-only)

> Regel: Einträge nur am Ende anhängen. Keine Änderungen/Löschungen bestehender Einträge.

# Iteration Log – Init trigger

**Datum:** 2025-09-29
**Loop:** Guard_Loop
**Quelle:** PR #<wird beim Merge vergeben>

## Erkenntnisse

- Initialer Log-Eintrag, um Guard-Check auf main auszulösen.

## Beschlossene Änderungen

- Keine.

## Nächste Schritte

- Branch-Protection um Required Checks ergänzen.

# Iteration Log – AT-001

**Datum:** 2025-02-15
**Loop:** Build_Loop
**Quelle:** PR #<wird beim Merge vergeben>

## Erkenntnisse

- CI benötigt einen einfachen Health-Check, um Basisfunktionalität sicherzustellen.

## Beschlossene Änderungen

- Neues Script `tools/health-check.mjs`, das einen erfolgreichen Health-Check meldet.
- `npm run health` Script in `package.json` ergänzt.
- CI-Workflow führt den Health-Check Step aus.

## Nächste Schritte

- Prüfen, ob weitere Checks ergänzt werden sollen, sobald weitere Funktionen hinzukommen.

# Iteration Log – AT-001 Health Check

**Datum:** 2025-09-29  
**Loop:** Build_Loop  
**Quelle:** PR #9 – Add health check script and wire into CI

## Erkenntnisse
- Execution Prompt hat erfolgreich Branch + PR erstellt.  
- Health-Check Script `tools/health-check.mjs` läuft und gibt ✅ zurück.  
- `ci` hat den neuen Health-Check integriert.  
- `docs-lite` hatte beim ersten Lauf Konflikt mit Auto-Commit → Workflow angepasst (push auf PR-Branch). Danach grün.  
- `iteration-log-guard` lief erfolgreich, keine Verletzung.

## Beschlossene Änderungen
1. Neues Script `tools/health-check.mjs` eingeführt.  
2. `npm run health` als NPM-Script hinzugefügt.  
3. CI (`ci.yml`) erweitert, um Health-Check zu prüfen.  
4. Workflow `docs-lite.yml` robuster gemacht (kein detached HEAD mehr).  

## Nächste Schritte
- Ticket AT-002 vorbereiten: Improve Execution Prompt Output (Markdown-Format stabiler machen).  
- Operator-KPIs ergänzen (z. B. „% PRs ohne Auto-Fix“).
