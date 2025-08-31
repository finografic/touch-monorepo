#!/bin/bash
cd "$(dirname "$0")"
(./start-server-macos.sh &) >/dev/null 2>&1
(./start-client-macos.sh &) >/dev/null 2>&1
