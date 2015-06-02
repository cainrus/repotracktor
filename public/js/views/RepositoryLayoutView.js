define(['marionette', 'handlebars',
    "text!/templates/repository-layout.tpl"
  ], function (Marionette, Handlebars, tpl) {

    var RepositoryLayoutView = Marionette.LayoutView.extend({
        views:{},
        template: tpl,

        initialize: function(options) {
          this.options = options;
          this.channel = options.channel;
        },

        regions: {
            input: '.input'
        },

        onBeforeShow: function() {
          // Init regions.
          _.each(this.options.views, function(view, id) {
            if (!this.views[id]) {
              this.views[id] = new view.instance(view.options || {});
            }
          }, this);
        },

        onShow: function() {
            this.getRegion('input').show(this.views.input);
        },

    });

    return RepositoryLayoutView;

});
