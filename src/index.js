const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const route = require('./router')

const dataFiles = require('./data')
dataFiles.loadSeats()
dataFiles.loadSeatPricing()

app.use(express.json())

mongoose.connect(process.env.URL, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT, () => {
    console.log("Server Successfully Started!")
})
