#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title 豆瓣
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/douban.png
// @raycast.packageName Link

// Documentation:
// @raycast.description Open 豆瓣 in Google Chrome
// @raycast.author xlsama
// @raycast.authorURL https://github.com/xlsama

const { exec } = require('node:child_process')
exec(`open https://www.douban.com/people/xlsama`)
