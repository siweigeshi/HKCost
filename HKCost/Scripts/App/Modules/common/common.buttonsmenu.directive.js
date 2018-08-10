(function () {
	'use strict';
	Buttonsmenu.$inject = ['$scope', '$http'];
	function Buttonsmenu($scope, $http) {
		$http.get('/Server/ButtonsMenu/ButtonsMenu.json', null).success(function successCallback(response) {
			$scope.json = response;
		}, function errorCallback(response) {
		});
	}
	//定义组件
	angular.module('commom.buttonsmenu', [])
	.directive('buttonsMenu', function () {
		return {
			restrict: 'E',
			templateUrl: 'View/ButtonsMenu/ButtonsMenu.html',
			controller: Buttonsmenu
		};
	});
})();

