angular.module('chasqui').directive('productosPedido', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'ProductosPedidoController',
        scope: {
            pedido: '=pedido'
        },
        templateUrl: 'app/comercio/carrito/productos-pedido/productos-pedido.tmpl.html'
      };
        
}]);