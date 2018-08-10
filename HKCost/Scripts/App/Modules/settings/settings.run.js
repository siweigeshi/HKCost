(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);
    //InsideCtrl.$inject = ['$scope', 'ngDialog'];
    //function InsideCtrl($scope, ngDialog) {

    //    activate();

    //    ////////////////

    //    function activate() {
    //        $scope.dialogModel = {
    //            message: 'message from passed scope'
    //        };
    //        $scope.openSecond = function () {
    //            ngDialog.open({
    //                template: '<p class="lead m0"><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
    //                plain: true,
    //                closeByEscape: false,
    //                controller: 'SecondModalCtrl'
    //            });
    //        };
    //    }
    //}
    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage) {


      // User Settings
      // -----------------------------------
      //$rootScope.user = {
      //  name:     'John',
      //  job:      'ng-developer',
      //  picture:  '/Images/user/02.jpg'
      //};

      // Hides/show user avatar on sidebar from any element
      $rootScope.toggleUserBlock = function(){
        $rootScope.$broadcast('toggleUserBlock');
      };
      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: '中储恒科',
        description: '',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: null,
          asideScrollbar: false,
          isCollapsedText: false
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings [*** UNCOMMENT TO ENABLE ***]
      // if( angular.isDefined($localStorage.layout) )
      //   $rootScope.app.layout = $localStorage.layout;
      // else
      //   $localStorage.layout = $rootScope.app.layout;
      //
      // $rootScope.$watch('app.layout', function () {
      //   $localStorage.layout = $rootScope.app.layout;
      // }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();
