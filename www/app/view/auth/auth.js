'use strict';
angular.module('ToDo.auth', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/auth', {
    templateUrl: '/view/auth/auth.html',
    controller: 'AuthCtrl'
  });
}])

.controller('AuthCtrl',['$cookies','$location','$http','CONFIG','$scope',function($cookies,$location,$http,CONFIG,$scope) {
        //init $scope object
        $scope.param={
        };
        //get the consent from server
        $http.get(CONFIG.url+'/auth/consent-url').then(function(res){
            $scope.param.consentUrl=CONFIG.consentUrl=res.data.consentUrl;
            console.log ('consent',res);
        }).catch(function(error){
            console.log('error');
        });

}]);