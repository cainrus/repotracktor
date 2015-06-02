(function(){
    'use strict';

    var isMinimized = false;
    function changeLink(path, ext) {
      return isMinimized ? path : path.replace(/[-.]min$/, '');
    }


    require.config({
        baseUrl: '/',
        link: {
            ignoreBaseUrl: true
        },
        paths : {
            handlebars: [
                changeLink('//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.2/handlebars.min'),
                changeLink('vendors/handlebars/handlebars.min')
            ],
            backbone : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.0/backbone-min'),
                'vendors/backbone/backbone'
            ],
            underscore : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min'),
                'vendors/underscore/underscore'
            ],
            jquery : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min'),
              changeLink('vendors/jquery/dist/jquery.min')
            ],
            link: [
                'vendors/requirejs-link/link'
            ],
            text: [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text'),
                'vendors/requirejs-text/text'
            ],
            marionette : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.1/backbone.marionette.min'),
                'vendors/marionette/lib/backbone.marionette'
            ],
            wreqr : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/backbone.wreqr/1.3.2/backbone.wreqr.min'),
                'vendors/backbone.wreqr/lib/backbone.wreqr'
            ],
            //eventbinder : 'backbone.eventbinder',
            babysitter : [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/backbone.babysitter/0.1.6/backbone.babysitter.min'),
              'vendors/backbone.babysitter/lib/backbone.babysitter'
            ],
            bootstrap: [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.min'),
              changeLink('/vendors/bootswatch-dist/js/bootstrap.min')
            ],
            backbone_radio: [
              changeLink('//cdnjs.cloudflare.com/ajax/libs/backbone.radio/0.9.0/backbone.radio.min'),
              changeLink('/vendors/backbone.radio/build/backbone.radio.min')
            ],
            'marionette.radio': 'js/libs/marionette.radio'
        },
        shim : {
            handlebars: {
                exports: 'Handlebars'
            },
            jquery : {
                exports : 'jQuery'
            },
            underscore : {
                exports : '_'
            },
            backbone : {
                deps : ['jquery', 'underscore'],
                exports : 'Backbone'
            },
            wreqr: {
                deps : ['backbone'],
                exports: 'Backbone.Wreqr'
            },
            //eventbinder : {
            //    deps : ['backbone']
            //},
            babysitter : {
                deps: ['backbone']
            },
            marionette : {
                deps: ['wreqr', /*'eventbinder',*/ 'babysitter'],
                exports : 'Marionette'
            },
            bootstrap: {
                deps: ['jquery'],
                exports: 'Bootstrap'
            }
        },
        map: {
            //We map calls to marionette to use our own "augment" module
            //we also map backbone.wreqr calls to use the Radio module.
            '*': {
                'marionette': 'marionette.radio',
                'backbone.wreqr': 'backbone_radio'
            },
            //For our "augment" module, we want the real Marionette
            'marionette.radio' : {
                'marionette': 'marionette'
            }
        }
    });

// Loading dependences and module to execute Marionette App
    require( [
            "marionette",
            "handlebars",
            "bootstrap",

            'js/controllers/CollaboratorsController',
            'js/controllers/RepositoryController',
            'js/controllers/ForksController',
            'js/controllers/AuthorizeController',

            "js/views/ErrorView",

            'link!' + changeLink('/vendors/bootswatch-dist/css/bootstrap.min') + '.css',
            "link!/vendors/octicons/octicons/octicons.css",
        ],
        function (Marionette, Handlebars, Bootstrap,
          CollaboratorsController,
          RepositoryController,
          ForksController,
          AuthorizeController,
          ErrorView) {

            //render templates with Handlebars instead of Underscore
            Marionette.Renderer.render = function(template, data) {
                var renderer = Handlebars.compile(template);
                return renderer(data);
            };
            Handlebars.registerHelper('date', function(options) {
              return new Date(options.fn(this)).toString().replace(/\sGMT.+/, '')
            });

            var MyApp = new Marionette.Application();

            // Define regions
            MyApp.addRegions({
                errorRegion: '#error',
                authRegion: "#auth",
                repositoryRegion: "#repository",
                collaboratorsRegion: "#collaborators",
                forksRegion: '#forks',
            });

            var repositoryChannel = Marionette.Radio.channel('repository');
            var collaboratorsChannel = Marionette.Radio.channel('collaborators');
            var forksChannel = Marionette.Radio.channel('forks');
            var authChannel = Marionette.Radio.channel('auth');

            var authController = new AuthorizeController({channel: authChannel});
            var respositoryController = new RepositoryController({channel: repositoryChannel});
            var collaboratorsController = new CollaboratorsController({channel: collaboratorsChannel});
            var forksController = new ForksController({channel: forksChannel})

            var errorView = new ErrorView();

            // Initialize the app router if neccessary
            MyApp.addInitializer(function(options) {});

            MyApp.on("start", function(){

                // Listen *:error from controllers.
                errorView.listenTo(authController.channel, 'all', errorView.listener);
                errorView.listenTo(respositoryController.channel, 'all', errorView.listener);
                errorView.listenTo(collaboratorsController.channel, 'all', errorView.listener);
                errorView.listenTo(forksController.channel, 'all', errorView.listener);

                // Show errors block.
                MyApp.errorRegion.show(errorView);
                // Show authorization block.
                MyApp.authRegion.show(authController.view);
                MyApp.collaboratorsRegion.show(collaboratorsController.layout);
                MyApp.forksRegion.show(forksController.layout);

                // Wait until login.
                authController.channel.once('auth:login', function() {

                  MyApp.repositoryRegion.show(respositoryController.layout);

                  // On input submit.
                  respositoryController.channel.on('repository:change', function(data){

                    if (data.isValid) {

                      var matches = data.value.match(/github\.com\/([^/]+)\/([^/]+)\/?$/);
                      var owner = matches[1];
                      var repo = matches[2];

                      collaboratorsController.channel.command('collaborators:change', owner, repo);
                      forksController.channel.command('forks:change', owner, repo);

                    }
                  });
                });


            });

            MyApp.start({});
        });


}());
