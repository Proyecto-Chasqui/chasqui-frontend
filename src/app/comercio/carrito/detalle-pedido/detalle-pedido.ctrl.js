(function() {
  'use strict';

  angular.module('chasqui').controller('DetallePedidoDialogController', DetallePedidoDialogController);

  /** @ngInject */
  function DetallePedidoDialogController($scope, order) {
    $scope.order = order;
    
}})();
