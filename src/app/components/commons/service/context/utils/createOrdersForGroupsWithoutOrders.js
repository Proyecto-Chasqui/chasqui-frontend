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
          // nueva implementacion

          const newOrder = {
            id: -group.idGrupo,
            idGrupo: group.idGrupo,
            idVendedor: catalog.id,
            estado: "NO_ABIERTO",
            aliasGrupo: group.alias,
            type: agrupationTypeVAL.TYPE_GROUP,
            montoMinimo: 600.0,
            montoActual: 0.0,
            productosResponse: []
          }

          contextAgrupationsService.modifyAgrupation(catalog.id, group.idGrupo, agrupationTypeVAL.TYPE_GROUP, function(group){
            group.idPedidoIndividual = newOrder.id;

            defered.resolve(newOrder);
            return group; 
          });
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