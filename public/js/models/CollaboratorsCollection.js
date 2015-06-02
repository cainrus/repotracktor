'use strict';
define(['backbone', './CollaboratorModel', '../utils/Backbone.sync'], function (Backbone, CollaboratorModel, sync) {
    var CollaboratorsCollection = Backbone.Collection.extend({
        setRepository: function(repo) {
            this.repo = repo;
        },
        setOwner: function(owner){
            this.owner = owner;
        },
        url: function() {
            return ['/repos', this.owner, this.repo, 'collaborators'].join('/');
        },
        model: CollaboratorModel,
        sync: sync
    });

    return CollaboratorsCollection;
});
