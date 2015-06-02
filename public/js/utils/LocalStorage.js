define([], function(){
    'use strict';

    var localstorage, i = 0, token='ls_check', fail = false;

    try {
        localstorage = window.localStorage;
        while (localstorage.getItem(token + i++)) {
        }
        token += i;
        localstorage.setItem(token, token);
        if (localstorage.getItem(token) !== token) {
            fail = true;
        } else {
            localstorage.removeItem(token);
        }
    } catch (e) {
        fail = true;
    }

    var logError = function (msg) {
            var message = 'localStorage is disabled. ' + (msg ? msg : '');
            console.error(message);
        },
        call = function (cb) {
            try {
                return cb();
            } catch (e) {
                logError(e);
            }
        };


    if (fail) {
        localstorage = {
            removeItem: logError,
            setItem: logError,
            getItem: logError,
            clear: logError
        };
    } else {

        localstorage = {
            setItem: function (key, value) {
                return call(function () {
                    return window.localStorage.setItem(key, value);
                });
            },
            getItem: function (key) {
                return call(function () {
                    return window.localStorage.getItem(key);
                });
            },
            removeItem: function (key) {
                return call(function () {
                    return window.localStorage.removeItem(key);
                });
            },
            clear: function () {
                return call(function () {
                    return window.localStorage.clear();
                });
            },
            key: function (key) {
                return call(function () {
                    return window.localStorage.key(key);
                });
            }
        };
    }

    return localstorage;
});