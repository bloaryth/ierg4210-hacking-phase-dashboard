import { useScheduler } from '#scheduler'
import * as fs from 'node:fs/promises'
import * as process from 'node:process'
import * as path from 'node:path'
import moment from 'moment'

export default defineNitroPlugin(() => {
  const scheduler = useScheduler()
  const fetchInterval = 1
  const startTime = moment('2024-04-10 00:00:00')
  const endTime = moment('2024-04-21 00:00:00')

  scheduler
    .run(async () => {
      const filePath = path.join(process.cwd(), 'public', 'status.json')
      const status = await fs.readFile(filePath, 'utf-8')
      const rows = JSON.parse(status)
      await Promise.all(
        rows.map(async (row: any) => {
          const url = row.url
          try {
            const response = await fetch(url)
            if (response.ok) {
              row.active = true
              if (moment().isBetween(startTime, endTime)) {
                row.duration += fetchInterval
              }
            } else {
              row.active = false
            }
          } catch (error) {
            row.active = false
          }
        })
      )
      await fs.writeFile(filePath, JSON.stringify(rows), 'utf-8')
    })
    .everyMinutes(fetchInterval)
})
