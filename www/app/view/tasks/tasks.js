'use strict';
angular.module('ToDo.tasks', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: '/view/tasks/tasks.html',
            controller: 'TasksCtrl'
        });
    }])
    .controller('TasksCtrl', ['$cookies','$location','$q', 'TasksService', '$http', '$scope', 'CONFIG',
        function ($cookies,$location,$q, TasksService, $http, $scope, CONFIG) {
        //if (!$cookies.userId)
        //    $location.path('/auth');

        //initialize scope objects
        $scope.addPanel = {show: false};
        $scope.newTask = {};
        //Retrive all tasks from tasksService
        TasksService.getAll().then(function (res) {

            $scope.tasks = res;
        });

        //Task entry show toggle
        $scope.toggleTask = function (task) {
            task.show = !task.show;
        };

        //Toggle display of the new task form
        $scope.toggleAdd = function (addPanel) {
            addPanel.show = !addPanel.show;
        };

        /* Call task service to add task, pass in $scope.newTask
         then reload all tasks
         */
        $scope.addTask = function (form) {
            //only submit when the form is valide
            if (form.form.$valid)
                TasksService.add($scope.newTask).then(function (res) {
                    console.log('Task added:', res);
                    TasksService.getAll().then(function (res) {
                        $scope.tasks = res;
                    });
                })
        };

        /* Call task service to delete task, pass in taskId */
        $scope.deleteTask = function (taskId) {
            //@todo handle taskId error
            if (taskId)
                TasksService.remove(taskId).then(function (res) {
                    console.log('Task deleted:', res)
                    TasksService.getAll().then(function (res) {
                        $scope.tasks = res;
                    });
                });

        };
            console.log('taksCtrl')

    }]);