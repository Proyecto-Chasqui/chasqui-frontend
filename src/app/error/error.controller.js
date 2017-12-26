(function() {
  'use strict';

  angular.module('chasqui').controller('ErrorController', ErrorController);

  /** @ngInject */
  function ErrorController($log, $filter, $stateParams) {
    $log.debug('Error controller starting...', $stateParams.key);
    var vm = this;
    //  vm.key =$stateParams.key;
    //  vm.errorMessage = $filter('translate')($stateParams.key);
    vm.errorMessage = 'Error inesperado';
  }
})();
