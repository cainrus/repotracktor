define(['marionette', 'underscore',
    "text!/templates/forks-layout.tpl"

  ], function (Marionette, _, template) {

    var RepositoryLayoutView = Marionette.LayoutView.extend({

        views:{},
        template: template,

        initialize: function(options){
          this.channel = options.channel;
          this.options = options;
        },
        regions: {
            list: '.list'
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
            this.getRegion('list').show(this.views.list);
        },

    });

    return RepositoryLayoutView;

});
