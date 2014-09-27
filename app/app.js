var app = angular.module("markdown-notes", ['ngCookies', 'ngRoute', 'ngAnimate', 'ngMaterial', 'ngSanitize', 'btford.markdown', 'LocalStorageModule']);

app.config(function ($logProvider) {
    "use strict";
    //Enables Debug when ?debug=1&password=*password*
    var password = "f48b9001e3972038d687a3dac8ebe8f9",
        querystring = (window.location.search ? window.location.search.substring(1) :
                window.location.hash.indexOf('?') !== -1 ? window.location.hash.split('?')[1] : ""),
        params = {};
    angular.forEach(querystring.split('&'), function (pair) {
        params[pair.split('=')[0]] = pair.split('=')[1];
    });
    $logProvider.debugEnabled(false);
    if (params.hasOwnProperty('debug') && params.hasOwnProperty('password')) {
        if (params.debug && md5(params.password) === password) {
            $logProvider.debugEnabled(true);
            console.info("Logging Enabled");
        }
    }
});

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider.when('/',
        {
            controller: 'HomeController',
            templateUrl: 'app/views/home.html',
            resolve: {
                note: function () {
                    return false;
                }
            }
        })
        .when('/new/',
        {
            controller: 'NotesController',
            templateUrl: 'app/views/notes.html',
            resolve: {
                note: function () {
                    return false;
                }
            }
        })
        .when('/:note',
        {
            controller: 'HomeController',
            templateUrl: 'app/views/home.html',
            resolve: {
                note: function ($route) {
                    return $route.current.params.note;
                }
            }
        })
        .when('/:note/edit',
        {
            controller: 'NotesController',
            templateUrl: 'app/views/notes.html',
            resolve: {
                note: function ($route) {
                    return $route.current.params.note;
                }
            }
        })
        .otherwise({redirectTo: '/'});
});