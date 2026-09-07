#!/bin/zsh
# Laver PDF (til Canva-import) og PNG-forhaandsvisning af hver infografik med Chrome headless.
# Brug:  zsh infografik/byg-pdf.sh [pdf|png] [slug ...]
# Chrome headless afslutter ikke altid selv paa macOS, saa hver koersel ventes paa filen og stoppes.
set -u
ROD=$(cd "$(dirname "$0")" && pwd)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TILSTAND=${1:-pdf}; shift 2>/dev/null || true
PROFIL=${TMPDIR:-/tmp}/agentkursus-chrome-profil
mkdir -p "$ROD/pdf" "$ROD/prev" "$PROFIL"
if [ $# -eq 0 ]; then set -- $(cd "$ROD/html" && ls *.html | sed 's/\.html$//'); fi
for slug in "$@"; do
  html="$ROD/html/$slug.html"
  if [ "$TILSTAND" = "pdf" ]; then
    out="$ROD/pdf/$slug.pdf"; flag="--print-to-pdf=$out"; ekstra="--no-pdf-header-footer"
  else
    out="$ROD/prev/$slug.png"; flag="--screenshot=$out"; ekstra="--hide-scrollbars"
  fi
  rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFIL" --window-size=1600,900 $ekstra "$flag" "file://$html" >/dev/null 2>&1 &
  pid=$!
  for i in $(seq 1 60); do [ -s "$out" ] && break; sleep 0.5; done
  sleep 0.5; kill $pid 2>/dev/null; wait $pid 2>/dev/null
  if [ -s "$out" ]; then echo "ok  $out"; else echo "FEJL $slug"; fi
done
