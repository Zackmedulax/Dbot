require("dotenv").config()
const Dbot = require("./app/Dbot.js")
const TelegramBot = require('node-telegram-bot-api')
const { addUser, getUserById } = require("./libs/db")
const token = process.env.TELEGRAM_TOKEN
const news = process.env.NEWS_TOKEN
const options = {
  polling: true
}
const dbot = new Dbot(token, options)

const main = () => {
  dbot.getStart()
  dbot.getSticker()
  dbot.getFollow()
  dbot.getQuote()
  dbot.getNews()
  dbot.getMenu()
  dbot.getQuake()
  dbot.getCrypto()
  dbot.getHelp()
  dbot.getFinancial()
  dbot.getRandom()
  dbot.getWeather()
  dbot.getGame()
  dbot.getBroadcast()
  dbot.getAIChat()
  dbot.getAIImage()
  dbot.getMeme()
  dbot.getUserList()
  dbot.getTest()
  dbot.getNaruto()
  dbot.getWallet()
  dbot.getAnime()
  dbot.getJson()
  dbot.getErr()
  // dbot.getQRCode()
  // dbot.getBTCWallet()
}

main()

