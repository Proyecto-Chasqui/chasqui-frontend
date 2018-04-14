(function() {
	'use strict';

	angular.module('chasqui').service('contextOrdersService', contextOrdersService);
    
	function contextOrdersService(getContext, $q, orders_dao, $localStorage, gccService, moment, contextAgrupationsService,
                                  createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal,
                                  agrupationTypeVAL, order_context){
        
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         
        var contextOrdersServiceInt = {
            reset: reset,
            getOrdersTypes: getOrdersTypes,
            getOrder: getOrder,
            getOrders: getOrders,
            getOrdersByType: getOrdersByType
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                    
        function reset(catalogId){
            orders_dao.reset(catalogId);
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
            return getContext(
                vm.ls.lastUpdate, 
                "pedidos", 
                
                // Return from cache
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    addOrdersFromGroupsWithoutOrders(catalogId, orders_dao.getOrders(catalogId)).then(function(orders){
                            orders_dao.loadOrders(catalogId, orders);
                            defered.resolve(orders_dao);
                        });
                    return promise;                
                },   
                
                orders_dao.getOrders(catalogId).length === 0, 
                
                // Return from server
                function(defered){
                    function doOk(response) {	
                        vm.ls.lastUpdate=moment();	
                        reset(catalogId);
                        addOrdersFromGroupsWithoutOrders(catalogId, formatOrders(response.data)).then(function(orders){
                            console.log("Cargando dsd el server:", catalogId, orders);
                            orders_dao.loadOrders(catalogId, orders);
                            defered.resolve(orders_dao);
                        });
                    }

                    gccService.pedidosByUser(catalogId).then(doOk);                  
                });
		}
             
        function getOrdersByType(catalogId, ordersType){
            return orders_dao.getOrdersByType(catalogId, ordersType);
        }
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
        
        /*  
         *  PROP:
         *  PREC:
         *  RET:
         */        
        function ordersDispatcher(order, personal_function, group_function){ // Agregar nuevos tipos            
            if(order.type === agrupationTypeVAL.TYPE_PERSONAL){
                return personal_function(order);
            }
            
            if(order.type === agrupationTypeVAL.TYPE_GROUP){
                return group_function(order);
            }
        }
        
        
        /*  
         *  PROP:
         *  PREC:
         *  RET:
         */ 
        
        // DEPRECADO
        function addNewOrder(catalogId, newOrder){
            if(orders_dao.getOrders().filter(function(o){return o.id == newOrder.id}).length === 0){
                if(newOrder.idGrupo == null){ // Esto significa que es el pedido individual cargado desde el BE
                    newOrder.idGrupo = idGrupoPedidoIndividual;
                    newOrder.aliasGrupo = "Personal";
                    orders_dao.removeOrder(idPedidoIndividualGrupoPersonal);
                    contextAgrupationsService.getAgrupations(catalogId).then(function(grupos){
                        grupos.modifyGroup(idGrupoPedidoIndividual, function(group){
                            group.idPedidoIndividual = newOrder.id;
                            return group;
                        })
                    })
                    order_context.setOrderSelected(newOrder.id);
                }
                orders_dao.newOrder(newOrder);
            }
        }
        
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
			var defered = $q.defer();
			var promise = defered.promise;
            contextAgrupationsService.getAgrupations(catalogId).then(
                function(grupos){
                    var groupsWithoutOrders = grupos.getAgrupations(catalogId).filter(function(g){
                        return !orders.map(function(o){return o.idGrupo}).includes(g.idGrupo);  // Filtra los grupos que no tienen pedidos creados
                    });                    
                    createOrdersForGroupsWithoutOrders(groupsWithoutOrders, orders).then(defered.resolve);
                });                   
            return promise;
        }
        
        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var vm = this;
		
		vm.ls = $localStorage;
        
                
        var pedidoIndividualVirtual = {
            type: agrupationTypeVAL.TYPE_PERSONAL,
            aliasGrupo: "Personal",
            estado: "CANCELADO",
            id: idPedidoIndividualGrupoPersonal,
            idGrupo: idGrupoPedidoIndividual,
            productosResponse: []
        }
        
		vm.ls.lastUpdate = moment();
        
        return contextOrdersServiceInt;
    }
     
})();   