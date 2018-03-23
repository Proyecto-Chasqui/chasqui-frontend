(function() {
	'use strict';

	angular.module('chasqui').service('ModifyVarietyCount', ModifyVarietyCount);

	function ModifyVarietyCount($log, dialogCommons, contextPurchaseService, ToastCommons, $rootScope, productoService, us, $state){

        this.modifyDialog = function(variety){
                        
            console.log(variety);
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
                $log.debug("Cancelo Agregar")
            }

            //dialogCommons.prompt('Agregar al changuito', '¿Cuántos ' + variety.nombreProducto + ' necesitas?','Cantidad', 'Agregar', 'Cancelar', doOk, doNoOk);
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
            modifyVarietyCount(variety, count, productoService.agregarPedidoIndividual, 'PRODUCTO_AGREGADO');
		}
        
        function callRemoveFromCart(variety, count){
            modifyVarietyCount(variety, count, productoService.quitarProductoIndividual, 'QUITO_PRODUCTO');
        }
        
        function modifyVarietyCount(variety, count, modifierFunction, modifierOkText){
            function doOk(response) {
				ToastCommons.mensaje(us.translate(modifierOkText));
				contextPurchaseService.refreshPedidos();
				$rootScope.$emit('lista-producto-agrego-producto');
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
	} 
})(); 