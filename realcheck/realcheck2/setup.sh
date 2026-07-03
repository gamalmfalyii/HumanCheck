#!/bin/bash
echo "Installing Realcheck dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo ""
  echo "Install failed. Make sure Node.js is installed: https://nodejs.org"
  exit 1
fi
echo ""
echo "Done! Run 'npm start' to launch the app."
