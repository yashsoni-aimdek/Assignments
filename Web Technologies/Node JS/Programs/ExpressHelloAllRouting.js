var express = require('express')
var app = express()
app.get('/',function(req, res){
	res.send('Hello All')
})
app.listen(9090)