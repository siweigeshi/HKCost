(function () {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'whirl': ['/Scripts/vendor/whirl/dist/whirl.css'],
                'classyloader': ['/Scripts/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
                'animo': ['/Scripts/vendor/animo.js/animo.js'],
                'fastclick': ['/Scripts/vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['/Scripts/vendor/modernizr/modernizr.custom.js'],
                'animate': ['/Scripts/vendor/animate.css/animate.min.css'],
                'skycons': ['/Scripts/vendor/skycons/skycons.js'],
                'icons': ['/Scripts/vendor/fontawesome/css/font-awesome.min.css',
                    '/Scripts/vendor/simple-line-icons/css/simple-line-icons.css'],
                'weather-icons': ['/Scripts/vendor/weather-icons/css/weather-icons.min.css',
                    '/Scripts/vendor/weather-icons/css/weather-icons-wind.min.css'],
                'sparklines': ['/Scripts/vendor/sparkline/index.js'],
                'wysiwyg': ['/Scripts/vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    '/Scripts/vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
                'slimscroll': ['/Scripts/vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['/Scripts/vendor/screenfull/dist/screenfull.js'],
                'vector-map': ['/Scripts/vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                    '/Scripts/vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
                'vector-map-maps': ['/Scripts/vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                    '/Scripts/vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
                'loadGoogleMapsJS': ['/Scripts/vendor/load-google-maps/load-google-maps.js'],
                'flot-chart': ['/Scripts/vendor/Flot/jquery.flot.js'],
                'flot-chart-plugins': ['/Scripts/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    '/Scripts/vendor/Flot/jquery.flot.resize.js',
                    '/Scripts/vendor/Flot/jquery.flot.pie.js',
                    '/Scripts/vendor/Flot/jquery.flot.time.js',
                    '/Scripts/vendor/Flot/jquery.flot.categories.js',
                    '/Scripts/vendor/flot-spline/js/jquery.flot.spline.min.js'],
                'moment': ['/Scripts/vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['/Scripts/vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
                'flatdoc': ['/Scripts/vendor/flatdoc/flatdoc.js'],
                'codemirror': ['/Scripts/vendor/codemirror/lib/codemirror.js',
                    '/Scripts/vendor/codemirror/lib/codemirror.css'],
                // modes for common web files
                'codemirror-modes-web': ['/Scripts/vendor/codemirror/mode/java/Scripts/java/script.js',
                    '/Scripts/vendor/codemirror/mode/xml/xml.js',
                    '/Scripts/vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    '/Scripts/vendor/codemirror/mode/css/css.js'],
                'taginput': ['/Scripts/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    '/Scripts/vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
                'filestyle': ['/Scripts/vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'chartjs': ['/Scripts/vendor/Chart.js/Chart.js'],
                'morris': ['/Scripts/vendor/raphael/raphael.js',
                    '/Scripts/vendor/morris.js/morris.js',
                    '/Scripts/vendor/morris.js/morris.css'],
                'loaders.css': ['/Scripts/vendor/loaders.css/loaders.css'],
                'spinkit': ['/Scripts/vendor/spinkit/css/spinkit.css']
            },
            // Angular based script (use the right module name)
            modules: [
                {
                    name: 'toaster', files: ['/Scripts/vendor/angularjs-toaster/toaster.js',
                        '/Scripts/vendor/angularjs-toaster/toaster.css']
                },
                {
                    name: 'localytics.directives', files: ['/Scripts/vendor/chosen_v1.2.0/chosen.jquery.min.js',
                        '/Scripts/vendor/chosen_v1.2.0/chosen.min.css',
                        '/Scripts/vendor/angular-chosen-localytics/dist/angular-chosen.js'],
                    serie: true
                },
                {
                    name: 'ngDialog', files: ['/Scripts/vendor/ngDialog/js/ngDialog.min.js',
                        '/Scripts/vendor/ngDialog/css/ngDialog.min.css',
                        '/Scripts/vendor/ngDialog/css/ngDialog-theme-default.min.css']
                },
                { name: 'ngWig', files: ['/Scripts/vendor/ngWig/dist/ng-wig.min.js'] },
                {
                    name: 'ngTable', files: ['/Scripts/vendor/ng-table/dist/ng-table.min.js',
                        '/Scripts/vendor/ng-table/dist/ng-table.min.css']
                },
                { name: 'ngTableExport', files: ['/Scripts/vendor/ng-table-export/ng-table-export.js'] },
                {
                    name: 'angularBootstrapNavTree', files: ['/Scripts/vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                        '/Scripts/vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']
                },
                {
                    name: 'xeditable', files: ['/Scripts/vendor/angular-xeditable/dist/js/xeditable.js',
                        '/Scripts/vendor/angular-xeditable/dist/css/xeditable.css']
                },
                { name: 'angularFileUpload', files: ['/Scripts/vendor/angular-file-upload/dist/angular-file-upload.js'] },
                {
                    name: 'ngImgCrop', files: ['/Scripts/vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                        '/Scripts/vendor/ng-img-crop/compile/unminified/ng-img-crop.css']
                },
                {
                    name: 'ui.select', files: ['/Scripts/vendor/angular-ui-select/dist/select.js',
                        '/Scripts/vendor/angular-ui-select/dist/select.css']
                },
                { name: 'ui.codemirror', files: ['/Scripts/vendor/angular-ui-codemirror/ui-codemirror.js'] },
                {
                    name: 'angular-carousel', files: ['/Scripts/vendor/angular-carousel/dist/angular-carousel.css',
                        '/Scripts/vendor/angular-carousel/dist/angular-carousel.js']
                },
                { name: 'infinite-scroll', files: ['/Scripts/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js'] },
                {
                    name: 'ui.bootstrap-slider', files: ['/Scripts/vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                        '/Scripts/vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                        '/Scripts/vendor/angular-bootstrap-slider/slider.js'], serie: true
                },
                {
                    name: 'ui.grid', files: ['/Scripts/vendor/angular-ui-grid/ui-grid.min.css',
                        '/Scripts/vendor/angular-ui-grid/ui-grid.min.js']
                },
                {
                    name: 'summernote', files: ['/Scripts/vendor/bootstrap/js/modal.js',
                        '/Scripts/vendor/bootstrap/js/dropdown.js',
                        '/Scripts/vendor/bootstrap/js/tooltip.js',
                        '/Scripts/vendor/summernote/dist/summernote.css',
                        '/Scripts/vendor/summernote/dist/summernote.js',
                        '/Scripts/vendor/angular-summernote/dist/angular-summernote.js'
                    ], serie: true
                },
                {
                    name: 'angular-rickshaw', files: ['/Scripts/vendor/d3/d3.min.js',
                        '/Scripts/vendor/rickshaw/rickshaw.js',
                        '/Scripts/vendor/rickshaw/rickshaw.min.css',
                        '/Scripts/vendor/angular-rickshaw/rickshaw.js'], serie: true
                },
                {
                    name: 'angular-chartist', files: ['/Scripts/vendor/chartist/dist/chartist.min.css',
                        '/Scripts/vendor/chartist/dist/chartist.js',
                        '/Scripts/vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true
                },
                { name: 'ui.map', files: ['/Scripts/vendor/angular-ui-map/ui-map.js'] },
                {
                    name: 'datatables', files: ['/Scripts/vendor/datatables/media/css/jquery.dataTables.css',
                        '/Scripts/vendor/datatables/media/js/jquery.dataTables.js',
                        '/Scripts/vendor/datatables-buttons/js/dataTables.buttons.js',
                        //'/Scripts/vendor/datatables-buttons/css/buttons.bootstrap.css',
                        '/Scripts/vendor/datatables-buttons/js/buttons.bootstrap.js',
                        '/Scripts/vendor/datatables-buttons/js/buttons.colVis.js',
                        '/Scripts/vendor/datatables-buttons/js/buttons.flash.js',
                        '/Scripts/vendor/datatables-buttons/js/buttons.html5.js',
                        '/Scripts/vendor/datatables-buttons/js/buttons.print.js',
                        '/Scripts/vendor/angular-datatables/dist/angular-datatables.js',
                        '/Scripts/vendor/angular-datatables/dist/plugins/buttons/angular-datatables.buttons.js'],
                    serie: true
                },
                {
                    name: 'angular-jqcloud', files: ['/Scripts/vendor/jqcloud2/dist/jqcloud.css',
                        '/Scripts/vendor/jqcloud2/dist/jqcloud.js',
                        '/Scripts/vendor/angular-jqcloud/angular-jqcloud.js']
                },
                {
                    name: 'angularGrid', files: ['/Scripts/vendor/ag-grid/dist/styles/ag-grid.css',
                        '/Scripts/vendor/ag-grid/dist/ag-grid.js',
                        '/Scripts/vendor/ag-grid/dist/styles/theme-dark.css',
                        '/Scripts/vendor/ag-grid/dist/styles/theme-fresh.css']
                },
                {
                    name: 'ng-nestable', files: ['/Scripts/vendor/ng-nestable/src/angular-nestable.js',
                        '/Scripts/vendor/nestable/jquery.nestable.js']
                },
                { name: 'akoenig.deckgrid', files: ['/Scripts/vendor/angular-deckgrid/angular-deckgrid.js'] },
                {
                    name: 'oitozero.ngSweetAlert', files: ['/Scripts/vendor/sweetalert/dist/sweetalert.css',
                        '/Scripts/vendor/sweetalert/dist/sweetalert.min.js',
                        '/Scripts/vendor/angular-sweetalert/SweetAlert.js']
                },
                {
                    name: 'bm.bsTour', files: ['/Scripts/vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                        '/Scripts/vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                        '/Scripts/vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true
                },
                {
                    name: 'ui.knob', files: ['/Scripts/vendor/angular-knob/src/angular-knob.js',
                        '/Scripts/vendor/jquery-knob/dist/jquery.knob.min.js']
                },
                { name: 'easypiechart', files: ['/Scripts/vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js'] },
                {
                    name: 'colorpicker.module', files: ['/Scripts/vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                        '/Scripts/vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js']
                },
                {
                    name: 'ui.sortable', files: ['/Scripts/vendor/jquery-ui/jquery-ui.min.js',
                        '/Scripts/vendor/angular-ui-sortable/sortable.js'], serie: true
                },
                {
                    name: 'ui.calendar', files: ['/Scripts/vendor/jquery-ui/jquery-ui.min.js',
                        '/Scripts/vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
                        '/Scripts/vendor/fullcalendar/dist/fullcalendar.min.js',
                        '/Scripts/vendor/fullcalendar/dist/gcal.js',
                        '/Scripts/vendor/fullcalendar/dist/fullcalendar.css',
                        '/Scripts/vendor/angular-ui-calendar/src/calendar.js'], serie: true
                },
                {
                    name: 'page.login', files: ['/Scripts/App/Modules/pages/pages.module.js',
                        '/Scripts/App/Modules/pages/access-login.controller.js'], serie: true
                },
                {
                    name: 'page.register', files: ['/Scripts/App/Modules/pages/pages.module.js',
                        '/Scripts/App/Modules/pages/access-register.controller.js'], serie: true
                },
                {
                    name: 'app.dashboard', files: ['/Scripts/app/modules/dashboard/dashboard.module.js',
                        '/Scripts/app/modules/dashboard/dashboard.controller.js'], serie: true
                },
                {
                    name: 'app.dashboard2', files: ['/Scripts/app/modules/dashboard/dashboard.module.js',
                        '/Scripts/app/modules/dashboard/dashboard.v2.controller.js'], serie: true
                },
                {
                    name: 'base.code.position', files: ['/Scripts/Vendor/ng-table/dist/ng-table.min.js',
                        '/Scripts/app/modules/basecode/code.position.controller.js'], serie: true
                },
            ]
        })
        ;

})();
