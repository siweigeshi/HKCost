/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.pages')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$http', '$state', '$rootScope', 'Notify', '$timeout', '$cookieStore','$scope'];
    function LoginFormController($http, $state, $rootScope, Notify, $timeout, $cookieStore, $scope) {
        var vm = this;
        activate();
        ////////////////

        function activate() {           
          // bind here all data from the form
          vm.account = {};
          // place the message if something goes wrong
          vm.authMsg = '';
          vm.login = function () {
            vm.authMsg = '';
            if (vm.loginForm.$valid) {
                $('form[name="login.loginForm"] button[type="submit"]').button('loading');
              $http
                .post('/api/base/PostUserForLogin', { UserName: vm.account.email, UserPwd: $.md5(vm.account.password) })
                .then(function (response) {
                    switch (response.data.result) {
                        case 'nouser': vm.authMsg = '此账号不存在';
                            break;
                        case 'pwderror': vm.authMsg = '密码不正确';
                            break;
                        case true:
                            var expireDate = new Date();
                            expireDate.setDate(expireDate.getDate() + 30);
                            $cookieStore.put('HKCostUser', response.data.user, { 'expires': expireDate.toUTCString() });//存cookie
                            Notify.alert('登陆成功', { status: 'success' });
                            //$state.go('basecode.position');
                            $state.go('HomePage.HomePage');
                            //$timeout(function () {
                            //    $state.go('app.dashboard');
                            //}, 3000);
                            break;
                        default:
                            vm.authMsg = '登陆失败';
                    }
                  $('form[name="login.loginForm"] button[type="submit"]').button('reset');
                }, function() {
                    vm.authMsg = '登陆失败,服务器错误';
                    $('form[name="login.loginForm"] button[type="submit"]').button('reset');
                });

            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.loginForm.account_email.$dirty = true;
              vm.loginForm.account_password.$dirty = true;
            }
          };
        }
    }
})();
