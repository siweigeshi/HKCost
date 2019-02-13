(function () {
    'use strict';
    angular.module('Supplier', []).controller('SupplierController', SupplierController).factory('SupplierService', SupplierService);

    SupplierService.$inject = ['$http'];//创建工厂类注入注册的服务，依赖注入http服务
    function SupplierService($http) {
        var factory = {};
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };

        //获取数据
        factory.GetSupplierUser = function (page, limit, swhere, sort) {
            return $http.get('/api/SupQualify/GetSupplierUser?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null)
        };

        //修改用户信息
        factory.PostUsersSave = function (Users) {
            return $http.post('/api/base/PostUpdate?ct=json', Users);
        };


        ////获取图片信息（未使用）
        //factory.GetImg = function () {
        //    return $http.get('/api/base/GetImg?ct=json', null);
        //};

        ////删除数据
        //factory.PostInquiryDelete = function (OIDs) {
        //    return $http.post('/api/Inquiry/PostInquiryDelete?ct=json', { PostData: OIDs });
        //};
     
        return factory;
    }
    //$inject生成一个依赖数组
    //$uibModal模态框的注入
    SupplierController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'SupplierService'];
    function SupplierController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, SupplierService) {
        //js开始

        $scope.ReviewTrue = [];//存放审核通过按钮
        $scope.ReviewFalse = [];//存放拒绝按钮
        $scope.Review = [];//存放已通过按钮
        $scope.ReviewNoPass = [];//存放已拒绝按钮
        var tableList = [];//定义存放数据的数组
        var user;//定义当前用户

        function loadTable() {
            $scope.parentTableParams.reload();
        }
        //获取当前用户
        SupplierService.GetUserName().success(function (username) {
            user = username;
        })
        //重置按钮
        $scope.reset = function () {
            $scope.searchField = 'USERNAME';
            $scope.searchValue = '';
        }
        //构造搜索条件
        $scope.extraParams = {
            swhere: '',
        };
        //默认搜索关键字
        $scope.searchField = "USERNAME";
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
        //点击图片时放大显示图片
        $scope.changePic = function ($event) {
            var img = $event.srcElement || $event.target;
            angular.element("#bigimage")[0].src = img.src;
            angular.element("#js-imgview")[0].style.display = "block";
            angular.element("#js-imgview-mask")[0].style.display = "block";
        }
        //点击图片时放小显示图片
        $scope.closePic = function () {
            angular.element("#js-imgview")[0].style.display = "none";
            angular.element("#js-imgview-mask")[0].style.display = "none";

        }

      
        //表格绑定方法
        $scope.TableBind = function ($defer, params, sortList, func) {
            SupplierService.GetSupplierUser(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {//通过工厂Service调用http方法，指定页数，行数，搜索条件，最后通过回调函数返回的data来绑定和刷新数据
                params.total(data.total);
                tableList = data.userList;
                $defer.resolve(data.userList);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
                func(data.userList);//数据刷新
                if (data.userList != null) {
                    for (var i = 0; i < data.userList.length; i++) {
                        $scope.ReviewTrue[i] = true;
                        $scope.ReviewFalse[i] = true;
                        $scope.ReviewNoPass[i] = false;
                        $scope.Review[i] = false;
                        if (data.userList[i].IsActive == 1) {//已通过
                            $scope.ReviewTrue[i] = false;
                            $scope.ReviewFalse[i] = false;
                            $scope.Review[i] = true;
                        }
                        if (data.userList[i].IsActive == 3) {//已拒绝
                            $scope.ReviewTrue[i] = false;
                            $scope.ReviewFalse[i] = false;
                            $scope.ReviewNoPass[i] = true;
                        }
                    }
                }
            });
        }

        //审核通过按钮事件
        $scope.ReviewPass = function (index,isAs) {
            var Users = {};
            Users = tableList[index];
            if (isAs==1) {
                Users.IsActive = 1;//更改审核状态
                SupplierService.PostUsersSave(Users).success(function (data) {
                    if (data) {
                        SweetAlert.swal('审核成功', '当前用户已激活', 'success');
                    }
                    else {
                        SweetAlert.swal('审核失败', '请联系管理员', 'danger');
                    }
                    loadTable();
                })
            }
            if (isAs==3) {
                Users.IsActive =3;//更改审核状态
                SupplierService.PostUsersSave(Users).success(function (data) {
                    if (data) {
                        SweetAlert.swal('拒绝成功', '已拒绝当前用户的提交', 'success');
                    }
                    else {
                        SweetAlert.swal('审核失败', '请联系管理员', 'danger');
                    }
                    loadTable();
                })
            }
           
        }
    }
})();