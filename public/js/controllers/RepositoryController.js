define(['marionette',
    'js/views/RepositoryLayoutView',

    "js/views/RepositoryInputView",
    '../utils/localStorage'


], function (Marionette, RepositoryLayoutView, RepositoryInputView, storage) {

    var PLACEHOLDER = 'https://github.com/marionettejs/backbone.marionette';

    var RepositoryController = Marionette.Object.extend({
        views: {},
        repositoryPattern: /^(https?\:\/\/)?github\.com\/[\w.-]+\/[\w.-]+$/,

        initialize: function(options) {

            this.channel = options.channel;
            this.channel.on('repository:change', this.changeRepository.bind(this));
            this.layout = new RepositoryLayoutView({
              channel: this.channel,
              views: {
                input: {
                  instance: RepositoryInputView,
                  options: {
                    channel: this.channel,
                    placeholder: PLACEHOLDER,
                    value: storage.getItem('lastRepository') || '',
                    pattern: this.repositoryPattern
                  }
                }
              }
            });

        },



        changeRepository: function(data) {
            this.resetState();
            if (!this.repositoryPattern.test(data.value)) {
              data.isValid = false;
              this.channel.trigger('repository:error', 'repository example: https://github.com/owner/repository');
            } else {
              data.isValid = true;
              if (data.value !== PLACEHOLDER) {
                storage.setItem('lastRepository', data.value);
              }
            }
        },

        resetState: function(){
          // if (this.layout.views.error) {
          //   this.layout.views.error.destroy();
          // }
        }

    });

    return RepositoryController;

});
