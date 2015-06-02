define(["marionette",

        "text!/templates/auth.tpl"], function(Marionette, template ) {
    var HelloView = Marionette.ItemView.extend({

        template : template,

        initialize: function(options) {
          this.channel = options.channel;
          this.channel.on('auth:login', this.hideButton, this);
        },

        onRender: function() {
          this.$button = $('#authorize', this.$el);
        },

        events: {
          'click #authorize': 'clickButton'
        },

        clickButton: function() {
          this.channel.trigger('auth:click');
        },

        hideButton: function() {
          this.$button.addClass('offscreen');
        }
    });

    return HelloView;

});
