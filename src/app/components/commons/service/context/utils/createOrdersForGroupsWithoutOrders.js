(function() {
	'use strict';

	angular.module('chasqui').factory('createOrdersForGroupsWithoutOrders', createOrdersForGroupsWithoutOrders);
    
	function createOrdersForGroupsWithoutOrders($q, $stateParams, gccService, $log, contextCatalogsService, 
                                                 agrupationTypeVAL, contextAgrupationsService){
         
        
        /* Prop: Creates an order for param group
         *
         */
        function createOrderForGroup(group){
			var defered = $q.defer();
			var promise = defered.promise;
            
            contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                function doOK(response) {
                    $log.debug("callCrearPedidoGrupal", response);
                    var newOrder = response.data;
                    newOrder.idGrupo = group.idGrupo;
                    newOrder.aliasGrupo = group.alias;
                    newOrder.type = agrupationTypeVAL.TYPE_GROUP;
                    contextAgrupationsService.modifyAgrupation(catalog.id, group.idGrupo, agrupationTypeVAL.TYPE_GROUP, function(group){
                        group.idPedidoIndividual = newOrder.id;
                        return group; 
                    });
                    defered.resolve(newOrder);
                }

                function doNoOK(response) {
                    $log.debug("error crear gcc individual, seguramente ya tenia pedido",response);
                }

                var params = {
                    idGrupo: group.idGrupo,
                    idVendedor: catalog.id
                }
                
                gccService.crearPedidoGrupal(params, doNoOK).then(doOK);
            })
            
            return promise;
        }
        
        // Interfaz 
        return function (groupsWithoutOrders, orders){
            var defered = $q.defer();
			var promise = defered.promise;
			$log.debug("Groups wo order:", groupsWithoutOrders);
            
            async.each(groupsWithoutOrders, function(group, callback) {  
                $log.debug("Inside");
                createOrderForGroup(group).then(function(newOrder){
                    orders.push(newOrder);
                    $log.debug('Pedido agregado', newOrder, orders);
                    callback();
                })
                
            }, function(err) {
                if( err ) {
                  $log.debug('A file failed to process');
                } else {
                  defered.resolve(orders);
                }
            });
            
            return promise;
        }
    }
     
})();   