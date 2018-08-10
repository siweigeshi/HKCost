/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.7.5
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';
    angular
        .module('angle', [
            'app.core',
            'app.routes',
            'app.topnavbar',
            'app.sidebar',
            //'app.navsearch',
            'app.preloader',
            //'app.loadingbar',
            //'app.translate',
            'app.settings',
            //'app.dashboard',
            'app.icons',
            //'app.flatdoc',
            'app.notify',
            'app.bootstrapui',
            'app.utils'
        ]);
})();

