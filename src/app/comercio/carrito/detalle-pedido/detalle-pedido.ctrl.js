(function() {
  'use strict';

  angular.module('chasqui').controller('DetallePedidoDialogController', DetallePedidoDialogController);

  /** @ngInject */
  function DetallePedidoDialogController($scope, order) {
    $scope.order = order;
    
    $scope.isPersonal = function(order){
        return order.idGrupo == null || (order.idGrupo != null && order.pedidos == undefined); 
    }

    $scope.isCollective = function(order){
        console.log(order);
        return order.idGrupo != null && order.pedidos != undefined;
    }
    
}})();
