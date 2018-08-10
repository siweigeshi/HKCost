(function () {
    'use strict';
    angular
        .module('base.code', [])
        .controller('CodePositionController', CodePositionController)
        .factory('CodePositionService', CodePositionService);
    //factory注入$http的服务
    CodePositionService.$inject = ['$http'];
    //factory 函数
    function CodePositionService($http) {
        var factory = {};
        factory.GetList = function (page, limit, swhere, sort, func) {
            $http.get('/api/BasePosition/GetPositionList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null).success(func);
        }
        return factory;
    }
    //controller 注入服务
    CodePositionController.$inject = ['$scope', 'Notify', '$filter', 'ngTableParams', '$resource', '$timeout', 'CodePositionService', "$element", '$http', 'ngDialog', 'SweetAlert', 'toaster'];
    //controller的函数
    function CodePositionController($scope, Notify, $filter, ngTableParams, $resource, $timeout, CodePositionService, $element, $http, ngDialog, SweetAlert, toaster) {
        $scope.model = {};
        $scope.searchfield = 'CODE';
        //Tools.Method.ExtAjaxRequestEncap(Tools.Method.getAPiRootPath()
        //    + '/api/Base/GetUserModules?ct=json', 'GET',
        //    { 'userId': userId, 'orgId': orgId, 'moduleEname': menuEName }, false, function (jsonData) {
        //    //写入页面按钮缓存
        //    $.data(ExtBtns, menuEName + userId + orgId, jsonData);
        //});
        //按钮ng-click绑定事件处理
        $scope.btnList = [{ name: '删除', classs: 'btn btn-danger', click: 'onOperaDelete()' }, { name: '修改', classs: 'btn btn-primary', click: 'onOperaEdit()' }];
        $scope.myApply = myApply;
        $scope.judge = false;
        var item;
        var selectData = [];
        function myApply(expr, locals,event) {
            return $scope.$eval(expr, locals, event);
        }
        //行操作删除按钮
        $scope.onOperaDelete = function () {
            var num = $(event.target).parent().attr("id");
            Tools.Angular.Confirm(SweetAlert,function () {
                var selectedRow = tableList[num];
                if (selectedRow.OID != "" || selectedRow.OID != null) {
                    tableList.splice(num, 1);
                    var data = { PostData: selectedRow.OID };
                    $http.post('/api/BasePosition/PostPositionDelete?ct=json', data).then(function successCallback(response) {
                        if (response) {
                            $scope.model = {};
                            $scope.parentTableParams.reload();
                        }
                    }, function errorCallback(response) {
                        // 请求失败执行代码
                    });
                }
            },'删除','您的数据已删除')

        };
        //行操作修改按钮
        $scope.onOperaEdit = function () {
            var num = $(event.target).parent().attr("id");
            var selectedRow = tableList[num];
            $scope.model = selectedRow;
        }
        $scope.swhere = '';
        //获取菜单数据
        //$http.get('/Server/ButtonsMenu/ButtonsMenu.json', null).success(function successCallback(response) {
        //    $scope.json = response;
        //}, function errorCallback(response) {
        //});
        //商品代码验重
        $scope.JudgeCode = function () {
            $http.get('/api/BasePosition/GetJudgeByCode?ct=json&OID=' + $scope.model.OID + '&code=' + $scope.model.CODE).then(function successCallback(response) {
                $scope.judge = response.data;
            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        }
        //查看按钮操作
        $scope.onSee = function () {
            //获取选中行OID
            var selected = $scope.checkboxes.items;
            var selectedOidList = [];
            var selectData = new Array();
            for (var selectSignal in selected) {
                if (selected[selectSignal] == true) {
                    selectedOidList.unshift(selectSignal);
                }
            };
            //得到选中行数据
            for (var i = 0; i < selectedOidList.length; i++) {
                $.each(tableList, function (index, row) {
                    if (row.OID == selectedOidList[i]) {
                        var row = eval('(' + JSON.stringify(row) + ')');
                        delete row.$$hashKey;
                        selectData.push(row);
                    }
                }
             )
            };
            //满足查看一条数据
            if (selectData.length > 1) {
                toaster.pop('warning', "", "请选择一条数据");
            } else if (selectData == undefined || selectData == "") {
                toaster.pop('warning', "", "您当前未选择任何一条数据");
            } else {
                $scope.model = selectData[0];
            }
        };
        //新增按钮操作
        $scope.onAdd = function () {
            $scope.model = {};
            $scope.myForm.$setPristine();
            toaster.pop('warning', "", "请在下面的表单中填写新增信息！");
        };
        //保存按钮操作
        $scope.onSave = function () {
            if ($scope.model.NAME == '' || $scope.model.NAME == undefined || $scope.model.NAME == null) {
                toaster.pop('warning', "", "名称不能为空！");
                return;
            }
            var judge =Tools.Data.FilterSqlStr($scope.model.NAME);
            if (judge!='') {
                toaster.pop('warning', "", '用户名中包含了敏感字符' + judge + ',请重新输入！');
                return;
            } else if ($scope.model.CODE == '' || $scope.model.CODE == undefined || $scope.model.CODE == null) {
                toaster.pop('warning', "", "代码不能为空！");
                return;
            } else if ($scope.judge) {
                toaster.pop('warning', "", "代码不能重复！");
                return;
            }
            judge = Tools.Data.FilterSqlStr($scope.model.CODE);
            if (judge!='') {
                toaster.pop('warning', "", '用户名中包含了敏感字符' + judge + ',请重新输入！');
                return;
            }
            $http.post('/api/BasePosition/PostPositionSave?ct=json', JSON.stringify($scope.model)).then(function successCallback(response) {
                if (response.data) {
                    toaster.pop('success', "", "保存成功！");
                    $scope.model = {};
                    $scope.myForm.$setPristine();
                    $scope.parentTableParams.reload();
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        };
        //删除按钮操作
        $scope.onDelete = function () {
            //获取选中行OID
            var selected = $scope.checkboxes.items;
            var selectedOidList = [];
            var delOIDs = '';
            for (var selectSignal in selected) {
                if (selected[selectSignal] == true) {
                    selectedOidList.unshift(selectSignal);
                }
            };
            if (selectedOidList.length > 0) {
                demo5(function () {
                    for (var k = 0; k < selectedOidList.length; k++) {
                        delOIDs += selectedOidList[k] + ',';
                    };
                    delOIDs = delOIDs.substr(0, delOIDs.length - 1);
                    var data = { PostData: delOIDs };
                    $http.post('/api/BasePosition/PostPositionDelete?ct=json', data).then(function successCallback(response) {
                        if (response) {                        
                            $scope.model = {};                        
                            $scope.parentTableParams.reload();
                        }
                    }, function errorCallback(response) {
                        // 请求失败执行代码
                    });

                });
                //ngDialog.open({
                //    template: '<div class="modal-header"><h4 class="modal-title" style="text-align: center;">确定删除数据</h4></div>' +
                //   '<div class="modal-footer" style="text-align: center;"><button type="submit" class="btn btn-primary" ng-click="confirm()" >确定</button>' +
                //               '<button type="button" class="btn btn-default" ng-click="cancel()">取消</button></div>',
                //    plain: true,
                //    className: 'ngdialog-theme-default',
                //    width: 245,
                //    scope: $scope,
                //    controller: function ($scope) {
                //        $scope.confirm = function () {
                //            for (var k = 0; k < selectedOidList.length; k++) {
                //                delOIDs += selectedOidList[k] + ',';
                //            };
                //            delOIDs = delOIDs.substr(0, delOIDs.length - 1);
                //            var data = { PostData: delOIDs };
                //            $http.post('/api/BasePosition/PostPositionDelete?ct=json', data).then(function successCallback(response) {
                //                if (response) {
                //                    $scope.closeThisDialog();
                //                    $scope.model = {};
                //                    Notify.alert('删除成功！', { status: 'success' });
                //                    $scope.parentTableParams.reload();
                //                }
                //            }, function errorCallback(response) {
                //                // 请求失败执行代码
                //            });
                //        };
                //        $scope.cancel = function () {
                //            $scope.closeThisDialog();
                //        };
                //    }
                //});

            } else {
                toaster.pop('Warning', "", "请选择要删除的数据！");
            }

        };
        //var demo5 = function (fun1) {
        //    SweetAlert.swal({
        //        title: '确定删除吗?',
        //        text: '你将无法恢复删除的数据!',
        //        type: 'warning',
        //        showCancelButton: true,
        //        confirmButtonColor: '#DD6B55',
        //        confirmButtonText: '确定!',
        //        cancelButtonText: '取消',
        //        closeOnConfirm: false
        //    }, function (isConfirm) {
        //        if (isConfirm) {
        //            fun1();
        //            SweetAlert.swal('删除!', '你选中的数据已被删除', 'success');
        //        }
        //    });
        //};
        //修改按钮操作
        $scope.onEdit = function () {
            $scope.onSee();
        }
        //查询操作按钮
        $scope.buttonSearch = function () {
            var where = '';
            if ($scope.searchValue != null && $scope.searchValue != '' && $scope.searchValue != undefined) {
                where += $scope.searchfield + '|string|' + $scope.searchValue + ',';
            }
            if (where.length > 0)
                where = where.substr(0, where.length - 1);
            $scope.extraParams.swhere = where;

            $scope.parentTableParams.reload();
        }
        //重置按钮操作
        $scope.buttonReset = function () {
            $scope.searchfield = 'CODE';
            $scope.searchValue = '';
        }
        //构造搜索条件
        $scope.extraParams = {
            swhere: '',
        };
        $scope.total = 0;//设置table总数
        var tableList = [];
        //绑定table数据
        $scope.TableBind = function ($defer, params, sortList, func) {
            CodePositionService.GetList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList), function (data) {
                params.total(data.total);
                tableList = data.PositionList;
                $defer.resolve(data.PositionList);
                func(data.PositionList);
            });
        }

    }
})();
