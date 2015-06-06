var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var Promise = require("bluebird");
var mongodb = require("mongodb");


require('./libs/routes.js')(app);

app.set('view engine', 'hbs');
app.use(express['static'](path.join(__dirname, 'public')));
app.use(cookieParser('BWN2rO4elkyv'));







//app.get('/', function(req, res){
//console.log('///');
//    res.sendfile(__dirname + '/public/index.html');
//
//});



module.exports = app;
