'use strict';
define(['backbone', './UserModel', '../utils/Backbone.sync'], function (Backbone, UserModel, sync) {
    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        sync: sync
    });

    return UserCollection;
});
