// Import the necessary modules.
import cheerio from 'cheerio'
import { readFile } from 'fs'

readFile('./coverage/lcov-report/index.html', 'utf-8', (err, data) => {
  if (err) {
    throw err
  }

  const $ = cheerio.load(data)
  const coverage = $('div.fl.pad1y.space-right2').map(function () {
    const entry = $(this)

    const fraction = entry.find('span.fraction').text()
    const regex = /(\d+)\/(\d+)/i
    const covered = parseInt(fraction.match(regex)[1], 10)
    const total = parseInt(fraction.match(regex)[2], 10)

    return {
      covered,
      total
    }
  }).get()

  const total = coverage.reduce((total, current) => total + current.total, 0)
  const covered = coverage.reduce((total, {covered}) => total + covered, 0)

  const percentage = (covered / total) * 100
  console.log(`Coverage : ${percentage.toFixed(2)}%`) // eslint-disable-line no-console
})
