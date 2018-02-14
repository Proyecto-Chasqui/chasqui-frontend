(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, getContext, groups_dao, moment, gccService, 
                                        createOrdersForGroupsWithoutOrders, idGrupoPedidoIndividual, 
                                        idPedidoIndividualGrupoPersonal){
     
        ///////////////////////////////////////// Configuration \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
		var vm = this;
		
		vm.ls = $localStorage;
        
        var TYPE_PERSONAL = 'PERSONAL';
        var TYPE_GROUP = 'GROUP';
        var TYPE_NODE = 'NODE';
        
        
        // Representa el concepto de grupo indivial para el caso de que no tiene un pedido abierto
		var grupoIndividualVirtual = {
            alias: "Personal",
            esAdministrador: true,
            idGrupo: idGrupoPedidoIndividual,
            idPedidoIndividual: idPedidoIndividualGrupoPersonal
        }
        
		vm.ls.lastUpdate = moment();	        
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        
        function agrupationsDispatcher(agrupation, personal_function, group_function){ // Agregar nuevos tipos            
            if(agrupation.type === TYPE_PERSONAL){
                return personal_function(agrupation);
            }
            
            if(agrupation.type === TYPE_GROUP){
                return group_function(agrupation);
            }
        }
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function init(){
            groups_dao.reset();
            groups_dao.newGroup(grupoIndividualVirtual);            
        }
            
        function reload(){
            
        }
            
        function getAgrupationsTypes(){
            
        }
            
        function getAgrupation(){
            
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
                        response.data.forEach(groups_dao.newGroup);
                        defered.resolve(groups_dao);
                    }
                    gccService.groupsByUser().then(doOK);    
                });
           
		}
        
        // Interfaz 
        return {
            init: init,
            reload: reload,
            getAgrupationsTypes: getAgrupationsTypes,
            getAgrupation: getAgrupation,
            getAgrupations: getAgrupations
        }
    }
})();     