(function () {
    'use strict';

    angular
        .module('app.recover')
        .controller('recoverController', recoverController);

    recoverController.$inject = ['$scope', '$state', 'Notify', '$http', '$timeout', '$interval', '$stateParams'];
    function recoverController($scope, $state, Notify, $http, $timeout, $interval, $stateParams) {
        $scope.captcha = {};//用来保存表单email 和 captcha
        //表单验证函数
        $scope.emailCheck = function () {//邮箱验证 blur
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (!reg.test($scope.captcha.email)) return true;
            return false;
        }
        $scope.captchaCheck = function () {//验证码位数验证 change
            var reg = /^[0-9a-zA-z_]{6,6}$/;
            if (!reg.test($scope.captcha.captcha)) return true;
            return false;
        }
        //重设密码验证
        $scope.newPwdCheck = function () {//新密码验证
            var reg = /^[0-9a-zA-z_]{6,20}$/;
            if (reg.test($scope.newPwd)) return true;
            return false;
        }
        $scope.checkNewPwdCheck = function () {//新密码位数验证
            if ($scope.newPwd == $scope.checkNewPwd) return true;
            return false;
        }


        //disable用来记录按钮能否被点击状态
        $scope.disable = false;
        $scope.emailInfor = "发送邮件";
        var closeInt;//读秒的interval关闭所用

        $scope.send = function () {//点击发送邮[件按钮
            if ($scope.emailCheck()) {
                Notify.alert('请输入正确的邮箱地址！', { status: 'warning' });
                return;
            }
            //在这里执行发送邮件的事件
            $http.get('/api/base/GetEmailUpdate?email=' + $scope.captcha.email, null).success(function (data) {
                if (data) {
                    Notify.alert('邮件发送成功！', { status: 'success' });
                    $scope.disable = true;
                    $scope.Countdown = 60;//一分钟后才能再次发送
                    $scope.emailInfor = $scope.Countdown-- + "秒后可重新发送";
                    closeInt = $interval(function () {
                        $scope.emailInfor = $scope.Countdown-- + "秒后可重新发送";
                    }, 1000);
                    $timeout(function () {
                        $scope.disable = false;
                        $scope.Countdown = "";
                        $interval.cancel(closeInt);
                        $scope.emailInfor = "重新发送邮件";
                    }, 60000);
                }
                else {
                    Notify.alert('邮件发送失败！此邮箱未进行注册！', { status: 'danger' });
                    $scope.disable = false;
                    $scope.Countdown = "";
                    $interval.cancel(closeInt);
                    $scope.emailInfor = "发送邮件";
                }
            })
        }

        $scope.checkCaptcha = function () {
            if ($scope.emailCheck()) {
                Notify.alert('请输入正确的邮箱地址！', { status: 'warning' });
                return;
            }
            if ($scope.captchaCheck()) {
                Notify.alert('验证码位数不正确！', { status: 'warning' });
                return;
            }
            //验证码进入数据库验证
            $http.post('/api/base/PostCheckCaptcha?ct=json', { PostData: JSON.stringify($scope.captcha) }).success(function (data) {
                if (data == 'captcha') {
                    Notify.alert('验证码错误！', { status: 'danger' });
                } 
                else if (data == 'date') {
                    Notify.alert('验证码已失效！请重新发送验证码！', { status: 'danger' });
                }
                else if (data == 'email') {
                    Notify.alert('此邮箱未注册！', { status: 'danger' });
                }
                else {
                    $scope.OID = data;
                    $state.go('page.resetPwd', { resetOID: data, resetCaptcha: $scope.captcha.captcha });
                    Notify.alert('验证成功！请修改新的密码！', { status: 'success' });
                }
            })
        }

        $scope.resetPwd = function () {
            debugger
            if (!$scope.newPwdCheck()) {
                Notify.alert('新密码必须在6-20位！', { status: 'warning' });
                return;
            }
            if (!$scope.checkNewPwdCheck()) {
                Notify.alert('两次密码不一致', { status: 'warning' });
                return;
            }
            //将密码存入数据库
            $http.post('/api/base/PostResetPwdUpdate?ct=json', { OID: $stateParams.resetOID, UserPwd: $.md5($scope.newPwd), VCODE: $stateParams.resetCaptcha }).success(function (data) {
                if (data) {
                    $state.go('page.login');
                    Notify.alert('密码修改成功！', { status: 'success' });
                }
                else {
                    Notify.alert('密码修改失败，请联系管理员', { status: 'danger' });
                }
            })
        }

        $scope.resetCaptcha = function () {
            $scope.captcha.email = "";
            $scope.captcha.captcha = "";
        }
    }
})();