
(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, getContext, groups_dao, moment, gccService, 
                                        createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, 
                                        idPedidoIndividualGrupoPersonal, agrupationTypeVAL){
     
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var contextAgrupationsServiceInt = {
            init: init,
            reset: reset,
            getAgrupationsTypes: getAgrupationsTypes,
            getAgrupation: getAgrupation,
            getAgrupations: getAgrupations
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function init(){
            groups_dao.reset();
            groups_dao.newGroup(grupoIndividualVirtual);            
        }
            
        function reset(){
            groups_dao.reset();
        }
            
        function getAgrupationsTypes(){
            
        }
            
        function getAgrupation(searchedAgrupation){
            return groups_dao.getGroup(searchedAgrupation);
            //return agrupationDispatcher(searchedAgrupation.type, function(personalAgrupation){return personalAgrupation})
        }
        
        function getAgrupations() {
            return getContext(
                vm.ls.lastUpdate,
                "grupos", 
                function(){
                    var defered = $q.defer();
                    var promise = defered.promise;
                    defered.resolve(groups_dao);
                    return promise;                
                },                
                groups_dao.getGroups().length === 1, 
                function(defered){
                    function doOK(response) {					
                        vm.ls.lastUpdate=moment();	
                        init();
                        response.data.map(function(g){g.type = agrupationTypeVAL.TYPE_GROUP; return g;}).forEach(groups_dao.newGroup);
                        defered.resolve(groups_dao);
                    }
                    gccService.groupsByUser().then(doOK);    
                });
           
		}
        
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        
        function agrupationDispatcher(type, agrupationId, personal_function, group_function){ 
            // Agregar nuevos tipos            
            if(type === agrupationTypeVAL.TYPE_PERSONAL){
                return personal_function(agrupationId);
            }
            
            if(type === agrupationTypeVAL.TYPE_GROUP){
                return group_function(agrupationId);
            }
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