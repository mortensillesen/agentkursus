#!/bin/sh
# Byggetrin til Cloudflare Pages: samler de samme filer, som GitHub-workflowen deployer, i _site/.
set -e
rm -rf _site && mkdir -p _site
cp -R index.html preflight.html dashboard.html favicon.ico assets indhold moduler _site/
ls _site
