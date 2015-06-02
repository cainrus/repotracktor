define([
    'underscore',
    'marionette',
    'backbone_radio'

], function (_, Marionette, Radio) {
    Marionette.Radio = Radio;

    Marionette.Application.prototype._initChannel = function () {
        this.channelName = _.result(this, 'channelName') || 'global';
        this.channel = _.result(this, 'channel') ||
            Radio.channel(this.channelName);
    };

    // Radio._eventsApi = _.wrap(function(fn, obj, action, name, rest){
    //
    //   return fn.call(this, obj, action, name, rest);
    // });

    return Marionette;
});
