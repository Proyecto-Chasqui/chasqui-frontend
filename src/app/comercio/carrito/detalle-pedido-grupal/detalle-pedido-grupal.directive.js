angular.module('chasqui').directive('detallePedidoGrupal', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'DetallePedidoGrupalController',
        scope: {
            pedido: '=pedido'
        },
        templateUrl: 'app/comercio/carrito/detalle-pedido-grupal/detalle-pedido-grupal.tmpl.html'
      };
        
}]);