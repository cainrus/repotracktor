define(['marionette', 'underscore',
    'js/views/CollaboratorsLayoutView',
    "js/views/CollaboratorsListView",
    'js/models/CollaboratorsCollection',
    'js/models/UserModel',
    'js/models/UserCollection',
    'js/models/RateModel',
    'js/models/RateCollection',


], function (Marionette, _,
  CollaboratorsLayoutView,
  CollaboratorsListView,
  CollaboratorsCollection,
  UserModel, UserCollection, RateModel, RateCollection) {

    var CollaboratorsController = Marionette.Object.extend({
        views: {},

        initialize: function(options) {
            this.channel = options.channel;
            // this.channel.on('repository:change', this.changeRepository.bind(this));
            this.layout = new CollaboratorsLayoutView({
              channel: this.channel,
              views: {
                list: {
                  instance: CollaboratorsListView,
                  options: {channel: this.channel}
                }
              }
            });

            this.channel.comply('collaborators:change', this.change, this);
        },

        /**
         * Build data for rendering.
         *
         * @param {string} owner
         * @param {string} repo
         */
        change: function(owner, repo) {
          this.channel.trigger('collaborators:hide');

          if (!owner || !repo) {
            this.channel.trigger('collaborators:error', 'Unable to parse github url');
          } else {
            this.collaborators = new CollaboratorsCollection();
            this.collaborators.setOwner(owner);
            this.collaborators.setRepository(repo);
            this.collaborators.fetch({}).done(function() {
              // Get user-models based on collaborators (more data).
              var userList = this.collaborators.pluck('login')
                .map(function(login){
                  var user = new UserModel({login: login});
                  user.promise = user.fetch({});
                  return user;
              }.bind(this));

              var rateList = this.collaborators.pluck('id')
                .map(function(id){
                  var rate = new RateModel({id: id, type: 'collaborator'});
                  rate.promise = rate.fetch({});
                  return rate;
                });


              $.when.apply($, _.pluck(rateList.concat(userList), 'promise')).done(function() {
                var userCollection = new UserCollection(userList);
                var rateCollection = new RateCollection(rateList);

                this.channel.command('collaborators:render', {
                  collection: userCollection,
                  rateCollection: rateCollection
                });
              }.bind(this));


            }.bind(this)).fail(function(err){
                this.channel.trigger('collaborators:error', err);
            }.bind(this));
          }
        }

    });

    return CollaboratorsController;

});
