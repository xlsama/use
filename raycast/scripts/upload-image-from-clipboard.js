#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Upload image from clipboard
// @raycast.mode silent

// Optional parameters:
// @raycast.icon images/smms.png
// @raycast.packageName Productivity

// Documentation:
// @raycast.description Upload image from clipboard to SM.MS
// @raycast.author xlsama
// @raycast.authorURL https://github.com/xlsama

const { exec } = require('child_process')
const { createReadStream } = require('fs')
const { homedir } = require('os')

const filePath = `${homedir()}/Pictures/my  vocab-2022-11-06.png`

upload()

async function upload() {
  const form = new FormData()

  form.append('smfile', createReadStream(filePath))

  // api: https://doc.sm.ms/#api-Image-Upload
  const res = await fetch('https://smms.app/api/v2/upload', {
    method: 'post',
    headers: {
      'Content-Type': 'application/octet-stream',
      Authorization: 'R3SB68a7pSGXdUVsuz9GIU2fMMXE1WNd',
      referer: 'https://sm.ms/',
      origin: 'https://sm.ms/'
    },
    body: form
  })
  if (res.ok) {
    const data = await res.json()

    console.log(data)

    switch (data.code) {
      case 'success':
        exec(`echo ${data.data.url} | pbcopy`)
        return
      case 'image_repeated':
        exec(`echo ${data.images} | pbcopy`)
        return
      default:
        break
    }
  }
}
