#!/bin/sh
# Pre-flight til agentkurset. Koeres dagen foer dag 1. Tjekker kun installation og adgang.
# Brug: sh preflight.sh        (laes scriptet foerst, det er kort)
# Aendrer intet, bortset fra at klone de to repos, hvis de mangler.
KODE="$HOME/Desktop/CLAUDE CODE"
OK=0; FEJL=0
ok()   { OK=$((OK+1));     printf '  [OK]   %s\n' "$1"; }
fejl() { FEJL=$((FEJL+1)); printf '  [FEJL] %s\n         Ret: %s\n' "$1" "$2"; }

echo "1. Claude Code"
if command -v claude >/dev/null 2>&1; then ok "claude er installeret: $(claude --version 2>/dev/null | head -1)"; else fejl "claude findes ikke paa PATH" "installer efter code.claude.com/docs/en/overview, og aabn en ny terminal"; fi
SVAR=$(claude -p "Svar kun med ordet OK" --output-format text 2>/dev/null | tr -d '[:space:]')
if [ "$SVAR" = "OK" ]; then ok "claude er logget ind og svarer"; else fejl "claude svarede ikke OK (fik: '$SVAR')" "koer 'claude' i en terminal og log ind, proev saa igen"; fi

echo "2. Git og GitHub"
if command -v git >/dev/null 2>&1; then ok "git: $(git --version)"; else fejl "git mangler" "installer Xcode Command Line Tools: xcode-select --install"; fi
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then ok "gh er logget ind som $(gh api user --jq .login 2>/dev/null)"; else fejl "gh er ikke installeret eller ikke logget ind" "installer gh (brew install gh) og koer: gh auth login"; fi

echo "3. Python og pytest"
if python3 -c 'import sys; sys.exit(0 if sys.version_info >= (3,9) else 1)' 2>/dev/null; then ok "python3: $(python3 --version)"; else fejl "python3 mangler eller er aeldre end 3.9" "installer Xcode Command Line Tools: xcode-select --install"; fi
if python3 -c 'import pytest' 2>/dev/null; then ok "pytest kan importeres"; else fejl "pytest mangler" "python3 -m pip install pytest"; fi

echo "4. Repos"
mkdir -p "$KODE"
if [ -d "$KODE/fragtvaegt-sandbox/.git" ]; then ok "fragtvaegt-sandbox er klonet"; else
  if git clone -q https://github.com/mortensillesen/fragtvaegt-sandbox.git "$KODE/fragtvaegt-sandbox" 2>/dev/null; then ok "fragtvaegt-sandbox blev klonet til $KODE"; else fejl "kunne ikke klone fragtvaegt-sandbox" "tjek netvaerk og gh auth status"; fi
fi
if [ -d "$KODE/fragtvaegt-sandbox/.git" ]; then
  N=$(git -C "$KODE/fragtvaegt-sandbox" ls-remote --heads origin 2>/dev/null | grep -c 'start/modul-')
  if [ "$N" -ge 11 ]; then ok "sandboxen har $N startbranches"; else fejl "sandboxen har kun $N startbranches" "koer: git -C \"$KODE/fragtvaegt-sandbox\" fetch origin"; fi
  (cd "$KODE/fragtvaegt-sandbox" && python3 -m pytest -q -p no:cacheprovider >/dev/null 2>&1); RC=$?
  if [ "$RC" -eq 1 ]; then ok "testene i sandboxen koerer (en fejler med vilje)"; elif [ "$RC" -eq 0 ]; then ok "testene i sandboxen koerer"; else fejl "pytest kunne ikke koere i sandboxen (exit $RC)" "koer: cd \"$KODE/fragtvaegt-sandbox\" && python3 -m pytest -q, og laes fejlen"; fi
  M=$(printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"preflight","version":"0"}}}' | python3 "$KODE/fragtvaegt-sandbox/kursus/mcp/takstserver.py" 2>/dev/null | grep -c takstserver)
  if [ "$M" -ge 1 ]; then ok "takstserveren (MCP) svarer"; else fejl "takstserveren svarede ikke" "koer kommandoen i kursus/mcp/README.md og laes fejlen"; fi
fi
if [ -d "$KODE/tdc-simulator/.git" ]; then ok "tdc-simulator er klonet"; else
  if git clone -q https://github.com/mortensillesen/tdc-simulator.git "$KODE/tdc-simulator" 2>/dev/null; then ok "tdc-simulator blev klonet til $KODE"; else fejl "kunne ikke klone tdc-simulator" "tjek netvaerk og gh auth status"; fi
fi
if [ -d "$KODE/tdc-simulator/.git" ] && git -C "$KODE/tdc-simulator" ls-remote --heads origin 2>/dev/null | grep -q agentkursus; then ok "tdc-simulator har branchen agentkursus"; else fejl "branchen agentkursus mangler i tdc-simulator" "sig det til kurset, branchen skulle vaere lagt der"; fi

echo "5. Cloudflare (kun til modul 09 og live-kobling)"
if [ -d "$KODE/agentkursus/worker/node_modules/wrangler" ] && (cd "$KODE/agentkursus/worker" && npx wrangler whoami 2>/dev/null | grep -q "logged in"); then ok "wrangler er logget ind"; else printf '  [INFO] wrangler er ikke logget ind. Kun noedvendigt for at aendre Workeren. Modul 09 bruger dashboardet paa dash.cloudflare.com.\n'; fi
if curl -s --max-time 5 https://agentkursus-api.loginalias.workers.dev/health | grep -q '"ok":true'; then ok "kursets Worker svarer"; else printf '  [INFO] kursets Worker svarer ikke. Kurset virker uden, live-data vises som eksempler.\n'; fi

echo
echo "Resultat: $OK ok, $FEJL fejl."
[ "$FEJL" -eq 0 ] && echo "Du er klar til dag 1." || echo "Ret fejlene ovenfor i dag, ikke i morgen."
