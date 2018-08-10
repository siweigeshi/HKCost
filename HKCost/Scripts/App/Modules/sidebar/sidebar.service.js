(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http'];
    function SidebarLoader($http) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {
          //var menuJson = '/server/Sidebar/sidebar-menu.json',
            //    menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            var menuURL = '/api/base/GetUserMenuTree?ct=json';
            
            $http
              .get(menuURL)
              .success(onReady);
        }
    }
})();