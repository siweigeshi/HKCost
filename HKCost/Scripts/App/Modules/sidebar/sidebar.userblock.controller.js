(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$scope', '$cookieStore'];
    function UserBlockController($scope, $cookieStore) {


        activate();
        bindUserInfo();

        function activate() {
            $scope.userBlockVisible = true;
            var detach = $scope.$on('toggleUserBlock', function(/*event, args*/) {
                $scope.userBlockVisible = ! $scope.userBlockVisible;
            });
            $scope.$on('$destroy', detach);
        }

        function bindUserInfo() {
            $scope.user = {};
            //用图片地址保存 暂无数据
            $scope.user.picture ="/Images/user/user.jpg";
            //欢迎用语
            //$scope.sidebar.WELCOME;
            if ($cookieStore.get("HKCostUser") == null) {
                $scope.user.name = "no data";
                $scope.user.job = "no data";
            }
            else {
                $scope.user.name = $cookieStore.get("HKCostUser") != null ? $cookieStore.get("HKCostUser").Name : "";
                ////测试数据 暂且绑定为EMAIL
                $scope.user.job = $cookieStore.get("HKCostUser") != null ? $cookieStore.get("HKCostUser").EMAIL : "";
            }
        }

    }
})();
