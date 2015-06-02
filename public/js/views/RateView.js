define(["marionette", "underscore",
// 'js/models/RateModel'
        "text!/templates/rate.tpl"], function(Marionette, _, template ) {
    var RateView = Marionette.ItemView.extend({

        template : template,
        events: {
          'click .rate-up': 'up',
          'click .rate-down': 'down',
        },

        up: function(){
          this.model.up();
        },

        down: function(){
          this.model.down();
        },

        initialize: function(options) {
          this.channel = options.channel;
          this.model.on('sync', this.render, this);
        }

    });

    return RateView;

});
