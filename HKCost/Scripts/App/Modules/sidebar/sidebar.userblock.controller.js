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
            //��ͼƬ��ַ���� ��������
            $scope.user.picture ="/Images/user/user.jpg";
            //��ӭ����
            //$scope.sidebar.WELCOME;
            if ($cookieStore.get("HKCostUser") == null) {
                $scope.user.name = "no data";
                $scope.user.job = "no data";
            }
            else {
                $scope.user.name = $cookieStore.get("HKCostUser") != null ? $cookieStore.get("HKCostUser").Name : "";
                ////�������� ���Ұ�ΪEMAIL
                $scope.user.job = $cookieStore.get("HKCostUser") != null ? $cookieStore.get("HKCostUser").EMAIL : "";
            }
        }

    }
})();
