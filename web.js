var path = require('path');
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());





// Serve static files
app.use(express.static(path.join(__dirname, 'dist'))); 

// Route for everything else.
app.get('*', function(req, res){
  res.send('Hello World');
});



var port = Number(process.env.PORT || 5000);


app.listen(port, function() {
  console.log("Listening on " + port);
});