/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function () {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/Dashboard');
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('system', {
                abstract: true,
                url: '/sys',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('system.userinfo', {
                url: '/userinfo',
                title: '用户管理',
                templateUrl: '/view/system/userinfo.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/tools/ToolsModal.js',
                                    '/scripts/vendor/angular-jqwidgets/jqxangular.js',
                                    '/scripts/app/modules/system/system.userinfo.controller.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('system.buttoninfo', {
                url: '/buttoninfo',
                title: '按钮管理',
                templateUrl: '/view/system/buttoninfo.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/app/modules/system/system.roleinfo.controller.js',
                                    '/Scripts/Vendor/angular-datatables/dist/angular-datatables.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('system.permissioninfo', {
                url: '/permissioninfo',
                title: '权限码表管理',
                templateUrl: '/view/system/permissioninfo.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/app/modules/system/system.roleinfo.controller.js',
                                    '/Scripts/Vendor/angular-datatables/dist/angular-datatables.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('system.roleinfo', {
                url: '/roleinfo',
                title: '角色管理',
                templateUrl: '/view/system/roleinfo.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/app/modules/system/system.roleinfo.controller.js',
                                    '/Scripts/Vendor/angular-datatables/dist/angular-datatables.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('system.dictionary', {
                url: '/dictionary',
                title: '字典管理',
                templateUrl: '/view/system/dictionary.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/tools/ToolsModal.js',
                                    '/scripts/app/modules/system/system.dictionary.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('system.orginfo', {
                url: '/orginfo',
                title: '组织机构管理',
                templateUrl: '/view/system/OrgInfo.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/scripts/tools/ToolsModal.js',
                                    '/scripts/app/modules/system/system.orginfo.controller.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            //.state('basecode', {
            //    abstract: true,
            //    url: '/basecode',
            //    title: '基础码表',
            //    resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
            //        'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
            //    views: {
            //        'content': {
            //            template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
            //        }
            //    }
            //})
            //.state('basecode.position', {
            //    url: '/position',
            //    title: '基础码表',
            //    templateUrl: '/view/basecode/position.html',
            //    resolve: ['$ocLazyLoad', function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([{
            //            name: 'base.code.position',
            //            files: [
            //                    '/Scripts/app/modules/basecode/code.position.controller.js',
            //                '/Scripts/app/modules/common/potting.table.directive.js',
            //            '/Scripts/app/modules/common/common.buttonsmenu.directive.js']
            //        }])
            //    }]
            //})
            .state('HomePage', {
                abstract: true,
                url: '/HomePage',
                title: '系统首页',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('HomePage.HomePage', {
                url: '/HomePage',
                title: '首页',
                templateUrl: '/view/homepage/homepage.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/app/modules/homepage/dcalendar.picker.js',
                                    '/Scripts/app/modules/homepage/homepage.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('ResultManage', {
                abstract: true,
                url: '/ResultManage',
                title: '报价公示',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('ResultManage.ResultBulletin', {
                url: '/ResultBulletin',
                title: '结果公示',
                templateUrl: '/view/resultmanage/ResultBulletin.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/resultmanage/resultbulletin.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('InquieySheetManage', {
                abstract: true,
                url: '/InquieySheetManage',
                title: '询价管理',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('InquieySheetManage.InquirySheet', {
                url: '/InquirySheet',
                title: '询价单管理',
                templateUrl: '/view/inquirymanage/inquirysheet.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/common/ajaxfileupload.js',
                                    '/Scripts/app/modules/inquirymanage/inquiry.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('ParityManage', {
                abstract: true,
                url: '/ParityManage',
                title: '报价单管理',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('ParityManage.ParitySheet', {
                url: '/ParitySheet',
                title: '比价管理',
                templateUrl: '/view/paritymanage/ParitySheet.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/paritymanage/parity.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('ParityManage.DealOrder', {
                url: '/DealOrder',
                title: '成交订单管理',
                templateUrl: '/view/paritymanage/DealOrder.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/paritymanage/dealorder.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })  
            .state('QuoteManage', {
                abstract: true,
                url: '/QuoteManage',
                title: '报价管理',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('QuoteManage.QuoteSheet', {
                url: '/QuoteSheet',
                title: '询价报价管理',
                templateUrl: '/view/quotemanage/QuoteSheet.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/quotemanage/quote.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('QuoteManage.QuoteManage', {
                url: '/QuoteManage',
                title: '报价单管理',
                templateUrl: '/view/quotemanage/QuoteManage.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/quotemanage/QuoteManage.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('PersonManage', {
                abstract: true,
                url: '/PersonManage',
                title: '个人信息管理',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('PersonManage.PwdManage', {
                url: '/PwdManage',
                title: '密码管理',
                templateUrl: '/view/PersonManage/PerResetPwd.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/personmanage/PwdManage.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('PersonManage.PerQualify', {
                url: '/PerQualify',
                title: '企业资质认证',
                templateUrl: '/view/PersonManage/PerQualify.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/common/ajaxfileupload.js',
                                    '/Scripts/app/modules/common/jquery.cookie.js',
                                    '/Scripts/app/modules/personmanage/PerQualify.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('SupplierManage', {
                abstract: true,
                url: '/SupplierManage',
                title: '供应商资质管理',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'ngTable', 'ngDialog',
                    'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'oitozero.ngSweetAlert'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                    }
                }
            })
            .state('SupplierManage.SupQualify', {
                url: '/SupQualify',
                title: '资质管理',
                templateUrl: '/view/SupplierManage/SupQualify.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                                    '/Scripts/Vendor/ngDialog/js/ngDialog.min.js',
                                    '/Scripts/Vendor/angular-sweetalert/SweetAlert.js',
                                    '/Scripts/App/Modules/common/sweetalert.min.js',
                                    '/Scripts/App/Modules/common/jquery-ui.min.js',
                                    '/Scripts/app/modules/suppliermanage/SupQualify.controller.js',
                                    '/Scripts/app/modules/common/potting.table.directive.js',
                                    '/Scripts/app/modules/common/common.buttonsmenu.directive.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('page', {
                url: '/page',
                abstract: true,
                views: {
                    'main': {
                        //templageUrl: '/view/page/login.html',
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>'
                        //templageUrl: '/view/page/recover.html',
                    }
                }
                //resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.login', {
                url: '/login',
                title: '登陆',
                templateUrl: '/view/page/login.html',
                resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.register', {
                url: '/register',
                title: '注册',
                //templateUrl: helper.basepath('Page/Register')
                templateUrl: '/view/page/Register.html'
                //resolve: helper.resolveFor('modernizr', 'icons')
            }) 
            .state('page.maintenance', {
                url: '/maintenance',
                title: 'maintenance',
                templateUrl: '/view/page/Maintenance.html'
                //resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.404', {
                url: '/404',
                title: '404',
                templateUrl: '/view/page/Error404.html'
                //resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.500', {
                url: '/500',
                title: '500',
                templateUrl: '/view/page/Error500.html'
                //resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.recover', {
                url: '/recover',
                title: '找回密码',
                templateUrl: '/view/page/recover.html',
                resolve: [
                    '$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: [
                                    '/Scripts/App/Modules/pages/recover.module.js',
                                    '/Scripts/App/Modules/pages/recover.controller.js'
                                ]
                            }
                        ]);
                    }
                ]
            })
            .state('page.resetPwd', {
                params: { 'resetOID': '', 'resetCaptcha': '' },
                url: '/resetPwd',
                title: '重设密码',
                templateUrl: '/view/page/resetPwd.html'
            })
            .state('app', {
                //url: '/app',
                abstract: true,
                //templateUrl: helper.basepath('App/Index'),
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl'),
                views: {
                    'content': {
                        template: '<div data-ui-view="" autoscroll="false" ng-class="app.viewAnimation" class="content-wrapper"></div>',
                        controller: [
                            '$rootScope', function ($rootScope) {
                                setTimeout(function () {
                                    angular.element('.offsidebar').removeClass('hide');
                                }, 3000);
                            }
                        ]
                    }
                }

            })
            .state('app.dashboard', {
                url: '/Dashboard',
                title: 'Dashboard',
                templateUrl: '/view/dashboard/dashboardv1.html'
            })
            .state('app.dashboard_v2', {
                url: '/dashboard_v2',
                title: 'Dashboard v2',
                templateUrl: '/view/dashboard/dashboardv2.html', //helper.basepath('Dashboard/DashboardV2'),
                //controller: 'DashboardV2Controller',
                //controllerAs: 'dash2',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins')
            })
            .state('app.dashboard_v3', {
                url: '/dashboard_v3',
                title: 'Dashboard v3',
                controller: 'DashboardV3Controller',
                controllerAs: 'dash3',
                templateUrl: helper.basepath('Dashboard/DashboardV3'),
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'vector-map', 'vector-map-maps')
            });
        //
        // Single Page Routes
        // -----------------------------------

    } // routesConfig

})();

