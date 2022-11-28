import { showHUD, closeMainWindow } from '@raycast/api'
import { exec } from 'child_process'

const str = 'aaaaaaaaaaaaaa'

const invoke = () => {
  return new Promise<string>((resolve, reject) => {
    exec(`echo ${str}`, async (err, stdout) => {
      if (err) {
        reject(err)
        return
      }

      resolve(stdout)
    })
  })
}

export default async () => {
  /**
   * 1. set sm.ms token to raycast storage
   * 2. get sm.ms token from raycast storage
   * 3. invoke exec('<command> <token>')
   */

  const res = await invoke()

  console.log(res)

  await closeMainWindow({ clearRootSearch: true })
  await showHUD(res)
}
