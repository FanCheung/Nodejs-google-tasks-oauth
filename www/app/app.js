'use strict';

// Declare app level module which depends on views, and components
angular.module('ToDo', [
    'ngRoute', 'ngCookies',
    'ToDo.auth',
    'ToDo.tasks',
    'ToDo.error',
    'ToDo.tasksService'
])
    .constant("CONFIG", {
        domain: "http://localhost",
        port: "8000",
        url: "http://localhost:8000"
    })

 /* Register the interceptor as a service
 *  it catches all the error and direct to error page or auth page
 * */
    .factory('myHttpInterceptor', ['$rootScope','$q','$cookies','$location',function ($rootScope,$q,$cookies,$location) {
        return {
            //if userId cookie not found redirect to #/auth for authentication
            'request': function (config) {
                return config;
            },

            'requestError': function (rejection) {
                console.log('request Error');
                return $q.reject(rejection);
            },
            'response': function (response) {
                return response;
            },

            'responseError': function (rejection) {
                //if unauthorized
                //@todo consider adding a service for authentication to store user details

                if(rejection.status==403){
                    $location.path('/auth');
                    //important! need to reject or data will be undefined
                    return $q.reject(rejection);
                }
                else
                    //consider to store error in utility service instead of $rootScope
                { $rootScope.appError=rejection;
                    $location.path('/error');}
            }
        };
    }])
    //redirect to /tasks if not authenticate it will go back to /auth page
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/error'});
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }])
    .run(['$cookies', '$location', '$http', 'CONFIG', function ($cookies, $location, $http, CONFIG) {


    }]);
