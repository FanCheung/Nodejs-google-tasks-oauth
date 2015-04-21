'use strict';
angular.module('ToDo.error', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/error', {
            templateUrl: '/view/error/error.html',
            controller: 'ErrorCtrl'
        });
    }])
    .controller('ErrorCtrl', ['$scope', function ($scope) {
        console.log('ErrorCtrl',$scope.appError);
    }]);