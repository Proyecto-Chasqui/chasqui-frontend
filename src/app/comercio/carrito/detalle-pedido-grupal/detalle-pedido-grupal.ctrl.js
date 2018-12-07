(function() {
  'use strict';

  angular.module('chasqui').controller('DetallePedidoGrupalController',
    DetallePedidoGrupalController);

  /** @ngInject */
  function DetallePedidoGrupalController($scope) {
    
    $scope.showMemberOrder = showMemberOrder;
    $scope.hideMemberOrder = hideMemberOrder;
    $scope.showAll = showAll;
    $scope.fullOrder;
    $scope.memberSelected;
    $scope.showOrder;
    $scope.showFullOrder;
    
    
    function showMemberOrder(member){
      $scope.memberSelected = member;
      $scope.showOrder = true;
      $scope.showFullOrder = false;
    }
    
    function hideMemberOrder(member){
      $scope.memberSelected = {};
      $scope.showOrder = false;
      $scope.showFullOrder = true;    
    }
    
    function showAll(){
      $scope.memberSelected = {};
      $scope.showOrder = false;
      $scope.showFullOrder = true;  
    }
    
    function init(){
      $scope.fullOrder = {
        productosResponse: $scope.pedido.pedidos.reduce(function(r,p){
          return r.concat(p.productosResponse);
        }, [])
      };
      $scope.memberSelected = {};
      $scope.showOrder = false;
      $scope.showFullOrder = true;
    }
    
    init();
    
  }

})();