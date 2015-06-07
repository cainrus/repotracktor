'use strict';

var mongoConnection = require('./mongo.js');
var configs = require('./configs.js');


module.exports = function(app) {

  mongoConnection.then(function(db) {

    var actionMap = {'down': -1, 'up': 1, 'cancel': 0};

    app.get('/api/:type(fork|collaborator)/:id/:action(down|up|cancel)?', function (req, res, next) {

      var type = req.params.type;
      var id = parseInt(req.params.id);
      var action = req.params.action;
      var vote = actionMap[action];
      var isCancel = vote === actionMap.cancel;
      var ip = req.connection.remoteAddress;

      if (isNaN(id)) {
        return next();
      }

      db.createCollectionAsync('rates').then(function(collection) {

        if (!action) {
          return collection.findOneAsync(
            {id: id, type: type, ip: ip}
          );
        }

        else if (isCancel) {
          return collection.removeAsync(
            {id: id, type: type, ip: ip},
            {
              justOne: true
            }
          );
        }
        else {
          return collection.findAndModifyAsync(
            {id: id, type: type, ip: ip},
            {vote: 1},
            { $set: { vote: vote } },
            {upsert: true}
          )
        }
      })

      .then(function(doc){

        if (doc && !doc.lastErrorObject) {
          vote = doc.vote;
        }

        return db.collection('rates').aggregateAsync([
          {
            "$match": {
              "type": type,
              "id": id
            }
          },
          {
            "$group": {
              "_id": null,
              "total": { "$sum": "$vote" }
            }
          }
        ]);
      })

      .then(function(result){
        var total = result && result[0] && result[0].total || 0;
        res.json({type: type, id: id, total: total, vote: vote || 0})
      });

    });

    app.get('/', function (req, res) {
      res.render('index');
    });




    app.get('/redirect', function (req, res) {
      res.render('redirect');
    });

    app.get('/authorize', function(req, res) {

        authenticate(req.query.code, function(err, token) {
          res.json(token||'error');
        });

    });




    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    } else {
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

  });


  return app;
}

/**
 *
 * @param {string} code
 * @param {Function} cb
 */
function authenticate(code, cb) {
    var qs = require('querystring');
    var https = require('https');
    var config = configs.oauth;

    var data = qs.stringify({
        client_id: config.oauth_client_id,
        client_secret: config.oauth_client_secret,
        code: code
    });

    var reqOptions = {
        host: config.oauth_host,
        port: config.oauth_port,
        path: config.oauth_path,
        method: config.oauth_method,
        headers: {
            'content-length': data.length
        }
    };

    var body = "";
    var req = https.request(reqOptions, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) { body += chunk; });
        res.on('end', function() {
            cb(null, qs.parse(body).access_token);
        });
    });
    req.write(data);
    req.end();
    req.on('error', function(e) { cb(e.message); });
}
