
(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, setPromise, getContext, agrupations_dao, moment, gccService, 
                                        ensureContext, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal, 
                                        agrupationTypeVAL, agrupationTypeDispatcher){
     
        
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
            agrupations_dao.modifyGroup(catalogId, agrupationId, agrupationType, modification);
        }
        
        function getAgrupation(catalogId, agrupationId, agrupationType){
            return setPromise(function(defered){
                ensureAgrupations(catalogId, agrupationType).then(function(agrupations){
                    defered.resolve(agrupations_dao.getAgrupation(catalogId, agrupationId, agrupationType));
                })
            });
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
        
        
        function ensureAgrupations(catalogId, type){
            return agrupationTypeDispatcher.byType(type, 
                                                   ensurePersonalAgrupation,
                                                   ensureGroupsAgrupations,
                                                   ensureNodesAgrupations
                                                  )(catalogId);
        }
        
        /*  
         *  PROP:   Ensure personal agrupation is cached
         *  PREC:   None
         *  RET:    Promise
         *  Last modification: 20/4/18
         */ 
        function ensurePersonalAgrupation(catalogId){
            return ensureContext(
                vm.ls.lastUpdate, 
                "personal agrupation",
                agrupations_dao.getAgrupationsByType(catalogId, agrupationTypeVAL.TYPE_PERSONAL), 
                function(defered){
                    vm.ls.lastUpdate = moment();	
                    agrupations_dao.newAgrupation(catalogId, grupoIndividualVirtual);
                    defered.resolve(grupoIndividualVirtual);
                });
        }
        
        /*  
         *  PROP:   Ensure groups agrupations are cached
         *  PREC:   None
         *  RET:    Promise
         *  Last modification: 20/4/18
         */ 
        function ensureGroupsAgrupations(catalogId){
            return ensureContext(
                vm.ls.lastUpdate, 
                "groups agrupations",
                agrupations_dao.getAgrupationsByType(catalogId, agrupationTypeVAL.TYPE_GROUP), 
                function(defered){
                    function doOK(response) {					
                        vm.ls.lastUpdate = moment();	
                        var agrupations = formatAgrupations(response.data);
                        agrupations_dao.loadAgrupations(catalogId, agrupations);
                        defered.resolve(agrupations_dao);
                    }
                    gccService.groupsByUser().then(doOK);    
                });
        }
        
        function ensureNodesAgrupations(catalogId){
            
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