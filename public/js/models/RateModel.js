'use strict';

define(['backbone'], function (Backbone) {

    var RateModel = Backbone.Model.extend({
      defaults: {
        vote: '0',
        total: null,
        type: null,
        id: null
      },
      initialize: function(){
        this.on('change:vote', function(model){
          this.set('isVotedUp', model.attributes.vote > 0);
          this.set('isVotedDown', model.attributes.vote < 0);
        }, this);
      },

      url: function(){
        return ['/api', this.get('type'), this.get('id')].join('/');
      },

      up: function() {
        if (this.get('vote') === 1) {
          return this.cancel();
        } else {
          return this.fetch({url: this.url() + '/up',data:[]})
        }
      },
      down: function() {
        if (this.get('vote') === -1) {
          return this.cancel();
        } else {
          return this.fetch({url: this.url() + '/down',data:[]});
        }
      },
      cancel: function() {
        return this.fetch({url: this.url() + '/cancel',data:[]});
      }

    });
window.RateModel = RateModel;
    return RateModel;
});
