(function () {
    'use strict';
    angular.module('DealOrder', []).controller('DealOrderController', DealOrderController).factory('DealOrderService', DealOrderService);
    DealOrderService.$inject = ['$http'];
    function DealOrderService($http) {
        var factory = {};
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        }
        //获取成交订单数据
        factory.GetDealOrderList = function (page, limit, swhere, sort) {
            return $http.get('/api/DealOrder/GetDealOrderList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null);
        }


        return factory;
    }

    DealOrderController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'DealOrderService'];
    function DealOrderController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, DealOrderService) {
        //刷新
        function loadTable() {
            $scope.parentTableParams.reload();
        }
    
        var user;    //获取当前用户
        var tableList = [];//存放成交表信息
        DealOrderService.GetUserName().success(function (dataName) {
            user = dataName;
        })

        //重置按钮
        $scope.reset = function () {
            $scope.searchField = 'InquiryTitle';
            $scope.searchValue = '';
        }
        //构造搜索条件
        $scope.extraParams = {
            swhere: '',
        };
        //默认搜索关键字
        $scope.searchField = "InquiryTitle";
        //构造搜索条件
        $scope.search = function () {
            var where = '';
            if ($scope.searchField != null && $scope.searchValue != '' && $scope.searchValue != undefined) {
                where += $scope.searchField + '|string|' + $scope.searchValue + ',';
            }
            if (where.length > 0) {
                where = where.substr(0, where.length - 1);//substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
            }
            $scope.extraParams.swhere = where;
            $scope.parentTableParams.reload();//reload() 方法用于重新加载当前文档。
            $scope.reset(); //reset() 方法可把表单中的元素重置为它们的默认值。
        }

    
        //获取数据
        $scope.TableBind = function ($defer, params, sortList, func) {
            DealOrderService.GetDealOrderList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {
                params.total(data.total);
                tableList = data.DealOrderList;
                $defer.resolve(data.DealOrderList);
                func(data.DealOrderList);
            })
        }
        //查看报价单模态框
        $scope.lookDealOrderSheet = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: 'DealOrderSheetModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.DealOrder = tableList[index];//把当前数组中数据绑定到前台
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                size: 'lg'
            })
        };


    }
})();