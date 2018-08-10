

(function () {
    'use strict';
    angular
       .module('HomePage', [])
       .controller('HomePageController', HomePageController)
       .factory('HomePageService', HomePageService);

    //factory注入$http的服务
    HomePageService.$inject = ['$http'];
    //factory 函数
    function HomePageService($http) {
        var factory = {};
        factory.GetTaskListswhere = function (swhere) {
            return $http.get('/api/Task/GetTaskList?ct=json&swhere=' + swhere, null);
        }
        return factory;
    }

    //controller 注入服务
    HomePageController.$inject = ['$scope', 'Notify', '$filter', 'ngTableParams', '$resource', '$timeout', "$element", '$http', 'ngDialog', 'HomePageService'];
    //controller的函数
    function HomePageController($scope, Notify, $filter, ngTableParams, $resource, $timeout, $element, $http, ngDialog, HomePageService) {
        angular.element("#mydatepicker").dcalendarpicker();
        angular.element('#mydatepicker2').dcalendarpicker({
            format: 'yyyy-mm-dd'
        });
        angular.element('#mycalendar').dcalendar();

        $scope.TaskList = [];
        var handleList = function (data) {
            console.log(data);//将内容输出到控制台上
            $scope.TaskList = data.TaskList;
        }
        var where = "STATEVALUE|int|1|=";
        HomePageService.GetTaskListswhere(where).success(handleList);
    }
})();