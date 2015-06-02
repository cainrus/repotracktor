'use strict';

(function () {

    var promisify = function (el, eventName) {
        var d = new $.Deferred();
        el.on(eventName, d.resolve);
        return d;
    };

    var STORAGE_KEY = 'access_token';

    define(["jquery", "../utils/LocalStorage"],

        function ($, storage) {
            return {
              login: function() {
                var d = $.Deferred();
                var token = localStorage.getItem(STORAGE_KEY);
                if (token) {
                    d.resolve(token);
                } else {
                    var collbaorators = ['public_repo'];
                    var popup = window.open('https://github.com/login/oauth/authorize?client_id=526248ed6d1de7b9e5f4&scope='+collbaorators.join(','));
                    if (!popup) {
                      d.reject('Authorization popup was blocked, try again');
                    } else {
                    promisify($(window), 'message').then(function (event) {
                        return $.get('/authorize?code=' + event.originalEvent.data, function (access_token) {
                            if (access_token) {
                                localStorage.setItem('access_token', access_token);
                                d.resolve(access_token);
                            } else {
                                d.reject('Unable to get token');
                            }
                        });
                    });
                  }
                }
                return d;
              },
              reset: function() {
                storage.removeItem(STORAGE_KEY)
              }
           };
        }
    );
}());
