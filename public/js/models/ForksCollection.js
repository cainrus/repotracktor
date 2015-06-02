'use strict';

define(['backbone', './ForkModel', '../utils/Backbone.sync'], function (Backbone, ForkModel, sync) {
    var ForksCollection = Backbone.Collection.extend({

        setRepository: function(repo) {
            this.repo = repo;
        },
        setOwner: function(owner){
            this.owner = owner;
        },

        url: function() {
            return ['/repos', this.owner, this.repo, 'forks'].join('/');
        },
        model: ForkModel,
        sync: sync
    });

    return ForksCollection;
});
