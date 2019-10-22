(function() {
  'use strict';

  angular.module('chasqui').controller('NodeAdminController', NodeAdminController);

  function NodeAdminController($log, $scope, $state, contextCatalogObserver, $rootScope, perfilService,
                          dialogCommons, toastr, nodeService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService) {

    $scope.saveEdition = saveEdition;
    $scope.deleteGroup = deleteGroup;
    
    $scope.isAdmin = false;
    $scope.urlBase = URLS.be_base;
    $scope.directions = [];
    $scope.nodeRepresentation = {};
    
      
    //////////////////////////// Private ///////////////////////////////////////

    

    function saveEdition() {
      $log.debug("editar grupo", $scope.node);

      function doOk(response) {       
        toastr.success(us.translate('GROUP_EDITION_SAVED_CONTENT'),us.translate('GROUP_EDITION_SAVED_TITLE'));
        contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
          agrupations_dao_int.modifyGroup(contextPurchaseService.getCatalogContext(), 
                                     $scope.node.idNodo,
                                     agrupationTypeVAL.TYPE_NODE,
                                     function(node){
                                       console.log(node);
                                      node.alias = $scope.nodeRepresentation.nombreNodo;
                                      node.descripcion = $scope.nodeRepresentation.descripcion;
                                      node.tipo = $scope.nodeRepresentation.tipoNodo;
                                      node.barrio = $scope.nodeRepresentation.barrio;
                                      console.log(node);
                                      
                                      return node;
                                     });
        })
      }

      // $scope.nodeRepresentation = {
      //   idVendedor: contextPurchaseService.getCatalogContext(),
      //   idNodo: $scope.node.idNodo,
      //   nombreNodo: $scope.node.alias,
      //   descripcion: $scope.node.descripcion,
      //   idDireccion: $scope.node.direccionDelNodo.id,
      //   tipoNodo: $scope.node.tipo,
      //   barrio: $scope.node.barrio
      // }
      
      nodeService.editar($scope.nodeRepresentation).then(doOk);      
    }


    function deleteGroup(group){
        dialogCommons.confirm(
            us.translate('ELIMINAR_GRUPO'), 
            us.translate("SEGURO_ELIMINAR_GCC") + $scope.node.alias + "?" + "\n" +
            "Solo se puede eliminar el grupo si ningún miembro tiene su pedido confirmado o abierto", 
            us.translate('SI_ELIMINAR'), 
            us.translate('CANCELAR'),
            function(result) {
                callDeleteGroup(group);
            },
            function() {
                $log.debug("se quedo");
            }
        )
    }

    /////// REST ////////

    function callDeleteGroup(group){
        $log.debug("group", $scope.node)

        function doOk(response) {
          toastr.success(us.translate('GRUPO_ELIMINADO'), us.translate('AVISO_TOAST_TITLE'));
          contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
            agrupations_dao_int.deleteAgrupation(contextPurchaseService.getCatalogContext(), 
                                            $scope.node.idGrupo,
                                            agrupationTypeVAL.TYPE_GROUP
                                            );
            $scope.$emit("exit-group");
            $state.go('catalog.userGroups.all');
          });
        }

        nodeService.cerrarGrupo(contextPurchaseService.getCatalogContext(), $scope.node.idGrupo).then(doOk);
        
    }
    
    
    // //////////
    // //////REST


    
 
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.isAdmin = $scope.node.esAdministrador;
        function doOk(response) {
          $log.debug('call addresses response ', response);
          console.log(response.data, $scope.node);
          $scope.directions = response.data;
        }
  
        perfilService.verDirecciones().then(doOk);
    }
    
    $rootScope.$on('node-is-loaded', function(event, node) {
        $log.debug("node", node);
        $scope.nodeRepresentation = {
          idVendedor: contextPurchaseService.getCatalogContext(),
          idNodo: $scope.node.idNodo,
          nombreNodo: $scope.node.alias,
          descripcion: $scope.node.descripcion,
          idDireccion: $scope.node.direccionDelNodo.id,
          tipoNodo: $scope.node.tipo,
          barrio: $scope.node.barrio
        }
        init();
    });
    
    
    init();
    
  }
})();