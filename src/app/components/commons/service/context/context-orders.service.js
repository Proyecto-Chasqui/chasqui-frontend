(function() {
	'use strict';

	angular.module('chasqui').service('contextOrdersService', contextOrdersService);

	function contextOrdersService(getContext, orders_dao, $localStorage, gccService, moment, contextAgrupationsService,
                                  createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal,
                                  agrupationTypeVAL, order_context, agrupationTypeDispatcher, productoService, ensureContext,
                                  setPromise, $log){


        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        var contextOrdersServiceInt = {
            reset: reset,                       // catalogId -> Null
            addOrder: addOrder,                 // catalogId -> Order -> Null
            ensureOrders: ensureOrders,         // catalogId -> OrdersType -> Promise
            getOrdersTypes: getOrdersTypes,
            getOrder: getOrder,
            getOrders: getOrders,
            getOrdersByType: getOrdersByType,
            openPersonalOrder: openAndGetPersonalOrder,
            setVirtualPersonalOrder: setVirtualPersonalOrder,
            openGroupOrder: openGroupOrder,
            confirmAgrupationOrder: confirmAgrupationOrder,
            modifyOrder: modifyOrder,            // catalogId -> Order -> Modification -> Null
            setStateConfirmed: setStateConfirmed,// catalogId -> Order -> Null
            setStateCancel: setStateCancel,       // catalogId -> Order -> Null
            setStateExpired: setStateExpired,       // catalogId -> Order -> Null
        }


        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        function reset(catalogId){
            orders_dao.reset(catalogId);
        }

        function resetType(catalogId, orderType){
            orders_dao.resetType(catalogId, orderType);
        }

        function addOrder(catalogId, order){
            orders_dao.newOrder(catalogId, order);
        }


        function ensureOrders(catalogId, type){
            return agrupationTypeDispatcher.byType(type,
                                                   ensurePersonalOrder,
                                                   ensureGroupsOrders,
                                                   ensureNodesOrders
                                                  )(catalogId);
        }

        function getOrdersTypes(){
            return agrupationTypeVAL;
        }

        function getOrder(catalogId, orderId, orderType){
            return orders_dao.getOrder(catalogId, orderId, orderType);
        }


        /*
         *  PROP:
         *  PREC:
         *  RET:
         */
        function getOrders(catalogId) {
            return setPromise(function(defered){
                ensureOrders(catalogId, agrupationTypeVAL.TYPE_PERSONAL).then(function(personalOrder){
                    ensureOrders(catalogId, agrupationTypeVAL.TYPE_GROUP).then(function(groupOrders){
                        $log.debug(personalOrder);
                        defered.resolve(personalOrder.concat(groupOrders));
                    })
                })
            })
		}

        function getOrdersByType(catalogId, ordersType){
            return orders_dao.getOrdersByType(catalogId, ordersType);
        }

        function openAndGetPersonalOrder(catalogId){
            return setPromise(function(defered){
                function doOkPedido(response) {
                    var personalOrder = response.data;
                    personalOrder.type = agrupationTypeVAL.TYPE_PERSONAL;
                    personalOrder.idGrupo = idGrupoPedidoIndividual;
                    personalOrder.aliasGrupo = "Individual";
                    replacePersonalOrder(catalogId, personalOrder);
                    defered.resolve(orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_PERSONAL));
                }

                function doOkCrear(response) {
                    productoService.verPedidoIndividual().then(doOkPedido);
                }

                var params = {
                    idVendedor: catalogId
                }

                //si falla es poque ya tiene un pedido abierto TODO mejorar
                productoService.crearPedidoIndividual(params, doOkCrear).then(doOkCrear);
            });
        }

        function setVirtualPersonalOrder(catalogId){
            replacePersonalOrder(catalogId, pedidoIndividualVirtual);
        }

        function openGroupOrder(catalogId, group){
          return setPromise(function(defered){
            function doOK(response) {
              $log.debug("callCrearPedidoGrupal", response);
              var newOrder = response.data;
              newOrder.idGrupo = group.idGrupo;
              newOrder.aliasGrupo = group.alias;
              newOrder.type = agrupationTypeVAL.TYPE_GROUP;
              contextAgrupationsService.modifyAgrupation(catalogId, group.idGrupo, agrupationTypeVAL.TYPE_GROUP, function(group){
                  group.idPedidoIndividual = newOrder.id;
                  return group; 
              });
              console.log(newOrder);

              orders_dao.removeOrder(catalogId, -group.idGrupo, agrupationTypeVAL.TYPE_GROUP);
              orders_dao.newOrder(catalogId, newOrder);
              defered.resolve(newOrder);
            }

            function doNoOK(response) {
                $log.debug("error crear gcc individual, seguramente ya tenia pedido",response);
            }

            var params = {
                idGrupo: group.idGrupo,
                idVendedor: catalogId
            }

            console.log(params);

            gccService.crearPedidoGrupal(params, doNoOK).then(doOK);
          })
        }

        function confirmAgrupationOrder(catalogId, agrupationId, type){
          contextAgrupationsService.modifyAgrupation(catalogId, agrupationId, type, function(agrupation){

            const newOrder = {
              id: -agrupation.idGrupo,
              idGrupo: agrupation.idGrupo,
              idVendedor: catalogId,
              estado: "NO_ABIERTO",
              aliasGrupo: agrupation.alias,
              type: type,
              montoMinimo: 600.0,
              montoActual: 0.0,
              productosResponse: []
            }

            orders_dao.removeOrder(catalogId, agrupation.idPedidoIndividual, type);
            orders_dao.newOrder(catalogId, newOrder);

            agrupation.idPedidoIndividual = newOrder.id;
            return agrupation; 
          });
        }

        function modifyOrder(catalogId, order, modification){
            orders_dao.modifyOrder(catalogId, order, modification);
        }

        function setStateConfirmed(catalogId, order){
            orders_dao.changeToStateConfirm(catalogId, order.id, order.type);
        }

        function setStateCancel(catalogId, order){
            orders_dao.changeToStateCancel(catalogId, order.id, order.type);
        }
    
        function setStateExpired(catalogId, order){
            orders_dao.removeOrder(catalogId, order.id, order.type);
        }

        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        /*
         *  PROP:   Ensure personal order is cached
         *  PREC:   None
         *  RET:    Null
         *  Last modification: 6/4/18
         */
        function ensurePersonalOrder(catalogId){
            return ensureContext(
                vm.ls.lastUpdate,
                "personal order",
                orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_PERSONAL),
                function(defered){
                    isPersonalOrderOpen(catalogId).then(function(isOpen){
                        if(isOpen){
                            $log.debug("isOpen");
                            function doOkPedido(response) {
                                var personalOrder = response.data;
                                personalOrder.type = agrupationTypeVAL.TYPE_PERSONAL;
                                personalOrder.idGrupo = idGrupoPedidoIndividual;
                                personalOrder.aliasGrupo = "Individual";
                                replacePersonalOrder(catalogId, personalOrder);
                                defered.resolve(orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_PERSONAL));
                            }

                            productoService.verPedidoIndividual().then(doOkPedido);
                        }else{
                            $log.debug("nop isOpen");
                            addOrder(catalogId, pedidoIndividualVirtual);
                            defered.resolve([pedidoIndividualVirtual]);
                        }
                    })

                });
        }


        /*
         *  PROP:   Ensure groups orders are cached
         *  PREC:   None
         *  RET:    Null
         *  Last modification: 6/4/18
         */
        function ensureGroupsOrders(catalogId){
            return ensureContext(
                vm.ls.lastUpdate,
                "group orders",
                orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_GROUP),
                function(defered){
                    function doOk(response) {
                        $log.debug("orders", response.data);
                        vm.ls.lastUpdate = moment();
                        resetType(catalogId, agrupationTypeVAL.TYPE_GROUP);
                        addOrdersFromGroupsWithoutOrders(catalogId, formatOrders(response.data)).then(function(orders){
                            $log.debug("Cargando dsd el server:", catalogId, orders);
                            orders_dao.loadOrders(catalogId, orders);
                            defered.resolve(orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_GROUP));
                        });
                    }

                    gccService.pedidosByUser(catalogId).then(doOk);
                });
        }


        /*
         *  PROP:   Ensure nodes orders are cached
         *  PREC:   None
         *  RET:    Null
         *  Last modification: 6/4/18
         */
        function ensureNodesOrders(catalogId){

        }


        ///////// Auxiliares

        /*
         *  PROP:
         *  PREC:
         *  RET:
        */
        function formatOrders(ordersFromServer){
            return ordersFromServer.map(function(order){
                    order.type = agrupationTypeVAL.TYPE_GROUP;
                    return order;
                }
            );
        }

        /* Prop:   creates orders for every group without a created order (order-group is a bidirectional relation)
         * Params: orders :: [Order], a list with all user's open orders.
         * Return: [Order], a list with an order for every user's agrupation
         */
        function addOrdersFromGroupsWithoutOrders(catalogId, orders){
            return setPromise(function(defered){
                contextAgrupationsService.getAgrupations(catalogId).then(
                    function(grupos){
                        var separatedGroupsAndOrders = grupos.getAgrupations(catalogId).reduce(
                            function(r,g){
                                if(g.type != agrupationTypeVAL.TYPE_PERSONAL){
                                    if(!orders.map(function(o){return o.idGrupo}).includes(g.idGrupo)){
                                        r[0].push(g);
                                    }else{
                                        r[1].push(orders.filter(function(o){return o.idGrupo == g.idGrupo})[0]);
                                    }
                                }
                                return r;
                            }
                            , [[],[]]);
                        var groupsWithoutOrders = separatedGroupsAndOrders[0];
                        var ordersPreviouslyCreated = separatedGroupsAndOrders[1];

                        $log.debug("groupsWithoutOrders", groupsWithoutOrders);

                        createOrdersForGroupsWithoutOrders(groupsWithoutOrders, ordersPreviouslyCreated).then(defered.resolve);
                })
            })
        }

        function isPersonalOrderOpen(catalogId){
            return setPromise(function(defered){
                function doOk(response) {
                    defered.resolve(any(response.data, function(o){return o.idGrupo == null}));
                }

                gccService.pedidosByUser(catalogId).then(doOk);
            });
        }


        function any(list, property){
            return list.reduce(function(r,e){return r || property(e)}, false);
        }

        function replacePersonalOrder(catalogId, newPersonalOrder){
            orders_dao.resetType(catalogId, agrupationTypeVAL.TYPE_PERSONAL);
            addOrder(catalogId, newPersonalOrder);
        }

        // Pedido individual virtual
        var idPedidoIndividualGrupoPersonal = 0;    // Ningún pedido tiene id = 0

        var pedidoIndividualVirtual = {
            aliasGrupo: "Individual",
            estado: "CANCELADO",
            id: idPedidoIndividualGrupoPersonal,
            idGrupo: idGrupoPedidoIndividual,
            type: agrupationTypeVAL.TYPE_PERSONAL,
            productosResponse: []
        }

        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        var vm = this;

		vm.ls = $localStorage;

		vm.ls.lastUpdate = moment();


        return contextOrdersServiceInt;
    }

})();
