(function () {
    'use strict';
    PottingTable.$inject = ['$scope', 'ngTableParams', '$element'];
    function PottingTable($scope, ngTableParams, $element) {
        var tableList = [];
        //构造一个ngtable
        $scope.parentTableParams = new ngTableParams({
            page: 1,    // 当前页数 
            count: 10,    // 每页显示的条数
            sorting: { CREATETIME: "desc" }//排序
        }, {
            //total: $scope.total,    // length of data  
            counts: [10, 15, 20, 50, 100],
            getData: function ($defer, params) {
                $scope.loading = true;
                var sortList = [];
                for (var prop in params.sorting()) {
                    var model = {};
                    model.property = prop;
                    model.direction = params.sorting()[prop];
                    sortList.push(model);
                }
                //抛给外部controller的获取数据的方法
                $scope.TableBind($defer, params, sortList, function (data) {
                    tableList = data;
                    $scope.loading = false;
                });
            }

        });
        /*
        * 以下是复选框的选中，取消，全选的事件
        */
        $scope.checkboxes = {
            checked: false,
            items: {}
        };

        // watch for check all checkbox
        $scope.$watch(function () {
            return $scope.checkboxes.checked;
        }, function (value) {
            angular.forEach(tableList, function (item) {
                $scope.checkboxes.items[item.OID] = value;
            });
        });

        // watch for data checkboxes
        $scope.$watch(function () {
            return $scope.checkboxes.items;
        }, function (values) {
            var checked = 0, unchecked = 0,
                total = tableList.length;
            angular.forEach(tableList, function (item) {
                checked += ($scope.checkboxes.items[item.OID]) || 0;
                unchecked += (!$scope.checkboxes.items[item.OID]) || 0;
            });
            if (((unchecked == 0) || (checked == 0)) && total > 0) {
                $scope.checkboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", (checked != 0 && unchecked != 0));
        }, true);
        $scope.panel = 'tablePanel';
        $scope.$watch(function () {
            return $scope.loading;
        }, function () {
            if ($scope.loading) {
                $('#' + $scope.panel).addClass('whirl traditional');
            } else {
                $('#' + $scope.panel).removeClass('whirl traditional');
            }
            // start showing the spinner
            //panel.addClass('whirl ' + spinner);

            // Emit event when refresh clicked
            //$scope.$emit(refreshEvent, panel.attr('id'));

        });
    }
    //定义一个directive的组件
    angular.module('potting.table', [])
    .directive('ngTable', function () {
        return {
            restrict: 'E',
            templateUrl: 'table.html',
            controller: PottingTable
        };
    })
})();