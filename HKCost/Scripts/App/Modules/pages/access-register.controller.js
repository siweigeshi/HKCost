/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function () {
    'use strict';

    angular
        .module('app.pages')
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$http', '$state', '$rootScope', 'Notify', '$timeout', '$cookieStore', '$scope'];
    function RegisterFormController($http, $state, $rootScope, Notify, $timeout, $cookieStore, $scope) {
        var vm = this;
        activate();
        function activate() {
            // 在这里绑定表单中的所有数据
            vm.account = {};
            // 错误日志
            vm.authMsg = '';
         
            vm.register = function () {
                vm.authMsg = '';
                Tools.Method.GetAjaxEncap('api/base/GetJudgeUserName?ct=json&Name=' + vm.account_name, 'GET', null, false, function (data) {
                    if (!data) {
                        if (vm.registerForm.$valid) {//验证注册表单中的数据是否符合规则
                            $http.post('api/base/PostSave?ct=json',
                                {
                                    Email: vm.account.email,
                                    UserPwd: $.md5(vm.register.password),
                                    Name: vm.account_name,
                                    UserName: vm.account_name,
                                    Orgs: [
                                        {
                                            "Code": "004",
                                            "Name": "供应商",
                                            "ParentOID": "00000000-0000-0000-0000-000000000000",
                                            "LT": 7,
                                            "RT": 8,
                                            "TreeLevel": 1,
                                            "OrgLevel": 0,
                                            "OrgType": 0,
                                            "OrgNo": 4,
                                            "EnglishName": "gys",
                                            "ShortName": "供应商",
                                            "SortCode": "4",
                                            "State": 0,
                                            "CreateTime": "0001-01-01 00:00:00",
                                            "IsDefault": false,
                                            "OID": "BC049864-6FAE-438B-B449-A92D0124204C"
                                        }
                                    ],
                                    Roles: [{
                                        "Code": "003",
                                        "Name": "供应商",
                                        "State": 0,
                                        "CreateTime": "0001-01-01 00:00:00",
                                        "OID": "1C9402CB-33A5-414A-B961-A92D011B9B92"
                                    }]
                                }
                            )
                                .then(function (response) {
                                    // 如果ok，则假定响应是具有某些数据的对象，如果不是，则为具有错误的字符串
                                    if (!response.data) {//返回的数据不是True
                                        //vm.authMsg = response;
                                        vm.authMsg = "注册失败";
                                    } else {
                                        Notify.alert('注册成功，请联系管理员分配权限', { status: 'success' });

                                        $state.go('page.login');
                                    }
                                }, function () {
                                    vm.authMsg = '服务器异常，请联系系统管理员';
                                });
                        }
                        else {
                            // 如果用户直接单击登录，则设置错误，以便显示验证消息
                            /*jshint -W106*/
                            vm.registerForm.account_email.$dirty = true;
                            vm.registerForm.account_password.$dirty = true;
                            vm.registerForm.account_name.$dirty = true;

                        }

                    }
                    else {
                        vm.authMsg = "用户名已存在！";
                    }
                }
            )};
        }
    }
})();
