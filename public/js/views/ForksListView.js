define(['marionette',
    "js/views/RateView",
    "text!/templates/forks-list.tpl"], function (Marionette, RateView, template) {

    var ForksListView = Marionette.ItemView.extend({

        template: template,
        initialize: function(options) {
          this.channel = options.channel;
          this.channel.comply('forks:render', this.preRender, this);
          this.listenTo(options.channel, 'forks:hide', this.hide, this);

        },

        events: {
          'click .toggler': 'toggle'
        },

        preRender: function(data){
          this.collection = data.collection;
          this.rateCollection = data.rateCollection;
          this.render();
          this.$el.show();
        },

        hide: function() {
          this.$el.hide();
        },

        toggle: function(e){
          var $toggler = $(e.target).closest('.toggler');
          this.isListVisible = $toggler.hasClass('glyphicon-eye-open');
          if (this.isListVisible) {
            $toggler.removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
          } else {
            $toggler.addClass('glyphicon-eye-open').removeClass('glyphicon-eye-close');
          }

          if (!this.isListVisible) {
            $('table', this.$el).show();
          } else {
            $('table', this.$el).hide();
          }
        },

        onRender: function(){
          this.renderRates();
        },

        renderRates: function() {
          if (this.rateCollection) {
            this.rates = this.rates || [];
            this.rateCollection.map(function(model) {
              var id = model.get('id');
              var type = model.get('type');
              var rateView = new RateView({
                model: model,
                el: '.rateControl[data-type="'+type+'"][data-id="'+id+'"]'
              });
              rateView.render();
              this.rates.push(rateView);
            }, this);
          }
        }


    });

    return ForksListView;
});
