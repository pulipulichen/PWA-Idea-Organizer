#!/bin/sh
set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/compose-env.sh"
cd "$SCRIPT_DIR/.."

$COMPOSE_CMD run app npm run w2.webpack-watch-development
