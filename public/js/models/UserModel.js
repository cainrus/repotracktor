'use strict';
define(['backbone',
    '../utils/Backbone.sync'], function (Backbone, sync) {
    var UserModel = Backbone.Model.extend({
      url: function() {
          return ['/users', this.get('login')].join('/');
      },
      parse: function(json){
        return json.data;
      },
      sync: sync
    });

    return UserModel;
});
