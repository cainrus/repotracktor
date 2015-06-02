'use strict';

var fs = require('fs');

var loadOAUTHConfig = function(){
  var config = JSON.parse(fs.readFileSync(__dirname+ '/../configs/oauth.json', 'utf-8'));
  for (var i in config) {
      config[i] = process.env[i.toUpperCase()] || config[i];
  }

  config["oauth_client_id"] = process.env.GITHUB_OAUTH_ID;
  config["oauth_client_secret"] = process.env.GITHUB_OAUTH_SECRET;

  return config;

}

var loadMONGODBConfig = function() {
  var config = {};
  config["mongodb_url"] = process.env.MONGODB_URL;
  return config;
}

// Load config defaults from JSON file.
// Environment variables override defaults.
module.exports = (function loadConfig() {

  // Check required params.
  ['MONGODB_URL', 'GITHUB_OAUTH_ID', 'GITHUB_OAUTH_SECRET'].map(function(key){
    if (!process.env[key]) {

      throw new Error([
        '',
        'Unable to get %s1',
        'Start the app with env variable: `%s1=[YOUR_KEY] npm start`',
        ''
      ].join("\n").replace(/%s1/g, key));
    }
  });





  return { oauth: loadOAUTHConfig(), db: loadMONGODBConfig() };

}());
