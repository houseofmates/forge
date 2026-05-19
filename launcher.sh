#!/bin/bash

# Launcher script for ApprenticeVR fork
# Runs the app in development mode

cd /home/house/forge/forge
VITE_ELECTRON_ARGS="--disable-gpu" pkill -f adb; pnpm dev