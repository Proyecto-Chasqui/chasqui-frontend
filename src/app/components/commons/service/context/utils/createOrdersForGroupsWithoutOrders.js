(function() {
	'use strict';

	angular.module('chasqui').factory('createOrdersForGroupsWithoutOrders', createOrdersForGroupsWithoutOrders);
    
	function createOrdersForGroupsWithoutOrders($q, $stateParams, gccService, $log, catalogs_dao){
         
        
        /* Prop: Creates an order for param group
         *
         */
        function createOrderForGroup(group){
			var defered = $q.defer();
			var promise = defered.promise;
            
            function doOK(response) {
				$log.debug("callCrearPedidoGrupal", response);
                defered.resolve(response.data);
			}
                        
            function doNoOK(response) {
				$log.debug("error crear gcc individual, seguramente ya tenia pedido",response);
			}
            
			var params = {}
			params.idGrupo = group.idGrupo;
			params.idVendedor = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName).id;
			gccService.crearPedidoGrupal(params, doNoOK).then(doOK);
            
            return promise;
        }
        
        // Interfaz 
        return function (groupsWithoutOrders, orders){
            var defered = $q.defer();
			var promise = defered.promise;
			console.log("Groups wo order:", groupsWithoutOrders);
            
            async.each(groupsWithoutOrders, function(group, callback) {  
                console.log("Inside");
                createOrderForGroup(group).then(function(newOrder){
                    orders.push(newOrder);
                    console.log('Pedido agregado', newOrder, orders);
                    callback();
                })
                
            }, function(err) {
                if( err ) {
                  console.log('A file failed to process');
                } else {
                  defered.resolve(orders);
                }
            });
            
            return promise;
        }
    }
     
})();   