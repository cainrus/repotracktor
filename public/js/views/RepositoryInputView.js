define(['marionette', 'underscore',
    "text!/templates/repository.tpl",
    "../utils/localStorage"
  ], function (Marionette, _, template, storage) {
    var RepositoryInputView = Marionette.ItemView.extend({
        template: template,
        events: {
          'repository:process': 'confirmRepository',
          'click button': 'confirmRepository',
          'keyup': 'processKey',
          'focus input': 'savePromoState'
        },

        initialize: function (options) {
          this.options = options;
          this.channel = options.channel;
          this.channel.comply('repository:change', this.confirmRepository, this);
          this.channel.comply('repository:focus', this.focusInput, this)
        },

        serializeData: function(){
          return {
            placeholder: this.options.placeholder,
            value: this.options.value,
            pattern: this.options.pattern,
            shake: storage.getItem('promo-focus') ? '' : 'shake'
          };
        },

        onRender: function() {
          this.$input = $('input', this.$el);
        },

        processKey: function (e) {
          if (e.which === 13) { // enter key
              this.confirmRepository();
          }
        },

        getValue: function() {
          return this.$input.val() || this.options.placeholder;
        },

        confirmRepository: _.debounce(function () {
          this.channel.trigger('repository:change', {value: this.getValue()});
        }, 1000),

        focusInput: function() {
          this.$input.focus();
        },

        savePromoState: function() {
          this.$input.removeClass('shake');
          storage.setItem('promo-focus', 'done');
        }
    });

    return RepositoryInputView;

});
