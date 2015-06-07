'use strict';

define(['jquery', 'underscore', './localStorage', '../modules/AuthModule'], function($, _, storage, auth){

    var sync = function (method, model, options) {

        var d = $.Deferred(),
            urlPath,
            xhr,
            baseUrl = 'https://api.github.com',
            apiDataCollection = {
                '/collaborators': {
                  method: 'get'
                },
                '/users': {
                  method: 'get'
                },
                forks: {
                  method: 'get'
                }
            },
            apiDataItem,
            defaultXhrOptions,
            xhrOptions,
            storageKey;

        // defaults.
        options = options || {};
        options.error = options.error || Function;

        if (method !== 'read') {
            throw new Error('method "' + method + '" is not implemented.');
        }

        urlPath = _.result(model, 'url');
        if (!urlPath) {
            return d.reject('Unable to read url param.');
        }

        apiDataItem = _.extend({}, _.filter(apiDataCollection, function (item, key) {
            return Boolean(key === urlPath || urlPath.match(new RegExp(key)));
        })[0]);

        if (!apiDataItem.method) {
            return d.reject('Unable to process request.');
        }

        // Default JSON-request options.
        defaultXhrOptions = {
            url: baseUrl + urlPath,
            //type: apiDataItem.method,
            dataType: 'jsonp',
            data: {},
            crossDomain: true
        };

        storageKey = apiDataItem.method + ':' + urlPath;

        d
            .done(options.success)
            .fail(options.error);

        if (apiDataItem.cacheSupport) {

            var cachedResp;
            try {
                cachedResp = JSON.parse(storage.getItem(storageKey));
            } catch (e) {
                var message;
                switch (true) {
                    case e instanceof ReferenceError:
                        message = 'Storage is not available';
                        break;
                    case e instanceof SyntaxError:
                        message = 'Storage data is corrupted';
                        break;
                    case e instanceof DOMException:
                        message = 'Storage is not available';
                        break;
                    default:
                        message = 'Unable to get data';
                }
                // if local data is required, then fail, otherwise xhr fallback.
            }

            if (cachedResp) {
                return d.resolve(cachedResp);
            } else if (options.fromCache) {
                return d.reject();
            }
        }

        auth.login().then(function(access_token){
            // Make the request, allowing the user to override any Ajax options.
            xhrOptions = _.extend(defaultXhrOptions, options);
            xhrOptions.data.access_token = access_token;
            xhr = options.xhr = Backbone.ajax(xhrOptions);
            return xhr;
        }).fail(function (xhr, status, message) {
          var errorMessage;
          // $.ajax error.
            if (typeof xhr === 'object') {
              errorMessage = xhr.responseJSON && xhr.responseJSON.error;
              errorMessage = message + ': ' + errorMessage;
          // promise was failed.
            } else if (typeof xhr === 'string') {
              errorMessage = xhr;
            }
            errorMessage = errorMessage || 'api response is not successful';

            return d.reject.call(d, errorMessage);
        }).done(function (json, status, xhr) {
            try {
                if (apiDataItem.cacheSupport) {
                    storage.setItem(storageKey, JSON.stringify(json));
                }
            } catch (e) {
            }
            var isSuccess = json && json.meta && json.meta.status === 200 && json.data;
            if (isSuccess) {
                return d.resolve(json.data);
            } else {
              var errorMessage = json && json.responseJSON && json.responseJSON.error;
              errorMessage = errorMessage || json.data && json.data.message;
              errorMessage = errorMessage || 'API Response is not successful';
              return d.reject.call(d, errorMessage);
            }
        });

        model.trigger('request', model, xhr, options);

        return d;
    };

    return sync;

});
