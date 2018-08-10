//(function () {
//    debugger
//    'use strict';
//    angular
//        .module('system.module', [])
//        .controller('UserInfoController', UserInfoController)
//        .factory('UserInfoService', UserInfoService);
//    //factory注入$http的服务
//    UserInfoService.$inject = ['$http'];
//    //factory 函数
//    function UserInfoService($http) {
//        debugger
//        var factory = {};
//        factory.GetList = function (page, limit, swhere, sort, func) {
//            $http.get('/api/BasePosition/GetPositionList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null).success(func);
//            debugger
//        }
//        return factory;
//    }
//    //controller 注入服务
//    UserInfoController.$inject = ['$scope', 'Notify', '$timeout', 'UserInfoService', '$http', '$uibModal'];
//    //controller的函数
//    function UserInfoController($scope, Notify, $timeout, UserInfoService, $http, $uibModal) {
//        $scope.open = function () {
//            var modalInstance = ToolsModal($uibModal, '/myModalContent.html', 'lg', function () {
//            }).result.then(function (result) {
//                console.log(result); //result关闭是回传的值   
//            }, function (reason) {
//                console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel    

//            });
//        }
//    }
//})();
