(function() {
	'use strict';

	angular.module('chasqui').service('contextOrdersService', contextOrdersService);
    
	function contextOrdersService(getContext, $q, orders_dao, $localStorage, gccService, moment, contextAgrupationsService,
                                  createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal,
                                  agrupationTypeVAL, order_context){
        
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         
        var contextOrdersServiceInt = {
            init: init,
            reset: reset,
            getOrdersTypes: getOrdersTypes,
            getOrder: getOrder,
            getOrders: getOrders,
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        /*  
         *  PROP:
         *  PREC:
         *  RET:
         */ 
        function init(){
            orders_dao.reset();
            //order_context.setOrderSelected(idPedidoIndividualGrupoPersonal);
            //addNewOrder(pedidoIndividualVirtual);
        }
            
        function reset(){
            orders_dao.reset();
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
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    addOrdersFromGroupsWithoutOrders(orders_dao.getOrders(catalogId)).then(function(orders){
                            orders_dao.loadOrders(catalogId, orders);
                            defered.resolve(orders_dao);
                        });
                    return promise;                
                },   
                
                orders_dao.getOrders(catalogId).length === 1, 
                
                function(defered){
                    function doOk(response) {	
                        vm.ls.lastUpdate=moment();	
                        init();
                        addOrdersFromGroupsWithoutOrders(response.data).then(function(orders){
                            orders_dao.loadOrders(catalogId, orders);
                            defered.resolve(orders_dao);
                        });
                    }

                    gccService.pedidosByUser(catalogId).then(doOk);                  
                });
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
        function addNewOrder(newOrder){
            if(orders_dao.getOrders().filter(function(o){return o.id == newOrder.id}).length === 0){
                if(newOrder.idGrupo == null){ // Esto significa que es el pedido individual cargado desde el BE
                    newOrder.idGrupo = idGrupoPedidoIndividual;
                    newOrder.aliasGrupo = "Personal";
                    orders_dao.removeOrder(idPedidoIndividualGrupoPersonal);
                    contextAgrupationsService.getAgrupations().then(function(grupos){
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
        
        /* Prop:   creates orders for every group without a created order (order-group is a relation bidirectional)
         * Params: orders :: [Order], a list with all user's open orders.
         * Return: [Order], a list with an order for every user's group plus the individual order
         */
        function addOrdersFromGroupsWithoutOrders(orders){
			var defered = $q.defer();
			var promise = defered.promise;
            contextAgrupationsService.getAgrupations().then(
                function(grupos){
                    var groupsWithoutOrders = grupos.getGroups().filter(function(g){
                        return !(orders.map(function(o){return o.idGrupo}).includes(g.idGrupo) ||  // Filtra los grupos que no tienen pedidos creados
                                 g.alias === "Personal");
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