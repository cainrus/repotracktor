define(['marionette', 'underscore',
    "text!/templates/collaborators-layout.tpl",
    "js/models/CollaboratorsCollection.js"

  ], function (Marionette, _, template,
    CollaboratorsCollection) {

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
          var views = this.options.views;
          this.views.list = new views.list.instance(views.list.options);
        },
        onShow: function() {
            this.getRegion('list').show(this.views.list);
        },

    });

    return RepositoryLayoutView;

});
