(function() {
	'use strict';

	angular.module('chasqui').factory('createOrdersForGroupsWithoutOrders', createOrdersForGroupsWithoutOrders);
    
	function createOrdersForGroupsWithoutOrders($q, $stateParams, gccService, $log, contextCatalogsService, 
                                                 agrupationTypeVAL, contextAgrupationsService){
         
        
    /* Prop: Creates an order for param agrupation
      *
      */
    function createOrderForGroup(agrupation){
			var defered = $q.defer();
			var promise = defered.promise;
            
      contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
          // nueva implementacion

          const newOrder = {
            id: -agrupation.id,
            idGrupo: agrupation.id,
            idVendedor: catalog.id,
            estado: "NO_ABIERTO",
            aliasGrupo: agrupation.alias,
            type: agrupation.type,
            montoMinimo: 600.0,
            montoActual: 0.0,
            productosResponse: []
          }

          contextAgrupationsService.modifyAgrupation(catalog.id, 
                                                     agrupation.id, 
                                                     agrupation.type, function(agrupation){
            agrupation.idPedidoIndividual = newOrder.id;

            defered.resolve(newOrder);
            return agrupation; 
          });
      })
      
      return promise;
    }
        
    // Interfaz 
    return function (agrupationsWithoutOrders, orders){
      var defered = $q.defer();
			var promise = defered.promise;
			$log.debug("Groups wo order:", agrupationsWithoutOrders);
            
            async.each(agrupationsWithoutOrders, function(agrupation, callback) {  
                $log.debug("Inside");
                createOrderForGroup(agrupation).then(function(newOrder){
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