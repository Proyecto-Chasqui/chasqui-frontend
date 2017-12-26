angular.module('chasqui').directive('detallePedidoPersonal', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'DetallePedidoPersonalController',
        scope: {
            pedido: '=pedido'
        },
        templateUrl: 'app/comercio/carrito/detalle-pedido-personal/detalle-pedido-personal.tmpl.html'
      };
        
}]);