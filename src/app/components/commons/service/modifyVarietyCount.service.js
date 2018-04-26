(function() {
	'use strict';

	angular.module('chasqui').service('modifyVarietyCount', modifyVarietyCount);

	function modifyVarietyCount($log, dialogCommons, contextPurchaseService, ToastCommons, $rootScope, agrupationTypeVAL,
                                productoService, us, $state, contextOrdersService, setPromise, agrupationTypeDispatcher,
                                contextAgrupationsService){

        return {
            modifyDialog: modifyDialog
        }
        
        ///////////////////////////////////////////////////////////////////////
        
        function modifyDialog(variety){
            var varietyName = (variety.nombreProducto === undefined)? variety.nombre : variety.nombreProducto;
            
            initialCountForVariety(variety).then(function(initialCount){
                
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
            })
       }
        
        /* Private */
        
		function callAddToCart(variety, count) {
            modifyVarietyCount(variety, count, 1, productoService.agregarPedidoIndividual, 'PRODUCTO_AGREGADO');
		}
        
        function callRemoveFromCart(variety, count){
            modifyVarietyCount(variety, count, -1, productoService.quitarProductoIndividual, 'QUITO_PRODUCTO');
        }
        
        
        function modifyVarietyCount(variety, count, sign, modifierFunction, modifierOkText){
            contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                
                function doOk(response) {
                    function orderModification(order){
                        if(order.estado != "ABIERTO"){
                            order.estado = "ABIERTO";
                            order.montoActual = 0;
                            order.productosResponse = [];
                        }
                        return modifyTotalPurchase(modifyVarietyCountOnOrder(order, variety, sign*count), sign * count * variety.precio);
                    }

                    contextOrdersService.modifyOrder(contextPurchaseService.getCatalogContext(),
                                                     selectedOrder,
                                                     orderModification);

                    ToastCommons.mensaje(us.translate(modifierOkText));
                    $rootScope.$emit('lista-producto-agrego-producto');
                }

                var params = {
                    idPedido: selectedOrder.id,
                    idVariante: variety.idVariante,
                    cantidad: count
                };

                modifierFunction(params).then(doOk);
        
            })
        }
        
        
        function initialCountForVariety(variety){
            return setPromise(function(defered){
                contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                    var existVarietyInOrder = selectedOrder.productosResponse.filter(function(p){return p.idVariante === variety.idVariante}).length === 1;
                    defered.resolve((existVarietyInOrder && selectedOrder.estado == "ABIERTO")? varietyInOrder[0].cantidad : 0);
                })
            })
        }
        
        
        function modifyTotalPurchase(order, modification){
            order.montoActual += modification;
            return order;
        }
        
        
        function modifyVarietyCountOnOrder(order, variety, countModification){   
            
            return agrupationTypeDispatcher.byElem(modifyVarietyCountOnThisOrder(order, variety, countModification),
                function(personalOrder){
                    return personalOrder;
                },
                function(groupOrder){
                    contextAgrupationsService.modifyAgrupation(contextPurchaseService.getCatalogContext(), 
                                                               groupOrder.idGrupo, 
                                                               agrupationTypeVAL.TYPE_GROUP, 
                                                               function(group){
                        group.estado = "ABIERTO";
                        return group;
                    });
                
                    return groupOrder;
                },
                function(nodeOrder){
                
                });
        }
        
        function modifyVarietyCountOnThisOrder(order, variety, countModification){   
            if(order.productosResponse.filter(function(p){return p.idVariante == variety.idVariante}).length > 0){
                var index = order.productosResponse.map(function(p){return p.idVariante}).indexOf(variety.idVariante);
                if(order.productosResponse[index].cantidad + countModification == 0){
                    order.productosResponse.splice(index, 1);
                }else{
                    order.productosResponse[index].cantidad += countModification;
                }
            }else{
                order.productosResponse.push(formatLikeServerVariety(variety, countModification));
            }
            
            return order;
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