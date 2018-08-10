(function () {
    'use strict';
    angular
        .module('system.orginfo', [])
        .controller('OrgInfoController', OrgInfoController)
        .factory('OrgInfoService', OrgInfoService);
    //factory注入$http的服务
    OrgInfoService.$inject = ['$http'];
    //factory 函数
    function OrgInfoService($http) {
        var factory = {};
        factory.GetList = function (page, limit, swhere, sort) {
           return $http.get('/api/BasePosition/GetPositionList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort + '&type=', null);
        }
        return factory;
    }
    //controller 注入服务
    OrgInfoController.$inject = ['$scope', 'Notify', 'OrgInfoService', '$http', '$uibModal'];
    //controller的函数
    function OrgInfoController($scope, Notify, OrgInfoService, $http, $uibModal) {
        //$scope.open = function () {
        //    var modalInstance = ToolsModal($uibModal, '/myModalContent.html', 'lg', function () {
        //    }).result.then(function (result) {
        //        console.log(result); //result关闭是回传的值   
        //    }, function (reason) {
        //        console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel    

        //    });
        //}

    }
})();
