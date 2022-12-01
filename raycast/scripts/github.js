#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Github
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/github2.png
// @raycast.packageName Link

// Documentation:
// @raycast.description Open Github in Google Chrome
// @raycast.author xlsama
// @raycast.authorURL https://github.com/xlsama

const { exec } = require('node:child_process')
exec(`open https://github.com`)
