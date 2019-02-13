(function () {
    'use strict';
    angular.module('ResultBulletin', []).controller('ResultBulletinController', ResultBulletinController).factory('ResultBulletinService', ResultBulletinService);

    ResultBulletinService.$inject = ['$http'];
    function ResultBulletinService($http) {
        var factory = {};
        //找到报价表中 当供应商名字有我的报价这样就能查出所有我报过价的单子，然后看状态，如果我的状态为3，有其中一个状态为2，那证明是别人中标，则把这条数据反馈到前台，如果我的状态为2，则证明我是这条数据的中标人。
            //另外的情况 当报价表中查看我的当条数据为2的时候，就返回当条数据，如果为3，则找到当前数据的标题并在成交库中找到当前条数据的成交信息。
        //最终展示的为 标题 采购人 供应商 金额 联系人 开始时间和结束时间 和报价时间

            //如果成交记录表和报价表为一对多关系，应该为一个交易订单对应多个用户信息，这样就可以找到属于我这个用户的成交订单都有哪几个。

        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };
        //获取报价单的所有数据
        factory.GetResultBulletinList = function (page, limit, swhere, sort) {
            return $http.get('/api/Quote/GetQuoteResultList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null);
        }




        return factory;
    }
    ResultBulletinController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'ResultBulletinService'];
    function ResultBulletinController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, ResultBulletinService) {
        function loadTable() {
            $scope.parentTableParams.reload();//刷新表格
        }
        var tableList = [];//定义存放数据的数组
        var user;//当前用户
        //获取当前用户
        ResultBulletinService.GetUserName().success(function (dataName) {
            user = dataName;
        })
        $scope.username = user;
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
        //表格绑定方法
        $scope.TableBind = function ($defer, params, sortList, func) {
            ResultBulletinService.GetResultBulletinList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {//通过工厂Service调用http方法，指定页数，行数，搜索条件，最后通过回调函数返回的data来绑定和刷新数据
                params.total(data.total);
                tableList = data.QuoteResultList;
                $defer.resolve(data.QuoteResultList);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
                func(data.QuoteResultList);//数据刷新
                if (data.QuoteResultList != undefined) {
                    for (var i = 0; i < data.QuoteResultList.length; i++) {
                        if (data.QuoteResultList[i].QuotationCompany == user) {
                        }
                    }
                }
            });
        }

        //var sidebar = document.getElementsById('CompanyClass');
        //if (sidebar.textContent == user)
        //    sidebar.style.color = 'red';
        //angular.element(document).ready(function () {
        //    var elm = document.getElementById('CompanyClass');
        //    if (elm.textContent == user)
        //        elm.style.color = 'red';
        //})
       

 
        //查看模态框
        $scope.lookResultBulletin = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: 'ResultBulletinModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.Result = tableList[index];
                    var elm = document.getElementById('CompanyClass');
                    elm.style.color = 'red';
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                size: 'lg'
            })
        };


    }


})();