
(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, getContext, agrupations_dao, moment, gccService, 
                                        idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal, agrupationTypeVAL){
     
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var contextAgrupationsServiceInt = {
            reset: reset,
            modifyAgrupation: modifyAgrupation,
            getAgrupation: getAgrupation,
            getAgrupations: getAgrupations,
            getAgrupationsByType: getAgrupationsByType
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                    
        function reset(catalogId){
            agrupations_dao.reset(catalogId);
        }
            
        function modifyAgrupation(catalogId, agrupationId, agrupationType, modification){
            console.log("prev", getAgrupation(catalogId, agrupationId, agrupationType));
            agrupations_dao.modifyGroup(catalogId, agrupationId, agrupationType, modification);
            console.log("post", getAgrupation(catalogId, agrupationId, agrupationType));
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
                        var agrupations = formatAgrupations(response.data);
                        agrupations.push(grupoIndividualVirtual);
                        agrupations_dao.loadAgrupations(catalogId, agrupations);
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