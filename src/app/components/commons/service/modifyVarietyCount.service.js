(function() {
  'use strict';

  angular.module('chasqui').service('modifyVarietyCount', modifyVarietyCount);

  function modifyVarietyCount($log, dialogCommons, contextPurchaseService, toastr, $rootScope, agrupationTypeVAL,
                                productoService, us, $state, contextOrdersService, setPromise, agrupationTypeDispatcher,
                                contextAgrupationsService, contextCatalogObserver){

    return {
        modifyDialog: modifyDialog
    }

    ///////////////////////////////////////////////////////////////////////

    function modifyDialog(variety, order){
        var varietyName = (variety.nombreProducto === undefined)? variety.nombre : variety.nombreProducto;

        initialCountForVariety(variety).then(function(initialCount){

            function doOk(result) {
                if(initialCount == 0 && result > 0){
                  callAddToCart(variety, result - initialCount, "Producto agregado al changuito con "+result+" unidades");
                }else if(initialCount > 0 && result == 0){
                  callRemoveFromCart(variety, initialCount - result, "Producto quitado");
                }else if (result > initialCount) {
                  callAddToCart(variety, result - initialCount, "Agregadas "+(result - initialCount)+" unidades");
                }else if (result < initialCount) {
                  callRemoveFromCart(variety, initialCount - result, "Quitadas "+(initialCount - result)+" unidades");
                }
            }

            function doNoOk() {
                $log.debug("Cancelo Agreglar")
            }

            dialogCommons.modifyVarietyCount(variety,
                                             order,
                                            {
                                                title: "¿Cuántos " + varietyName + " querés?",
                                                okButtonAgregar: "Agregar al changuito",
                                                okButtonModificar: "Modificar cantidad",
                                                okButtonRemover: "Quitar del changuito",
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

  function callAddToCart(variety, count, toastText) {
        modifyVarietyCount(variety, count, 1, productoService.agregarPedidoIndividual, toastText);
  }

  function callRemoveFromCart(variety, count, toastText){
      modifyVarietyCount(variety, count, -1, productoService.quitarProductoIndividual, toastText);
  }


  function modifyVarietyCount(variety, count, sign, modifierFunction, modifierOkText){

    function doOk(orderOk){
      return function (response) {
        contextCatalogObserver.observe(function(){
            function orderModification(order){
                if(order.estado != "ABIERTO"){
                    order.estado = "ABIERTO";
                    order.montoActual = 0;
                    order.productosResponse = [];
                }
                return modifyTotalPurchase(modifyVarietyCountOnOrder(order, variety, sign*count), sign * count * variety.precio);
            }

            contextOrdersService.modifyOrder(contextPurchaseService.getCatalogContext(),
                                              orderOk,
                                              orderModification);

            toastr.success(us.translate(modifierOkText), us.translate('AVISO_TOAST_TITLE'));
            $rootScope.$emit('lista-producto-agrego-producto');
        })
      }
    }

    contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
      if(selectedOrder.estado == "NO_ABIERTO"){
        contextPurchaseService.getSelectedAgrupation().then(function(selectedAgrupation){
          contextOrdersService.openAgrupationOrder(contextPurchaseService.getCatalogContext(), selectedAgrupation).then(function(createdOrder){

            var params = {
                idPedido: createdOrder.id,
                idVariante: variety.idVariante,
                cantidad: count
            };

            modifierFunction(params).then(doOk(createdOrder));
          })
        })
      } else {

          var params = {
              idPedido: selectedOrder.id,
              idVariante: variety.idVariante,
              cantidad: count
          };

          modifierFunction(params).then(doOk(selectedOrder));
      }
    })
  }


    function initialCountForVariety(variety){
        return setPromise(function(defered){
            contextPurchaseService.getSelectedOrder().then(function(selectedOrder){
                var varietyInOrder = selectedOrder.productosResponse.filter(function(p){return p.idVariante === variety.idVariante});
                var existsVarietyInOrder = varietyInOrder.length === 1;
                defered.resolve((existsVarietyInOrder && selectedOrder.estado == "ABIERTO")? varietyInOrder[0].cantidad : 0);
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
                contextCatalogObserver.observe(function(){
                    contextAgrupationsService.modifyAgrupation(contextPurchaseService.getCatalogContext(),
                                                               groupOrder.idGrupo,
                                                               agrupationTypeVAL.TYPE_GROUP,
                                                               function(group){
                        group.estado = "ABIERTO";
                        return group;
                    });
                })

                return groupOrder;
            },
            function(nodeOrder){
              contextCatalogObserver.observe(function(){
                contextAgrupationsService.modifyAgrupation(contextPurchaseService.getCatalogContext(),
                                                           nodeOrder.idGrupo,
                                                           nodeOrder.type,
                  function(node){
                    node.estado = "ABIERTO";
                    return node;
                });
              })

              return nodeOrder;
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
        order.incentivoActual = order.productosResponse.reduce(function(r,p){
          return r + p.incentivo * p.cantidad;
        },0)

        return order;
    }


    function formatLikeServerVariety(variety, count){
        return {
            nombre: variety.nombreProducto,
            idVariante: variety.idVariante,
            precio: variety.precio,
            incentivo: variety.incentivo,
            cantidad: count,
            imagen: variety.imagenPrincipal
        }
    }
  }
})();
