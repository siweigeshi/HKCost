(function () {
    'use strict';
    angular.module('PerQualify', ['angularFileUpload']).controller('PerQualifyController', PerQualifyController).factory('PerQualifyService', PerQualifyService);//angular.module()方法来声明模块，这个方法能够接受两个参数，第一个是模块的名称，第二个是依赖列表，也就是可以被注入到模块中的对象列表。controller让angular自动去寻找程序的入口ng-app，然后自动解析依赖注入，并且声成实例。最后通过工厂模式创建自定义服务
    PerQualifyService.$inject = ['$http'];//依赖注入http服务
    function PerQualifyService($http) {
        var factory = {};
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };

        //获取用户信息
        factory.GetUserMess = function () {
            return $http.get('/api/base/GetUserMess?ct=json', null);
        };


        return factory;
    }

    PerQualifyController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'PerQualifyService', 'FileUploader'];
    function PerQualifyController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, PerQualifyService, FileUploader) {
        //刷新方法
        function loadTable() {
            $scope.parentTableParams.reload();
        }
        var user;//当前用户
        PerQualifyService.GetUserName().success(function (dataName) {
            user = dataName;
        });

        ///营业执照图片
        var uploaderYZ = $scope.uploaderYZ = new FileUploader({
            url: '/Upload/' //换成自己的上传地址，本地演示不换也行
        });
        uploaderYZ.onAfterAddingFile = function (fileItem) {
            if (fileItem.file.size < 1048576) {
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {
                    //文件加载完之后，更新angular绑定
                    $scope.$apply(function () {
                        $scope.iconUrlYZ = e.target.result;
                    });
                }, false);
                reader.readAsDataURL(fileItem._file);
            } else {
                alert("请选择小于1M以下的图片！");
            }
        };
        //代理图片
        var uploaderDL = $scope.uploaderDL = new FileUploader({
            url: '/Upload/' //换成自己的上传地址，本地演示不换也行
        });
        uploaderDL.onAfterAddingFile = function (fileItem) {
            if (fileItem.file.size < 1048576) {
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {
                    //文件加载完之后，更新angular绑定
                    $scope.$apply(function () {
                        $scope.iconUrlDL = e.target.result;
                    });
                }, false);
                reader.readAsDataURL(fileItem._file);
            } else {
                alert("请选择小于1M以下的图片！");
            }
        };

        ///开户图片
        var uploaderKH = $scope.uploaderKH = new FileUploader({});
        uploaderKH.onAfterAddingFile = function (fileItem) {
            if (fileItem.file.size < 1048576) {
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {

                    $scope.$apply(function () {
                        $scope.iconUrlKH = e.target.result;
                    });
                }, false);
                reader.readAsDataURL(fileItem._file);
            } else {
                alert("请选择小于1M以下的图片！");
            }
        };
        //信用网站截图
        var uploaderXY = $scope.uploaderXY = new FileUploader({
        });
        uploaderXY.onAfterAddingFile = function (fileItem) {
            if (fileItem.file.size < 1048576) {
                var reader = new FileReader();
                reader.addEventListener("load", function (e) {
                    $scope.$apply(function () {
                        $scope.iconUrlXY = e.target.result;
                    });
                }, false);
                reader.readAsDataURL(fileItem._file);
            } else {
                alert("请选择小于1M以下的图片！");
            }
        };
        //上传按钮
        $scope.subPoatImg = function () {
            var imgUrl = '';
            imgUrl = '/Upload/';

            var data = {};
            data.imgUrl = imgUrl;
            data.dataUrl = $scope.iconUrlYZ;
            data.dataName = user + "_营业执照";

            var data2 = {};
            data2.imgUrl = imgUrl;
            data2.dataUrl = $scope.iconUrlKH;
            data2.dataName = user + "_开户许可";

            var data3 = {};
            data3.imgUrl = imgUrl;
            data3.dataUrl = $scope.iconUrlDL;
            data3.dataName = user + "_代理许可";

            var data4 = {};
            data4.imgUrl = imgUrl;
            data4.dataUrl = $scope.iconUrlXY;
            data4.dataName = user + "_信用截图";

            var dataArr = [];
            if (data.dataUrl != undefined)
                dataArr.push(data);
            if (data2.dataUrl != undefined)
                dataArr.push(data2);
            if (data3.dataUrl != undefined)
                dataArr.push(data3);
            if (data4.dataUrl != undefined)
                dataArr.push(data4);

            var dataImg = {};
            dataImg = Tools.Method.GetPostData(JSON.stringify(dataArr), false);
            Tools.Method.GetAjaxEncap('/api/Base/photoUpdate?ct=json', 'POST', dataImg, false, function (res) {
                if (res) {
                    SweetAlert.swal('图片保存成功!', '上传成功', 'success');
                } else {
                    SweetAlert.swal('图片保存失败', '上传失败', 'danger');
                }
                //获取用户信息（不是拿Session的值）
                Tools.Method.GetAjaxEncap('/api/base/GetUserMess?ct=json', 'GET', null, false, function (data) {
                    //$scope.UserMess = {};   
                    $scope.UserMess = data;
                    //$defer.resolve(data);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
                    if (data.IsActive == 0) {
                        $scope.status = 0;
                    }
                    if (data.IsActive == 1) {
                        $scope.status = 1;
                    }
                    if (data.IsActive == 3) {
                        $scope.status = 3;
                    }
                });
            })
        }

        //重置按钮 未实现
        //$scope.Reset = function () {
        //    $('.input').val("");
        //    angular.element("input[type = file]")[0].value = "";
        //    angular.element("img").value = "";
        //}

        //表格绑定方法
        $scope.status = 0;//存放审核状态
        $scope.ReviewFalse = [];//存放拒绝按钮
        //$scope.TableBind = function () {
        Tools.Method.GetAjaxEncap('/api/base/GetUserMess?ct=json', 'GET', null, false, function (data) {
            $scope.UserMess = data;
            //$defer.resolve(data);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
            if (data.IsActive == 0) {
                $scope.status = 0;
            }
            if (data.IsActive == 1) {
                $scope.status = 1;
            }
            if (data.IsActive == 3) {
                $scope.status = 3;
            }
        });
        //PerQualifyService.GetUserMess().success(function (data) {//通过工厂Service调用http方法，指定页数，行数，搜索条件，最后通过回调函数返回的data来绑定和刷新数据
        //    $scope.UserMess = data;
        //    //$defer.resolve(data);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
        //    if (data.IsActive == 1) {
        //        $scope.status = 1;
        //    }
        //    if (data.IsActive == 3) {
        //        $scope.status = 3;
        //    }
        //    //if (data.IsActive == 1) {
        //    //    $scope.status = "已审核通过";
        //    //}
        //    //if (data.IsActive == 3) {
        //    //    $scope.status = "被拒绝，请重新审查后提交";
        //    //}
        //});
        //};




        //获取当前用户
        //PerQualifyService.GetUserName().success(function (dataName) {
        //    user = dataName;
        //})



        //var tableList = [];//存放询价表数据


        ////获取报价表数据绑定到表格
        //$scope.TableBind = function ($defer, params, sortList, func) {
        //    ParityService.GetQuoteList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {
        //        params.total(data.total);
        //        tableList = data.QuoteSheetList;
        //        $defer.resolve(data.QuoteSheetList);
        //        func(data.QuoteSheetList);
        //    })
        //}

        ////查看报价单模态框
        //$scope.lookInquirySheet = function (index) {
        //    var lookModal = $uibModal.open({
        //        templateUrl: 'QuoteSheetModal',
        //        controller: function ($scope, $uibModalInstance) {
        //            $scope.QuoSheet = tableList[index];//把当前数组中数据绑定到前台
        //            $scope.cancel = function () {
        //                $uibModalInstance.dismiss('cancel');
        //            }
        //        },
        //        size: 'lg'
        //    })
        //};

    }

})();
// 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
//作用：可以用它创建命名空间，只要把自己所有的代码都写在这个特殊的函数包装内，那么外部就不能访问，除非你允许(变量前加上window，这样该函数或变量就成为全局)。各JavaScript库的代码也基本是这种组织形式。
//总结一下，执行函数的作用主要为 匿名 和 自动执行,代码在被解释时就已经在运行了。 