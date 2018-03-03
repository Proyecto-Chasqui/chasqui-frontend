
(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, getContext, agrupations_dao, moment, gccService, 
                                        createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, 
                                        idPedidoIndividualGrupoPersonal, agrupationTypeVAL){
     
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var contextAgrupationsServiceInt = {
            reset: reset,
            getAgrupation: getAgrupation,
            getAgrupations: getAgrupations,
            getAgrupationsByType: getAgrupationsByType
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                    
        function reset(catalogId){
            agrupations_dao.reset(catalogId);
        }
            
        function getAgrupation(catalogId, agrupationId, agrupationType){
            return agrupations_dao.getAgrupation(catalogId, agrupationId, agrupationType);
        }
        
        function getAgrupations(catalogId) {
            return getContext(
                vm.ls.lastUpdate,
                "grupos", 
                
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve(agrupations_dao);
                    return promise;                
                },                
                
                agrupations_dao.getAgrupations(catalogId).length === 0, 
                
                function(defered){
                    function doOK(response) {					
                        vm.ls.lastUpdate=moment();	
                        agrupations_dao.loadAgrupations(catalogId, formatAgrupations(response.data));
                        defered.resolve(agrupations_dao);
                    }
                    gccService.groupsByUser().then(doOK);    
                });
		}
        
        function getAgrupationsByType(catalogId, type){
            return agrupations_dao.getAgrupationsByType(catalogId, type);
        }
        
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function formatAgrupations(agrupationsFromServer){
            return agrupationsFromServer.map(function(g){g.type = agrupationTypeVAL.TYPE_GROUP; return g;});
        }
        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
		var vm = this;
		
		vm.ls = $localStorage;
        
        
        // Representa el concepto de grupo indivial para el caso de que no tiene un pedido abierto
		var grupoIndividualVirtual = {
            type: agrupationTypeVAL.TYPE_PERSONAL,
            alias: "Personal",
            esAdministrador: true,
            idGrupo: idGrupoPedidoIndividual,
            idPedidoIndividual: idPedidoIndividualGrupoPersonal
        }
        
		vm.ls.lastUpdate = moment();
        
        return contextAgrupationsServiceInt;
    }
})();     