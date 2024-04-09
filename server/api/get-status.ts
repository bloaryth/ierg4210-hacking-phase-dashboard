import * as fs from 'node:fs/promises'
import * as process from 'node:process'
import * as path from 'node:path'

export default defineEventHandler(async event => {
  const filePath = path.join(process.cwd(), 'public', 'status.json')
  const status = await fs.readFile(filePath, 'utf-8')
  return status
})
