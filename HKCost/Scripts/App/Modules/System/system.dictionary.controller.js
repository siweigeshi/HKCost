(function () {
    'use strict';
    angular
        .module('system.dictionary', [])
        .controller('DictionaryController', DictionaryController)
        .factory('DictionaryService', DictionaryService);
    //factory注入$http的服务
    DictionaryService.$inject = ['$http'];
    //factory 函数
    function DictionaryService($http) {
        var factory = {};
        factory.GetList = function (page, limit, swhere, sort) {
           return $http.get('/api/DictionaryManager/GetModelsList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort + '&type=', null);
        }
        return factory;
    }
    //controller 注入服务
    DictionaryController.$inject = ['$scope', 'Notify', '$timeout', 'DictionaryService', '$http', '$uibModal', 'ngTableParams', '$element', 'toaster', 'SweetAlert'];
    //controller的函数
    function DictionaryController($scope, Notify, $timeout, DictionaryService, $http, $uibModal, ngTableParams, $element, toaster, SweetAlert) {
        $scope.btnList = Tools.Data.GetLineButton('system.dictionary');
        $scope.form = {};
        $scope.form.DropList=[];
        $scope.ddlAdd = {};
        $scope.myApply = function (expr, locals, event) {
            return $scope.$eval(expr + '(' + event + ')', locals, event);
        }
        $scope.Add = function () {
            var modalInstance = ToolsModal($uibModal, '/myModalContent.html', 'sm', function ($uibModalInstance) {
                $scope.form.DropList.push(eval('(' + JSON.stringify($scope.ddlAdd) + ')'));
                $uibModalInstance.close('closed');
            }).result.then(function (result) {
                
            }, function (reason) {
                $scope.ddlAdd = {};
            });
        }
        $scope.Del = function () {
            if ($scope.form.ddlValue == '' || $scope.form.ddlValue == null) {
                toaster.pop('warning', "", '此项不能删除');
                return;
            }
            Tools.Angular.Confirm(SweetAlert, function () {
                $.each($scope.form.DropList, function (index, row) {
                    $scope.form.DropList.splice(index, 1);
                    return false;
                });
                $scope.form.ddlValue = '';
            }, '删除成功', '删除成功',null,'是否要删除此下拉框选中的值');
           
        }
        var tableList = [];
        //查看行操作按钮
        $scope.onClickOperationLook = function (row) {
            $scope.form = eval('(' + JSON.stringify(tableList[row]) + ')');
        }
        //构造搜索条件的参数
        $scope.swhere = '';
        $scope.searchfield = 'TITLE';
        //构造一个ngtable
        $scope.parentTableParams = new ngTableParams({
            page: 1,    // 当前页数 
            count: 10,    // 每页显示的条数
            sorting: { FILENAME: "asc" }//排序
        }, {
            counts: [10, 15, 20, 50, 100],
            getData: function ($defer, params) {
                $scope.loading = true;
                var sortList = [];
                for (var prop in params.sorting()) {
                    var model = {};
                    model.property = prop;
                    model.direction = params.sorting()[prop];
                    sortList.push(model);
                }
                //抛给外部controller的获取数据的方法
                DictionaryService.GetList(params.page(), params.count(), $scope.swhere, JSON.stringify(sortList)).success(function (data) {
                    params.total(data.total);
                    tableList = data.dictionarys;
                    angular.forEach(tableList, function (data) {
                        data.DropList = Tools.Data.ChageKeyValue(data.CONTENT);
                    });
                    $defer.resolve(data.dictionarys);
                    $scope.loading = false;
                });
            }
        });
        $scope.Search = function () {
            $scope.swhere = '';
            $('#search').button('loading');
            var judge = Tools.Data.FilterSqlStr($scope.searchValue);
            if (judge!='') {
                toaster.pop('warning', "", '搜索框中包含了敏感字符' + judge + ',请重新输入！');
                $('#search').button('reset');
                return;
            }
            if ($scope.searchValue != null && $scope.searchValue != '' && $scope.searchValue != undefined) {
                $scope.swhere += $scope.searchfield + '|string|' + $scope.searchValue + ',';
            }
            if ($scope.swhere.length > 0)
                $scope.swhere = $scope.swhere.substr(0, $scope.swhere.length - 1);
            $scope.parentTableParams.reload();
            $('#search').button('reset');
        }
        /*
        * 以下是复选框的选中，取消，全选的事件
        */
        $scope.checkboxes = {
            checked: false,
            items: {}
        };

        // watch for check all checkbox
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach(tableList, function (item) {
                $scope.checkboxes.items[item.OID] = value;
            });
        });

        // watch for data checkboxes
        $scope.$watch(function () {
            return $scope.checkboxes.items;
        }, function (values) {
            var checked = 0, unchecked = 0,
                total = tableList.length;
            angular.forEach(tableList, function (item) {
                checked += ($scope.checkboxes.items[item.OID]) || 0;
                unchecked += (!$scope.checkboxes.items[item.OID]) || 0;
            });
            if (((unchecked == 0) || (checked == 0)) && total > 0) {
                $scope.checkboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
        }, true);
        $scope.panel = 'tablePanel';
        $scope.$watch(function () {
            return $scope.loading;
        }, function () {
            if ($scope.loading) {
                $('#' + $scope.panel).addClass('whirl traditional');
            } else {
                $('#' + $scope.panel).removeClass('whirl traditional');
            }
            // start showing the spinner
            //panel.addClass('whirl ' + spinner);

            // Emit event when refresh clicked
            //$scope.$emit(refreshEvent, panel.attr('id'));

        });
    }
})();
