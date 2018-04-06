(function() {
	'use strict';

	angular.module('chasqui').service('modifyVarietyCount', modifyVarietyCount);

	function modifyVarietyCount($log, dialogCommons, contextPurchaseService, ToastCommons, $rootScope, 
                                 productoService, us, $state, contextOrdersService){

        return {
            modifyDialog: modifyDialog
        }
        
        ///////////////////////////////////////////////////////////////////////
        
        function modifyDialog(variety){
            var varietyName = (variety.nombreProducto === undefined)? variety.nombre : variety.nombreProducto;
            
            var initialCount = initialCountForVariety(variety);
       
            function doOk(result) {
                if (result > initialCount) {
                    callAddToCart(variety, result - initialCount);
                }
                if (result < initialCount) {
                    callRemoveFromCart(variety, initialCount - result);
                }
            }

            function doNoOk() {
                $log.debug("Cancelo Agreglar")
            }

            dialogCommons.modifyVarietyCount({
                                                title: "¿Cuántos " + varietyName + " necesitas?",
                                                okButton: "Agregar al carrito",
                                                cancelButton: "Cancelar"
                                            },
                                             initialCount,
                                             {
                                                doOk: doOk,
                                                doNoOk: doNoOk
                                            });
       }
        
        /* Private */
        
		function callAddToCart(variety, count) {
            modifyVarietyCount(variety, count, 1, productoService.agregarPedidoIndividual, 'PRODUCTO_AGREGADO');
		}
        
        function callRemoveFromCart(variety, count){
            modifyVarietyCount(variety, count, -1, productoService.quitarProductoIndividual, 'QUITO_PRODUCTO');
        }
        
        
        function modifyVarietyCount(variety, count, sign, modifierFunction, modifierOkText){
            function doOk(response) {
				ToastCommons.mensaje(us.translate(modifierOkText));
				$rootScope.$emit('lista-producto-agrego-producto');
                
                function orderModification(order){
                    if(order.productosResponse.filter(function(p){return p.idVariante == variety.idVariante}).length > 0){
                        var index = order.productosResponse.map(function(p){return p.idVariante}).indexOf(variety.idVariante);
                        order.productosResponse[index].cantidad += (sign * count);
                    }else{
                        order.productosResponse.push(formatLikeServerVariety(variety, count));
                    }
                    
                    return order;
                }
                
                contextOrdersService.modifyOrder(contextPurchaseService.getCatalogContext(),
                                                 contextPurchaseService.getSelectedOrder(),
                                                 orderModification);
			}
            
			var params = {
                idPedido: contextPurchaseService.getOrderContext(),
                idVariante: variety.idVariante,
                cantidad: count
            };

			modifierFunction(params).then(doOk)            
        }
        
        
        function initialCountForVariety(variety){
            var varietyInOrder = contextPurchaseService.getSelectedOrder().productosResponse.filter(function(p){return p.idVariante === variety.idVariante});
            return (varietyInOrder.length === 1)? varietyInOrder[0].cantidad : 0;
        }
        
        function formatLikeServerVariety(variety, count){
            return {
                nombre: variety.nombreProducto,
                idVariante: variety.idVariante,
                precio: variety.precio,
                cantidad: count,
                imagen: variety.imagenPrincipal
            }
        }
	} 
})(); 