var path = require('path');
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(Number(process.env.PORT || 5000));