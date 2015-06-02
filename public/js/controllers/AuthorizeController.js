define(['marionette', 'underscore',
  "js/views/AuthView",
  "js/modules/AuthModule",
  'js/utils/localStorage'

], function (Marionette, _,
  AuthView, auth, storage) {

    var AuthorizeController = Marionette.Object.extend({
      initialize: function(options) {
        var self = this;
        this.channel = options.channel;
        this.trigger('login');
        this.view = new AuthView({channel: this.channel});

        this.channel.on('auth:click', this.authenticate, this);
      },

      /**
       * @param {number=0} [count]
       */
      authenticate: function(count) {
        count = count || 0;

        auth.login()

          .done(function(){
              this.channel.trigger('auth:login');
          }.bind(this))

          .fail(function(message) {
            if (count < 2) {
              auth.reset();
              this.authenticate(count);
            } else {
              self.channel.trigger('auth:error', message);
            }
          }.bind(this));
          
        count++;
      }
    });

    return AuthorizeController;
});
