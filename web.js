const path = require('path')
const express = require('express')
const app = express()

app.use(express.compress())
app.use(express.static(path.join(__dirname, 'build')))

app.listen(Number(process.env.PORT || 5000))
