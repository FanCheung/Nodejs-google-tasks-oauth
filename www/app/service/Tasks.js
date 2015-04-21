/**
 * Created by varomatic on 18/4/15.
 */
angular.module('ToDo.tasksService', [])
    .factory('TasksService', ['CONFIG', '$http', '$q',function (CONFIG, $http, $q) {
        // factory function body that constructs shinyNewServiceInstance
        return {

            /**
             * TasksService.getAll()
             * Retrieve all the future tasks
             * @returns {promise}  resolve to tasks array
             */
            getAll: function () {
                return $q(function (resolve, reject) {
                    $http.get(CONFIG.url + '/tasks')
                        .success(function (res) {
                            resolve(res);
                        })
                        .error(function (error) {
                            reject(error);
                        });
                });
            },
            /**
             *
             * @param taskId
             * @returns {promise} resolve to task object thats been deleted
             */
            remove: function (taskId) {
                return $q(function (resolve, reject) {
                    $http.delete(CONFIG.url + '/tasks/task/' + taskId)
                        .then(function (res) {
                            resolve(res.data);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            },

            /**
             * TasksService.add()
             * @param newTask
             * @returns {promise} resolve to task object from Google api
             */
            add: function (newTask) {
                return $q(function (resolve, reject) {
                    $http.post(CONFIG.url + '/tasks', newTask)
                        .success(function (res) {
                            resolve(res.data);
                        })
                        .error(function (err) {
                            reject(error);
                        });
                });
            }
        }
    }]);
