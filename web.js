
var path = require('path');
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());


app.use(express.compress());


// Serve static files
app.use(express.static(path.join(__dirname, 'dist'))); 





var port = Number(process.env.PORT || 5000);


app.listen(port, function() {
 // console.log("Listening on " + port);
});