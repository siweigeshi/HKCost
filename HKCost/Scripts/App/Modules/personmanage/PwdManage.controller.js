(function () {
    'use strict';
    angular
        .module('PwdManage',[])
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$http', '$state', '$rootScope', 'Notify', '$timeout', '$cookieStore', '$scope', '$stateParams','SweetAlert'];
    function RegisterFormController($http, $state, $rootScope, Notify, $timeout, $cookieStore, $scope, $stateParams, SweetAlert) {
        var vm = this;
        activate();
        function activate() {
            // 在这里绑定表单中的所有数据
            vm.account = {};
            // 错误日志
            vm.authMsg = '';
            vm.register = function () {
                vm.authMsg = '';
                        if (vm.registerForm.$valid) {//验证表单中的数据是否符合规则
                            $http.post('/api/base/PostResetPwdUpdate?ct=json', { UserPwd: $.md5(vm.register.password) }
                            ).success(function (data) {
                                if (data) {
                                    SweetAlert.swal('密码修改成功', '', 'success');
                                }
                                else {
                                    vm.authMsg = "修改失败";
                                    SweetAlert.swal('密码修改失败', '请联系管理员', 'danger');
                                }
                            }) 
                        }
                        else {
                            // 如果用户直接单击登录，则设置错误，以便显示验证消息
                            vm.registerForm.account_password.$dirty = true;
                        }
            };
        }
    }
})();