'use strict';

define(['backbone', './RateModel'], function (Backbone, RateModel) {
    var RateCollection = Backbone.Collection.extend({

        defaults: {
          type: null
        },
        url: function(){
          return ['/api', this.get('type'), this.get('ids')].join('/');
        },

        model: RateModel,
    });

    return RateCollection;
});
