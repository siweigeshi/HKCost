(function () {
    'use strict';
    angular.module('Quote', []).controller('QuoteController', QuoteController).factory('QuoteService', QuoteService);//angular.module()方法来声明模块，这个方法能够接受两个参数，第一个是模块的名称，第二个是依赖列表，也就是可以被注入到模块中的对象列表。controller让angular自动去寻找程序的入口ng-app，然后自动解析依赖注入，并且声成实例。最后通过工厂模式创建自定义服务
    QuoteService.$inject = ['$http'];//依赖注入http服务
    function QuoteService($http) {
        var factory = {};
        ////获取报价表数据
        //factory.GetQuoteList = function (page, limit, swhere, sort) {
        //    return $http.get('/api/Quote/GetQuoteList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null)
        //};
        //通过标题名称和报价单位来获取此用户的当前条的报价记录
        factory.GetQuoteListswhere = function (InquiryTitles) {
            return $http.get('/api/Quote/GetQuoteListswhere?ct=json&swhere=' + InquiryTitles, null)
        };
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };
        //获取询价表数据
        factory.GetInquiryList = function (page, limit, swhere, sort) {
            return $http.get('/api/Inquiry/GetInquiryList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null)
        };
        //保存报价表信息
        factory.PostQuoteSave = function (Quotes) {
            return $http.post('/api/Quote/PostQuoteSave?ct=json', Quotes)
        };

        return factory;
    }
    QuoteController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'QuoteService'];
    function QuoteController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, QuoteService) {
        //刷新方法
        function loadTable() {
            $scope.parentTableParams.reload();
        }
        var user;//当前用户
        //获取当前用户
        QuoteService.GetUserName().success(function (dataName) {
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
        $scope.status = [];//询价状态
        $scope.isQuote = [];//是否可查看 我要报价按钮
        $scope.isBtn = [];//存放“已报价”按钮
        $scope.isQuoteBtn = true;//存放“我要报价”按钮是否可被查看
        //获取询价表数据绑定到表格
        $scope.TableBind = function ($defer, params, sortList, func) {
            QuoteService.GetInquiryList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {
                params.total(data.total);
                tableList = data.inquiryList;
                $defer.resolve(data.inquiryList);
                func(data.inquiryList);
                for (var i = 0; i < data.inquiryList.length; i++) {//从询价表中获取数据，当每一条状态不为2的时候都显示为可以报价，还需要从报价表中找到本条数据是否已报价状态。 需要通过标题和报价人寻找报价单中状态等于1的数据，那这条数据即为当前报价人在此询价标题中唯一的一条记录
                    $scope.status[i] = "询价中";//状态显示询价中
                    $scope.isQuote[i] = true;//显示 我要报价按钮
                    var isQuoteIndex = i;
                    Tools.Method.GetAjaxEncap('/api/Quote/GetQuoteListswhere?ct=json&swhere=' + data.inquiryList[i].InquiryTitle, 'GET', null, false, function (data) {
                    //QuoteService.GetQuoteListswhere(data.inquiryList[i].InquiryTitle).success(function (data) {//获取报价单单条数据信息
                        if (data.length != 0 && data[0].QuoteState == 1) {
                            $scope.isQuote[isQuoteIndex] = false;//“我要报价”按钮隐藏
                            $scope.isBtn[isQuoteIndex] = true;//“已报价” 按钮显示
                        }
                    })
                    if (data.inquiryList[i].BuyState == 2) {//如果询价单状态为1
                        $scope.status[i] = "询价结束";
                        $scope.isQuote[i] = false;//隐藏我要报价按钮
                    }
                    // GetQuoteSheet();//调用报价表来控制显示的按钮
                }




            })
        }
        ////获取报价表中数据
        //function GetQuoteSheet() {
        //    QuoteService.GetQuoteListswhere(user).success(function (data) {
        //        for (var i = 0; i < data.length; i++) {
        //            if (data[i].QuoteState == 1) {
        //                $scope.isQuote[i] = false;//“我要报价”按钮隐藏
        //                $scope.isBtn[i] = true;//“已报价” 按钮显示
        //            }
        //        }
        //    })
        //}
        //查看询价单模态框
        $scope.lookInquirySheet = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: 'InquirySheetModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.curSheet = tableList[index];//把当前数组中数据绑定到前台
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cannel');
                    }
                },
                size: 'lg'

            })
        };

        ////验证手机号
        //$scope.TelError = false;
        //var RegTel = function (tel) {
        //    var regTel = /(^[0-9]{3,4}\-[0-9]{8}$)|(^[0-9]{8}$)|(^[0-9]{3,4}[0-9]{8}$)|(^0{0,1}13[0-9]{9}$)/;
        //    if (!regTel.test(tel)) {
        //        $scope.TelError = true;
        //        return $scope.TelError;
        //    }

        //}

        //报价模态框 把本条报价状态改为1 证明已经报过价了
        $scope.MyQuote = function (index) {
            var MyQuoteModal = $uibModal.open({
                templateUrl: 'QuoteModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.curSheet = tableList[index];//拿到当前询价单数据
                    $scope.QuoteSheet = {};
                    //验证手机号
                    $scope.RegTel = function (tel) {
                        var regTel = /(^[0-9]{3,4}\-[0-9]{8}$)|(^[0-9]{8}$)|(^[0-9]{3,4}[0-9]{8}$)|(^0{0,1}13[0-9]{9}$)/;
                        if (!regTel.test(tel)) {
                            $scope.TelError = true;
                            return $scope.TelError;
                        }
                        else {
                            $scope.TelError = false;
                            return $scope.TelError;
                        }
                    }
                    $scope.submiRegTelt = function (index) {
                        var model = {};
                        model = $scope.QuoteSheet;//存放报价单信息
                        model.QuotationCompany = user;
                        model.InquiryTitle = $scope.curSheet.InquiryTitle;
                        model.BuyCompanyName = $scope.curSheet.BuyCompanyName;
                        model.QuoteState = 1;//报价状态改为1

                        //model.Inquiries = [];
                        //$scope.InquiryOID = {};
                        //$scope.InquiryOID.OID = $scope.curSheet.OID;
                        //model.Inquiries.unshift($scope.InquiryOID);

                        QuoteService.PostQuoteSave(model).success(function (data) {
                            SweetAlert.swal("报价成功", "你已成功报价", "success");
                            $uibModalInstance.close('closed');
                            loadTable();

                        });

                    }
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cannel');
                    }
                },
                size: 'lg'
            })
        }
    }
})()
// 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
//作用：可以用它创建命名空间，只要把自己所有的代码都写在这个特殊的函数包装内，那么外部就不能访问，除非你允许(变量前加上window，这样该函数或变量就成为全局)。各JavaScript库的代码也基本是这种组织形式。
//总结一下，执行函数的作用主要为 匿名 和 自动执行,代码在被解释时就已经在运行了。 