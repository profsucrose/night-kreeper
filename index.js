const { App } = require('@slack/bolt')
const dotenv = require('dotenv')
dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
})

/**
 * Generates a psuedorandom number from zero to a specified boundary.
 * @param {number} bound - Boundary of random number.
 * @returns {number}
 */
function nextInt(bound) {
    return Math.floor(Math.random() * bound)
}

/**
 * Generates a formatted date string for Slack.
 * @constructor
 * @param {Date} date - Javascript Date object to be used for date string.
 * @returns {string}
 */
function formatDateForSlack(date) {
    const timestamp = (date.getTime() / 1000).toFixed(0)
    const linkToTime = `https://time.is/${timestamp}`
    return `<!date^${timestamp}^{date_short_pretty} at {time}^${linkToTime}|${date}>`
}

/**
 * Generates a random Date object for Ken Night.
 * @returns {Date}
 */
function getRandomKenNightDate() {
    const date = new Date()
    date.setDate(date.getDate() + nextInt(7))
    date.setHours(date.getDate() + nextInt(24))
    date.setMinutes(date.getMinutes() + nextInt(60))
    return date
}

;(async () => {
    const port = process.env.PORT || 3000
    await app.start(port)
    console.log(`Started bot on port ${port}`)

    app.event('message', async ({ event }) => {
        console.log(event)
        const text = event.text
        const match = text.match(/k+(e|a)h*(n|l)+ (n|s)+(a|e|i|o|u)+(g|h)h*(t|d)*/gi)
        if (match.length > 0) {
            await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: event.channel,
                text: `The next _${match[0]}_ is *${formatDateForSlack(getRandomKenNightDate())}*`,
                thread_ts: event.ts
            })
        }
    })
})()