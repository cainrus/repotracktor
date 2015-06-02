define(["marionette", "handlebars", "underscore",
    "text!/templates/error.tpl"], function(Marionette, Handlebars, _, errorTpl ) {

    var ErrorView = Marionette.ItemView.extend({

      initialize: function(options) {
        _.bindAll(this, 'listener');
      },

      template: errorTpl,

      state: {
        text: ''
      },
      listener: function(eventName, options) {
        if (eventName.match(/[^:]+:error/)) {
          this.show(options);
        }
      },

      serializeData: function() {
        return {
          text: this.state.text
        };
      },

      onRender: function() {
        this.$el.removeClass('hidden');
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function(){
          this.hide();
        }.bind(this), 5000);
      },

      show: function(text) {
        this.$el.css('opacity', 1);
        this.state.text = text;
        this.render();
      },

      hide: function() {
        this.$el.animate({opacity: 0}, function(){
          this.show();
        }.bind(this));
      }

    });

    return ErrorView;

});
