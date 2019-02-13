(function () {
    'use strict';

    angular.module('Inquiry', ['angularFileUpload']).controller('InquiryController', InquiryController).factory('InquiryService', InquiryService);

    InquiryService.$inject = ['$http'];//创建工厂类注入注册的服务，依赖注入http服务
    function InquiryService($http) {
        var factory = {};
        //获取登录人
        factory.GetUserName = function () {
            return $http.get('/api/UserManager/GetUserName?ct=json', null);
        };
        //获取数据
        factory.GetInquiryList = function (page, limit, swhere, sort) {
            return $http.get('/api/Inquiry/GetInquiryList?ct=json&page=' + page + '&limit=' + limit + '&swhere=' + swhere + '&sort=' + sort, null)
        };
        //删除数据
        factory.PostInquiryDelete = function (OIDs) {
            return $http.post('/api/Inquiry/PostInquiryDelete?ct=json', { PostData: OIDs });
        };
        //增加或修改数据
        factory.PostInquirySave = function (Inquirys) {
            return $http.post('/api/Inquiry/PostInquirySave?ct=json', Inquirys);
        };
        return factory;
    }
    //$inject生成一个依赖数组
    //$uibModal模态框的注入
    InquiryController.$inject = ['$scope', 'Notify', '$filter', '$resource', '$timeout', "$element", 'ngTableParams', '$http', 'ngDialog', '$uibModal', 'SweetAlert', 'InquiryService', 'FileUploader'];
    function InquiryController($scope, Notify, $filter, $resource, $timeout, $element, ngTableParams, $http, ngDialog, $uibModal, SweetAlert, InquiryService, FileUploader) {
        //js开始

        $scope.status = [];//存放询价单状态
        $scope.isEdit = [];//是否可修改
        $scope.isDelete = [];//是否可删除
        var tableList = [];//定义存放数据的数组
        var user;//定义当前用户

        function loadTable() {
            $scope.parentTableParams.reload();
        }

        /***不为空验证***/
        $scope.name = false;//输入框验证
        $scope.startTime = false;//开始时间验证
        $scope.finTime = false;//结束时间验证
        $scope.BuyCompanyName = false;//采购公司名称
        //验证标题
        var checkName = function (SheetName) {
            if (SheetName == '' || SheetName == undefined || SheetName == null) {
                $scope.name = true;
                return $scope.name;
            }
            else {
                $scope.name = false;
                return $scope.name;
            }
        }
        //验证采购公司名称
        var checkBuyCompanyName = function (BuyCompanyName) {
            if (BuyCompanyName == '' || BuyCompanyName == undefined || BuyCompanyName == null) {
                $scope.BuyCompanyName = true;
                return $scope.BuyCompanyName;
            }
            else {
                $scope.BuyCompanyName = false;
                return $scope.BuyCompanyName;
            }
        }

        //获取当前用户
        InquiryService.GetUserName().success(function (username) {
            user = username;
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
            InquiryService.GetInquiryList(params.page(), params.count(), $scope.extraParams.swhere, JSON.stringify(sortList)).success(function (data) {//通过工厂Service调用http方法，指定页数，行数，搜索条件，最后通过回调函数返回的data来绑定和刷新数据
                params.total(data.total);
                tableList = data.inquiryList;
                $defer.resolve(data.inquiryList);//$ defer是用于解析依赖关系和呈现最终数据的promise对象。
                func(data.inquiryList);//数据刷新
                for (var i = 0; i < data.inquiryList.length; i++) {
                    $scope.status[i] = "询价中";
                    $scope.isEdit[i] = false;
                    $scope.isDelete[i] = false;
                    if (data.inquiryList[i].BuyCompanyName == user) {//当采购人为自己的时候，显示修改和删除按钮
                        $scope.isEdit[i] = true;
                        $scope.isDelete[i] = true;
                    }
                    if (data.inquiryList[i].BuyState == 2) {//如果当前询价单状态为询价结束，则隐藏修改按钮
                        $scope.status[i] = "询价结束";
                        $scope.isEdit[i] = false;
                    }
                    if (data.inquiryList[i].BuyState == 1) {   //隐藏删除按钮（当询价单处于询价中状态是 不能删除）
                        $scope.isDelete[i] = true;
                    }
                }
            });
        }

        //查看方法
        $scope.lookInquirySheet = function (index) {
            var lookModal = $uibModal.open({
                templateUrl: '/InquirySheetModal.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.curSheet = tableList[index];
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                size: 'lg'
            });
        }



        //$scope.upload = function (file) {
        //    $scope.fileInfo = file;
        //    Upload.upload({
        //        //服务端接收
        //        url: '/api/Inquiry/PostFiles',
        //        //上传的同时带的参数
        //        data: { 'username': $scope.InquirySheets.InquiryTitle },
        //        file: file
        //    }).progress(function (evt) {
        //        //进度条
        //        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //        console.log('progess:' + progressPercentage + '%' + evt.config.file.name);
        //    }).success(function (data, status, headers, config) {
        //        //上传成功
        //        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        //        $scope.uploadImg = data;
        //    }).error(function (data, status, headers, config) {
        //        //上传失败
        //        console.log('error status: ' + status);
        //    });
        //};

        //删除方法
        $scope.delete = function (OID) {
            SweetAlert.swal({
                title: '确定删除吗？',
                text: '删除后您将不能恢复选中的询价单',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm) {
                    InquiryService.PostInquiryDelete(OID).success(function () {

                        SweetAlert.swal('删除成功!', '选中询价单已被删除', 'success');
                        loadTable();
                    });
                }
            });
        }
        //增加询价单
        $scope.addSheet = function (index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'AddModal',//模态框的连接
                controller: function ($scope, $uibModalInstance, $timeout, FileUploader) {
                    var formDatas = [];
                    if (index!=-1) {
                        formDatas = [{ name: tableList[index].InquiryTitle }];
                    }
                    var uploader = $scope.uploader = new FileUploader({
                        url: '/api/Inquiry/PostFiles',
                        formData: formDatas
                
                    });
                    $scope.clearItems = function () {    //重新选择文件时，清空队列，达到覆盖文件的效果
                        uploader.clearQueue();
                    };
                    uploader.onAfterAddingFile = function (fileItem) {
                        $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
                        //$scope.fileItem.append("name", tableList[index].InquiryTitle);
                    };
                    uploader.onSuccessItem = function (fileItem, response, status, headers) {
                        $scope.uploadStatus = true;   //上传成功则把状态改为true
                    };

                    if (index != -1) {
                        $scope.InquirySheets = eval('(' + JSON.stringify(tableList[index]) + ')')
                    }
                    else {
                        $timeout(function () {
                            angular.element('.datepicker').datepicker({
                                minDate: new Date()
                            });
                            $scope.InquirySheets = {};
                            //$scope.InquirySheets.StartTime = splicingDate(new Date());
                        }, 100);
                    }
                    $timeout(function () {
                        angular.element('.datepicker').datepicker({
                            minDate: new Date()
                        });
                    }, 100);
                    //标题验证
                    $scope.checkName = function (SheetName) {
                        $scope.name = checkName(SheetName);
                    }
                    //采购公司名称验证
                    $scope.checkBuyCompanyName = function (BuyCompanyName) {
                        $scope.BuyCompanyName = checkName(BuyCompanyName);
                    }

                    ////验证开始时间
                    //$scope.checkStart = function () {
                    //    if ($scope.InquirySheets.StartTime == '' || $scope.InquirySheets.StartTime == undefined || $scope.InquirySheets.StartTime == null) {
                    //        $scope.startTime = true;
                    //        return $scope.startTime;
                    //    } else {
                    //        $scope.startTime = false;
                    //        return $scope.startTime;
                    //    }
                    //}
                    ////验证计划结束时间时间
                    //$scope.checkFin = function () {
                    //    if ($scope.InquirySheets.EndTime == '' || $scope.InquirySheets.EndTime == undefined || $scope.InquirySheets.EndTime == null) {
                    //        $scope.finTime = true;
                    //        return $scope.finTime;
                    //    } else {
                    //        $scope.finTime = false;
                    //        return $scope.finTime;
                    //    }
                    //}
                    $scope.submit = function () {
                        uploader.uploadAll();
                        //upload($scope.file);
                        var model = {};
                        model = $scope.InquirySheets;
                        model.BuyState = 1;

                        InquiryService.PostInquirySave(model).success(function (data) {
                            if (data) {
                                if (index == -1) {
                                    SweetAlert.swal('创建成功', '采购单创建成功', 'success');
                                }
                                else {
                                    SweetAlert.swal('修改成功', '采购单修改成功', 'success');
                                }
                                $uibModalInstance.close('closed');
                                loadTable();
                            }
                            else {
                                SweetAlert.swal('新增或修改失败', '采购单增加或修改失败', 'danger');
                            }
                        });
                    }
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }
                },
                size: 'lg'
            });
        }
    }
})();