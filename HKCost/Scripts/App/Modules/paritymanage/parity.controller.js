(function () {
    'use strict';
    angular.module('Parity', []).controller('ParityController', ParityController).factory('ParityService', ParityService);//angular.module()方法来声明模块，这个方法能够接受两个参数，第一个是模块的名称，第二个是依赖列表，也就是可以被注入到模块中的对象列表。controller让angular自动去寻找程序的入口ng-app，然后自动解析依赖注入，并且声成实例。最后通过工厂模式创建自定义服务
    ParityService.$inject = ['$http'];//依赖注入http服务
    function ParityService($http) {
        var factory = {};
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };
        //获取采购人是我的报价单
        factory.GetQuoteList = function (page, limit, swhere, sort) {
            return $http.get('/api/Parity/GetQuoteList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null);
        }

        //修改报价表中的状态
        factory.PostQuoteStatusSave = function (quotes) {
            return $http.post('/api/Parity/PostQuoteStatusSave?ct=json', quotes);
        };

        //通过标题来寻找当前询价单
        factory.GetQuoteManageListswhere = function (swhere) {
            return $http.get('/api/QuoteManage/GetQuoteManageListswhere?ct=json&swhere=' + swhere, null)
        };
        //修改询价表中的状态
        factory.PostInquiryStatusSave = function (inquirys) {
            return $http.post('/api/Inquiry/PostInquirySave?ct=json', inquirys);
        }

        //保存到交易记录表中
        factory.PostDealOrderSave = function (dealorderList) {
            return $http.post('/api/DealOrder/PostDealOrderSave?ct=json', dealorderList);
        }

        //通过标题找到所有的报价记录（先不用）
        factory.GetQuoteResultList = function (swhere) {
            return $http.get('/api/Quote/GetQuoteResultList?ct=json&swhere=' + swhere, null)
        };

        return factory;
    }
    ParityController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'ParityService'];
    function ParityController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, ParityService) {
        //刷新方法
        function loadTable() {
            $scope.parentTableParams.reload();
        }
        var user;//当前用户
        //获取当前用户
        ParityService.GetUserName().success(function (dataName) {
            user = dataName;
        })


        $scope.searchField = "InquiryTitle";//默认搜索栏
        $scope.reset = function () {
            $scope.searchField = 'InquiryTitle';
            $scope.searchValue = '';
        }
        $scope.search = function () {
            var where = '';
            if ($scope.searchField != null && $scope.searchField != '' && $scope.searchField != undefined) {
                where += $scope.searchField + '|string|' + $scope.searchValue + ',';
            }
            if (where.length > 0) {
                where = where.substr(0, where.length - 1);
            }
            $scope.extraParams.swhere = where;
            loadTable();
            $scope.reset();
        }
        //搜索条件
        $scope.extraParams = {
            swhere: ''
        };
        var tableList = [];//存放询价表数据


        //获取报价表数据绑定到表格
        $scope.TableBind = function ($defer, params, sortList, func) {
            ParityService.GetQuoteList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {
                params.total(data.total);
                tableList = data.QuoteSheetList;
                $defer.resolve(data.QuoteSheetList);
                func(data.QuoteSheetList);
            })
        }

        //查看报价单模态框
        $scope.lookInquirySheet = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: 'QuoteSheetModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.QuoSheet = tableList[index];//把当前数组中数据绑定到前台
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cannel');
                    }
                },
                size: 'lg'
            })
        };

        //选择采购某家东西/修改报价表和询价表的数据---当用户点击选择此家时，需要将这个标题的所有报价表状态改变 ，方便选择供应商后的页面显示问题。【报价单全部修改为3,报价成功的改为2】
        $scope.Choice = function (index) {
            var QuoSheet = {};
            QuoSheet = tableList[index];//把当前数组中数据绑定到前台
            QuoSheet.QuoteState = 2;//修改本条数据报价单中的状态改为2

            ParityService.PostQuoteStatusSave(QuoSheet).success(function () {//保存选中的报价单中 的数据
                ParityService.GetQuoteManageListswhere(tableList[index].InquiryTitle).success(function (data) {//通过标题来寻找当前询价单的数据
                    $scope.InquirysSheet = data[0];
                    $scope.InquirysSheet.BuyState = 2;//修改询价单的状态
                    ParityService.PostInquiryStatusSave($scope.InquirysSheet);//保存修改过的询价表中的数据

                    var Order = {};
                    Order.InquiryTitle = QuoSheet.InquiryTitle;
                    Order.BuyCompanyName = QuoSheet.BuyCompanyName;
                    Order.QuotationCompany = QuoSheet.QuotationCompany;
                    Order.StartTime = $scope.InquirysSheet.StartTime;
                    Order.EndTime = $scope.InquirysSheet.EndTime;
                    Order.QuotedPrice = QuoSheet.QuotedPrice;
                    Order.GoodsName = $scope.InquirysSheet.GoodsName;
                    Order.Contacts = QuoSheet.Contacts;
                    Order.Tel = QuoSheet.Tel;

                    //通过标题获取所有报价信息，把报价信息的OID存入关联表
                    ////var userLists = [];
                    //Order.Users = [];
                    ////userLists = ParityService.GetQuoteResultList(QuoSheet.InquiryTitle);
                    //Tools.Method.GetAjaxEncap('/api/Quote/GetQuoteResultList?ct=json&swhere='+ QuoSheet.InquiryTitle, 'GET', null, false, function (datatitle) {
                    //    //userLists = data;
                    //    for (var i = 0; i < datatitle.length; i++) {
                    //        $scope.userListname = {};
                    //        $scope.userListname.OID = datatitle[i].OID;
                    //        Order.Users.unshift($scope.userListname);
                    //    }
                    //})
                    ParityService.PostDealOrderSave(Order);//增加交易单记录

                })
                SweetAlert.swal('选择成功!', '选中的询价报价单状态已更改', 'success');
                loadTable();
            })
        }
    }
})()
// 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
//作用：可以用它创建命名空间，只要把自己所有的代码都写在这个特殊的函数包装内，那么外部就不能访问，除非你允许(变量前加上window，这样该函数或变量就成为全局)。各JavaScript库的代码也基本是这种组织形式。
//总结一下，执行函数的作用主要为 匿名 和 自动执行,代码在被解释时就已经在运行了。 