
(function() {
	'use strict';

	angular.module('chasqui').service('contextAgrupationsService', contextAgrupationsService);
    
	function contextAgrupationsService($localStorage, $q, setPromise, getContext, agrupations_dao, moment, gccService, 
                                        ensureContext, idGrupoPedidoIndividual, idPedidoIndividualGrupoPersonal, 
                                        agrupationTypeVAL, agrupationTypeDispatcher, usuario_dao, nodeService, contextCatalogsService){
     
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        var contextAgrupationsServiceInt = {
            reset: reset,
            modifyAgrupation: modifyAgrupation,
            getAgrupation: getAgrupation,
            getAgrupations: getAgrupations,
            getAgrupationsByType: getAgrupationsByType,
            confirmAgrupationOrder: confirmAgrupationOrder,
            cancelAgrupationOrder: cancelAgrupationOrder,
            confirmPersonalOrder: confirmPersonalOrder,
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
                ensureAgrupations(catalogId, agrupationType).then(function(){
                    defered.resolve(agrupations_dao.getAgrupation(catalogId, agrupationId, agrupationType));
                })
            });
        }

        
        function getAgrupations(catalogId) {
          // return setPromise(function(defered){
          //   ensureAgrupations(catalogId, agrupationType).then(function(agrupations){
          //     defered.resolve(agrupations);
          //   });
          // });

          return getContext(
            vm.ls.lastUpdate,
            //moment().add(-1.5, 'days'),
            "todos", 
            
            // Si la cache esta actualizada la retorna
            function(){
                var defered = $q.defer();
                var promise = defered.promise;
                defered.resolve(agrupations_dao);
                return promise;                
            },                
            
            agrupations_dao.getAgrupations(catalogId).length === 0, 
            
            // Si la cache esta NO actualizada la actualiza y despues la retorna
            function(defered){
              var agrupations = [grupoIndividualVirtual];
              contextCatalogsService.getCatalog(parseInt(catalogId)).then(function(catalog){

                function setAndReturn(){
                  vm.ls.lastUpdate=moment();	
                  agrupations_dao.loadAgrupations(catalogId, agrupations);
                  defered.resolve(agrupations_dao);
                }

                // Si el catalogo tiene grupos NO tiene nodos y viceversa
                if(catalog.few.gcc){
                  gccService.groupsByUser().then(function(responseGroups) {
                    var groups = formatAgrupations(responseGroups.data, agrupationTypeVAL.TYPE_GROUP);
                    agrupations = agrupations.concat(groups);
                    setAndReturn();
                  });                  
                }

                if(catalog.few.nodos){
                  nodeService.nodosTodos(catalogId).then(function (responseNodes) {
                    var nodes = formatAgrupations(responseNodes.data, agrupationTypeVAL.TYPE_NODE);
                    agrupations = agrupations.concat(nodes);
                    setAndReturn();
                  });
                }
              })
            });
		    }
        
        function getAgrupationsByType(catalogId, type){
          return setPromise(function(defered){
            defered.resolve(agrupations_dao.getAgrupationsByType(catalogId, type));
          })
        }
        
        function confirmAgrupationOrder(catalogId, agrupationId, agrupationType){
          modifyAgrupation(catalogId, agrupationId, agrupationType, function(group){
            group.idPedidoIndividual = -agrupationId;
            group.miembros = group.miembros.map(function(m){
              if(m.invitacion == "NOTIFICACION_ACEPTADA"){
                m.estadoPedido = "ABIERTO";
                m.pedido = null;
              }
              return m;
            })
            return group;
          })
        }

        function cancelAgrupationOrder(catalogId, agrupationId, agrupationType){
          modifyAgrupation(catalogId, agrupationId, agrupationType, function(agrupation){
            agrupation.miembros = agrupation.miembros.map(function(m){
              if(m.email == usuario_dao.getUsuario().email){
                m.estadoPedido = "ABIERTO";
                m.pedido = null;
              }
              return m;
            })
            return agrupation;
          })
        }
        
        function confirmPersonalOrder(catalogId, agrupationId, agrupationType, personalOrder){
          modifyAgrupation(catalogId, agrupationId, agrupationType, function(group){
            group.miembros = group.miembros.map(function(m){
              if(m.email == usuario_dao.getUsuario().email){
                m.pedido = personalOrder;
                m.pedido.estado = "CONFIRMADO";
              }
              return m;
            })
            return group;
          })
        }
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function formatAgrupations(agrupationsFromServer, type){
            return agrupationsFromServer.map(function(g){g.type = type; return g;});
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
                        var agrupations = formatAgrupations(response.data, agrupationTypeVAL.TYPE_GROUP);
                        agrupations_dao.loadAgrupations(catalogId, agrupations);
                        defered.resolve(agrupations_dao);
                    }
                    gccService.groupsByUser().then(doOK);    
                });
        }
        
        function ensureNodesAgrupations(catalogId){
             return ensureContext(
                vm.ls.lastUpdate, 
                "nodes agrupations",
                agrupations_dao.getAgrupationsByType(catalogId, agrupationTypeVAL.TYPE_NODE), 
                function(defered){
                    function doOK(response) {					
                        vm.ls.lastUpdate = moment();	
                        var agrupations = formatAgrupations(response.data, agrupationTypeVAL.TYPE_NODE);
                        agrupations_dao.loadAgrupations(catalogId, agrupations);
                        defered.resolve(agrupations_dao);
                    }
                    nodeService.nodosTodos(catalogId).then(doOK);  
                });
        }
        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
		var vm = this;
		
		vm.ls = $localStorage;
        
        
    // Representa el concepto de grupo indivial para el caso de que no tiene un pedido abierto
		var grupoIndividualVirtual = {
            type: agrupationTypeVAL.TYPE_PERSONAL,
            alias: "Personal",
            esAdministrador: true,
            id: idGrupoPedidoIndividual,
            idPedidoIndividual: idPedidoIndividualGrupoPersonal
        }
        
		vm.ls.lastUpdate = moment();
        
        return contextAgrupationsServiceInt;
    }
})();     