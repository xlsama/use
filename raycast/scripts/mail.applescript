#!/usr/bin/osascript

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Gmail
# @raycast.mode silent

# Optional parameters:
# @raycast.icon https://s2.loli.net/2022/11/29/tq91Iow6ufgCZaB.png
# @raycast.packageName Productivity

# Documentation:
# @raycast.description Open gmail in Google Chrome
# @raycast.author xlsama
# @raycast.authorURL https://github.com/xlsama

tell application "Google Chrome"
	open location "https://mail.google.com"
end tell