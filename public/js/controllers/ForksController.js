define(['marionette', 'underscore',
    'js/views/ForksLayoutView',
    "js/views/ForksListView",
    'js/models/ForksCollection',
    'js/models/RateModel',
    'js/models/RateCollection'
], function (Marionette, _,
  ForksLayoutView,
  ForksListView,
  ForksCollection,
  RateModel,
  RateCollection
) {

    var ForksController = Marionette.Object.extend({
        views: {},

        /**
         * @param {object} options
         */
        initialize: function(options) {
            this.channel = options.channel;

            this.layout = new ForksLayoutView({
              channel: this.channel,
              views: {
                list: {
                  instance: ForksListView,
                  options: {channel: this.channel}
                }
              }
            });

            this.channel.comply('forks:change', this.change, this);
        },


        /**
         * Build data for rendering.
         *
         * @param {string} owner
         * @param {string} repo
         */
        change: function(owner, repo) {
          this.channel.trigger('forks:hide');

          if (!owner || !repo) {
            this.channel.trigger('forks:error', 'Unable to parse github url');
          } else {
            this.forks = new ForksCollection();
            this.forks.setOwner(owner);
            this.forks.setRepository(repo);
            this.forks.fetch({}).done(function() {


              var rateList = this.forks.pluck('id')
                .map(function(id){
                  var rate = new RateModel({id: id, type: 'fork'});
                  rate.promise = rate.fetch({});
                  return rate;
              });

              $.when.apply($, _.pluck(rateList, 'promise')).done(function() {
                this.channel.command('forks:render', {
                  collection: this.forks,
                  rateCollection: new RateCollection(rateList)
                });
              }.bind(this));

            }.bind(this)).fail(function(err){
                this.channel.trigger('forks:error', err);
            }.bind(this));
          }
        }

    });

    return ForksController;

});
