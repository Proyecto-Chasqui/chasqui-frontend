(function() {
	'use strict';

	angular.module('chasqui').service('contextOrdersService', contextOrdersService);
    
	function contextOrdersService(getContext, orders_dao, $localStorage, gccService, moment, contextAgrupationsService,
                                  createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal,
                                  agrupationTypeVAL, order_context, agrupationTypeDispatcher, productoService, ensureContext,
                                  setPromise){
        
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         
        var contextOrdersServiceInt = {
            reset: reset,                       // catalogId -> Null
            addOrder: addOrder,                 // catalogId -> Order -> Null
            ensureOrders: ensureOrders,         // catalogId -> OrdersType -> Promise
            getOrdersTypes: getOrdersTypes,
            getOrder: getOrder,
            getOrders: getOrders,
            getOrdersByType: getOrdersByType,
            modifyOrder: modifyOrder            // catalogId -> Order -> Modification -> Null
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
                        console.log(personalOrder, groupOrders);
                        
                        defered.resolve(personalOrder.concat(groupOrders));
                    })
                })
            })
		}
             
        function getOrdersByType(catalogId, ordersType){
            return orders_dao.getOrdersByType(catalogId, ordersType);
        }
        
        
        function modifyOrder(catalogId, order, modification){
            orders_dao.modifyOrder(catalogId, order, modification);
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
                    function doOkPedido(response) {
                        var personalOrder = response.data;
                        personalOrder.type = agrupationTypeVAL.TYPE_PERSONAL;
                        personalOrder.idGrupo = idGrupoPedidoIndividual;
                        personalOrder.aliasGrupo = "Personal";
                        addOrder(catalogId, personalOrder);
                        defered.resolve(orders_dao.getOrdersByType(catalogId, agrupationTypeVAL.TYPE_PERSONAL));
                    }

                    function doOkCrear(response) {
                        productoService.verPedidoIndividual().then(doOkPedido);
                    }

                    var params = {
                        idVendedor: catalogId
                    }

                    //si falla es poque ya tiene un pedido abierto TODO mejorar
                    productoService.crearPedidoIndividual(params, doOkCrear).then(doOkCrear)
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
                        console.log("orders", response.data);
                        vm.ls.lastUpdate = moment();	
                        resetType(catalogId, agrupationTypeVAL.TYPE_GROUP);
                        addOrdersFromGroupsWithoutOrders(catalogId, formatOrders(response.data)).then(function(orders){
                            console.log("Cargando dsd el server:", catalogId, orders);
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

                        console.log(groupsWithoutOrders);

                        createOrdersForGroupsWithoutOrders(groupsWithoutOrders, ordersPreviouslyCreated).then(defered.resolve);
                })
            })
        }
        
        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var vm = this;
		
		vm.ls = $localStorage;
        
		vm.ls.lastUpdate = moment();
        
        return contextOrdersServiceInt;
    }
     
})();   