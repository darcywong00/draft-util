#!/bin/env bash
for CH in {4..28}
do
  node dist/index.js --book Acts --chapter ${CH}
done
