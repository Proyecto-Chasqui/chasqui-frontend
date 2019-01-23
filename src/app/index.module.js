(function() {
  'use strict';

  angular.module('chasqui', ['ngAnimate', 'ngCookies', 'ngTouch',
      'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router',
      'toastr', 'ngMaterial', 'ngStorage', 'ngMdIcons', 'pascalprecht.translate', 
      'leaflet-directive','angular-loading-bar', 'angularMoment', 'angular-carousel',
       'angular-notification-icons','toastr', 'ngWebSocket', 'slick'
    ])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('forest')
        .primaryPalette('orange');
    })


})();
