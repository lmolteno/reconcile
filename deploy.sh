#!/bin/bash

set -e

yarn run build
cd dist
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'
git push -f git@github.com:lmolteno/reconcile.git main:gh-pages

cd -