(function () {
    'use strict';
   
    angular.module('QuoteManage', []).controller('QuoteManageController', QuoteManageController).factory('QuoteManageService', QuoteManageService);

    QuoteManageService.$inject = ['$http'];//创建工厂类注入注册的服务，依赖注入http服务
    function QuoteManageService($http) {
        var factory = {};
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };
        //获取数据
        factory.GetQuoteManageList = function (page, limit, swhere, sort) {
            return $http.get('/api/QuoteManage/GetQuoteManageList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null)
        };
        //通过标题来寻找当前询价单
        factory.GetQuoteManageListswhere = function (swhere) {
            return $http.get('/api/QuoteManage/GetQuoteManageListswhere?ct=json&swhere=' + swhere, null)
        };
        //删除数据
        factory.PostQuoteDelete = function (OIDs) {
            return $http.post('/api/QuoteManage/PostQuoteDelete?ct=json', { PostData: OIDs });
        };

        //增加或修改数据
        factory.PostQuoteManageSave = function (Quotes) {
            return $http.post('/api/Quote/PostQuoteSave?ct=json', Quotes);
        };
        return factory;
    }
    //$inject生成一个依赖数组
    //$uibModal模态框的注入
    QuoteManageController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'QuoteManageService'];
    function QuoteManageController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, QuoteManageService) {
        //js开始

        $scope.status = [];//存放询价单状态
        $scope.isEdit = [];//是否可修改
        $scope.isDelete = [];//是否可修改
     
        var tableList = [];//定义存放数据的数组
        var user;//定义当前用户

        function loadTable() {
            $scope.parentTableParams.reload();
        }
        //获取当前用户
        QuoteManageService.GetUserName().success(function (dataName) {
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
        //表格绑定方法
        $scope.TableBind = function ($defer, params, sortList, func) {
            QuoteManageService.GetQuoteManageList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {//通过工厂Service调用http方法，指定页数，行数，搜索条件，最后通过回调函数返回的data来绑定和刷新数据
                params.total(data.total);
                tableList = data.QuoteManageList;
                $defer.resolve(data.QuoteManageList);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
                func(data.QuoteManageList);//数据刷新
                for (var i = 0; i < data.QuoteManageList.length; i++) {
                 
                    if (data.QuoteManageList[i].QuoteState == 3) {
                        $scope.status[i] = "报价失败";
                        $scope.isEdit[i] = false;
                        $scope.isDelete[i] = true;
                    }
                    else if (data.QuoteManageList[i].QuoteState == 2) {
                        $scope.status[i] = "报价成功";
                        $scope.isEdit[i] = false;
                        $scope.isDelete[i] = true;
                    }
                    else {
                        $scope.status[i] = "已报价";
                        $scope.isEdit[i] = true;
                        $scope.isDelete[i] = false;
                    }
                }
            });
        }
        //查看方法
        $scope.lookQuoteSheet = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: 'QuoteSheetModal',
                controller: function ($scope, $uibModalInstance) {
                    $scope.curSheet = tableList[index];

                    QuoteManageService.GetQuoteManageListswhere($scope.curSheet.InquiryTitle).success(function (data) {
                        $scope.QuoSheet = data[0];
                    })
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                size: 'lg'
            });
        }

        //删除方法
        $scope.delete = function (OID) {
                SweetAlert.swal({
                    title: '确定删除吗？',
                    text: '删除后您将不能恢复选中的报价单',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnConfirm: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        QuoteManageService.PostQuoteDelete(OID).success(function () {
                            SweetAlert.swal('删除成功!', '选中的报价单已被删除', 'success');
                            loadTable();
                        });
                    }
                });
        
        }

        //修改
        $scope.Edit = function (index) {
            var saveModal = $uibModal.open({
                templateUrl: 'editModal',
                controller: function ($scope, $uibModalInstance) {
                    //$scope.editSheet = tableList[index];
                    $scope.editSheet = eval('(' + JSON.stringify(tableList[index]) + ')');
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
                    $scope.submit = function () {
                        QuoteManageService.PostQuoteManageSave($scope.editSheet).success(function (data) {

                            SweetAlert.swal('修改成功!', '选中的报价单已修改成功', 'success');
                            loadTable();
                           
                        })
                       $uibModalInstance.dismiss('cancel');
                    }
                    $scope.cancel = function () {
                        
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            })
        }

        
    }
})();