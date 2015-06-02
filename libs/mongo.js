'use strict';

var Promise = require("bluebird");
var mongodb = require("mongodb");
var config = require('./configs.js').db;

Promise.promisifyAll(mongodb);

// Use connect method to connect to the Server
module.exports = mongodb.connectAsync(config.mongodb_url)
  .then(function(db) {
    console.log("Connected correctly to db server");
    return db;
  });
