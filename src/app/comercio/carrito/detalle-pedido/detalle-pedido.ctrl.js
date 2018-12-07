(function() {
  'use strict';

  angular.module('chasqui').controller('DetallePedidoDialogController', DetallePedidoDialogController);

  /** @ngInject */
  function DetallePedidoDialogController($scope, order) {
    $scope.order = order;
    
    $scope.isPersonal = function(order){
        return order.idGrupo == null; 
    }

    $scope.isCollective = function(order){
        console.log(order);
        return !$scope.isPersonal(order);
    }
    
}})();
