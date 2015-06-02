define(['marionette',
    "text!/templates/collaborators-controls.tpl"], function (Marionette, template) {
    var CollaboratorsControlsView = Marionette.ItemView.extend({
      template: template
    });

    return CollaboratorsControlsView;
});
