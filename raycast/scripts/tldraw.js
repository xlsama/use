#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title tldraw
// @raycast.mode silent

// Optional parameters:
// @raycast.icon https://www.tldraw.com/favicon.ico
// @raycast.packageName Link

// Documentation:
// @raycast.description Open tldraw in Google Chrome
// @raycast.author xlsama
// @raycast.authorURL https://github.com/xlsama

const { exec } = require('node:child_process')
exec(`open https://www.tldraw.com`)
