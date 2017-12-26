(function() {
  'use strict';

  angular
    .module('chasqui')
    .directive('demoDirective', demoDirective);

  /** @ngInject */
  function demoDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/comercio/demo/demo.tmpl.html',
      scope: {
        numero: '='
      },
      controller: DemoDirectiveController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function DemoDirectiveController($log) {
      var vm = this;

      vm.numeroMasUno = parseInt(vm.numero) + 1;
    }
  }

})();
