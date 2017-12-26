(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('PrincipalController', PrincipalController);

  /** @ngInject */
  function PrincipalController($scope, $log, navigation_state) {
    $log.debug("PrincipalController ..... ");
    navigation_state.goWelcomeTab();
    var vm = this;

  }
})();
