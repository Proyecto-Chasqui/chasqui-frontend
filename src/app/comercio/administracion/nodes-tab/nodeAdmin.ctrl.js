(function() {
  'use strict';

  angular.module('chasqui').controller('NodeAdminController', NodeAdminController);

  function NodeAdminController($log, $scope, $state, contextCatalogObserver, $rootScope,
                          dialogCommons, toastr, gccService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService) {

    $scope.saveEdition = saveEdition;
    $scope.deleteGroup = deleteGroup;
    
    $scope.isAdmin = false;
    $scope.urlBase = URLS.be_base;
    
      
    //////////////////////////// Private ///////////////////////////////////////

    

    function saveEdition() {
      $log.debug("editar grupo", $scope.group);

      function doOk(response) {       
        toastr.success(us.translate('GROUP_EDITION_SAVED_CONTENT'),us.translate('GROUP_EDITION_SAVED_TITLE'));
        contextPurchaseService.getAgrupations().then(function(agrupationsInt){
          agrupationsInt.modifyGroup(contextPurchaseService.getCatalogContext(), 
                                     $scope.node.idGrupo,
                                     agrupationTypeVAL.TYPE_GROUP,
                                     function(group){
                                      node.alias = $scope.node.alias;
                                      node.descripcion = $scope.node.descripcion;
                                      return group;
                                     });
        })
      }
      
      var params = {
          alias: $scope.node.alias,
          descripcion: $scope.node.descripcion
      }
      
      gccService.editarGrupo($scope.node.idGrupo, params).then(doOk);      
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
        $log.debug("group", $scope.group)

        function doOk(response) {
          toastr.success(us.translate('GRUPO_ELIMINADO'), us.translate('AVISO_TOAST_TITLE'));
          contextPurchaseService.getAgrupations().then(function(agrupationsInt){
            agrupationsInt.deleteAgrupation(contextPurchaseService.getCatalogContext(), 
                                            $scope.node.idGrupo,
                                            agrupationTypeVAL.TYPE_GROUP
                                            );
            $scope.$emit("exit-group");
            $state.go('catalog.userGroups.all');
          });
        }

        gccService.cerrarGrupo(contextPurchaseService.getCatalogContext(), $scope.node.idGrupo).then(doOk);
        
    }
    
    
    // //////////
    // //////REST


    
 
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.isAdmin = $scope.node.esAdministrador;
    }
    
    $rootScope.$on('group-is-loaded', function(event, group) {
        $log.debug("group", group);
        init();
    });
    
    
    init();
    
  }
})();