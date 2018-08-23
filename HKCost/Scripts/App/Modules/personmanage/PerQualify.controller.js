(function () {
    'use strict';
    angular.module('PerQualify', []).controller('PerQualifyController', PerQualifyController).factory('PerQualifyService', PerQualifyService);//angular.module()方法来声明模块，这个方法能够接受两个参数，第一个是模块的名称，第二个是依赖列表，也就是可以被注入到模块中的对象列表。controller让angular自动去寻找程序的入口ng-app，然后自动解析依赖注入，并且声成实例。最后通过工厂模式创建自定义服务
    PerQualifyService.$inject = ['$http'];//依赖注入http服务
    function PerQualifyService($http) {
        var factory = {};
        //获取登录人
        //factory.GetUserName = function () {
        //    return $http.get('/api/UserManager/GetUserName?ct=json', null);
        //};
       

        return factory;
    }
   
    PerQualifyController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'PerQualifyService' ];
    function PerQualifyController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, PerQualifyService ) {
        //刷新方法
        function loadTable() {
            $scope.parentTableParams.reload();
        }
        var user;//当前用户

        var dataUrl;
        $scope.myFunction = function (files) {
            var file = files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (theFile) {
                dataUrl = theFile.target.result; //base64编码,用一个变量存储
            };
        }
        $scope.subPoatImg= function () {
            var imgUrl = '';
                imgUrl = '/Upload/';
            //var dataUrl = document.getElementById('File1');
                    //生成base64图片数据
                    //var dataUrl = canvas.toDataURL("image/jpeg", 1.0);
                    var data = {};
                    data.imgUrl = imgUrl;
                    data.dataUrl = dataUrl;
            //var cooikes = eval($.cookie('CurUser'));
        
                    data = Tools.Method.GetPostData(JSON.stringify(data), false);
                    Tools.Method.GetAjaxEncap(Tools.Method.getAPiRootPath() + '/api/Base/photoUpdate?ct=json', 'POST', data, false, function (res) {
                        if (res) {
                            Tools.Method.ShowTipsMsg('图片保存成功', '3000', '1', null);
                            location.reload();

                        } else {
                            Tools.Method.ShowTipsMsg('图片保存失败', '3000', '3', null);
                        }
                    })
                }
            };



 
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

        
    
})();
// 包围函数（function(){})的第一对括号向脚本返回未命名的函数，随后一对空括号立即执行返回的未命名函数，括号内为匿名函数的参数。
//作用：可以用它创建命名空间，只要把自己所有的代码都写在这个特殊的函数包装内，那么外部就不能访问，除非你允许(变量前加上window，这样该函数或变量就成为全局)。各JavaScript库的代码也基本是这种组织形式。
//总结一下，执行函数的作用主要为 匿名 和 自动执行,代码在被解释时就已经在运行了。 