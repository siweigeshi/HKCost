(function () {
    'use strict';

    angular
        .module('app.topnavbar')
        .controller('TopNavbarController', TopNavbarController);

    TopNavbarController.$inject = ['$scope', '$state', 'Notify', '$cookieStore', '$http'];
    function TopNavbarController($scope, $state,Notify, $cookieStore, $http) {
        //登出部分
        $scope.logout = function () {
            $http.post('/api/base/PostLogout?ct=json', null).success(function (data) {
                if (data)
                {
                    Notify.alert('退出成功！', { status: 'success' });
                    $state.go('page.login');
                }
            })
            
        }
    }
})();