const { App } = require('@slack/bolt')
const dotenv = require('dotenv')
dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
})

/**
 * Gets formatted date string from Date object
 * @param {Date} date - Date object
 * @returns {string}
 */
function getFormattedDateForSlackMessage(date) {
    const hour = date.getHours()
    const minute = date.getMinutes()

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayIsToday = (new Date()).getDay() == date.getDay() 
    const day = dayIsToday ? 'Today' : days[date.getDay()]
    return `*${!dayIsToday ? 'next ' : ''}${day} at ${hour == 12 ? 12 : hour % 12}:${minute < 10 ? '0' : ''}${minute} ${hour >= 12 ? 'PM' : 'AM'}*`
}

/**
 * Generates a psuedorandom number from zero to a specified boundary
 * @param {number} bound - Boundary of random number
 * @returns {number}
 */
function nextInt(bound) {
    return Math.floor(Math.random() * bound)
}

// /**
//  * Generates a formatted date string for Slack
//  * @param {Date} date - Javascript Date object to be used for date string
//  * @returns {string}
//  */
// function formatDateForSlack(date) {
//     const timestamp = (date.getTime() / 1000).toFixed(0)
//     const linkToTime = `https://time.is/${timestamp}`
//     return `<!date^${timestamp}^{date_short_pretty} at {time}^${linkToTime}|${date}>`
// }

/**
 * Generates a random Date object for Ken Night
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
        const match = text.match(/(c|k)+(e|a)h*(n|l)+ ((n|s)+(a|e|i|o|u)+(g|h)h*(t|d)*|nut+)/gi)
        if (/next/gi.test(text)
                && match.length > 0) {
            await app.client.chat.postMessage({
                token: process.env.SLACK_BOT_TOKEN,
                channel: event.channel,
                text: `The next _${match[0]}_ is ${getFormattedDateForSlackMessage(getRandomKenNightDate())} Ken Time. See you there!`,
                thread_ts: event.thread_ts ? event.thread_ts : event.ts
            })
        }
    })
})()