const path = require('path')
const express = require('express')
const logfmt = require('logfmt')
const app = express()

app.use(logfmt.requestLogger())
app.use(express.compress())
app.use(express.static(path.join(__dirname, 'build')))

app.listen(Number(process.env.PORT || 5000))
