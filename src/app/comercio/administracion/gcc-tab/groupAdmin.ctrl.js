(function() {
  'use strict';

  angular.module('chasqui').controller('GroupAdminController', GroupAdminController);

  function GroupAdminController($log, $scope, $state, contextCatalogObserver, $rootScope,
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
        contextPurchaseService.getAgrupations()
          .then(function(agrupations_dao_int){
            agrupations_dao_int.modifyGroup(contextPurchaseService.getCatalogContext(), 
                                      $scope.group.id,
                                      agrupationTypeVAL.TYPE_GROUP,
                                      function(group){
                                        group.alias = $scope.group.alias;
                                        group.descripcion = $scope.group.descripcion;
                                        return group;
                                      });
          })
          .then(function(){

          })
      }
      
      var params = {
          alias: $scope.group.alias,
          descripcion: $scope.group.descripcion
      }
      
      gccService.editarGrupo($scope.group.id, params).then(doOk);      
    }


    function deleteGroup(group){
        dialogCommons.confirm(
            us.translate('ELIMINAR_GRUPO'), 
            us.translate("SEGURO_ELIMINAR_GCC") + $scope.group.alias + "?" + "\n" +
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
          contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
            agrupations_dao_int.deleteAgrupation(contextPurchaseService.getCatalogContext(), 
                                            $scope.group.id,
                                            agrupationTypeVAL.TYPE_GROUP
                                            );
            $scope.$emit("exit-group");
            $state.go('catalog.userGroups.all');
          });
        }

        gccService.cerrarGrupo(contextPurchaseService.getCatalogContext(), $scope.group.id).then(doOk);
        
    }
    
    
    // //////////
    // //////REST


    
 
    //////////////////////////// INIT ///////////////////////////////////////
    
    function init(){
        $scope.isAdmin = $scope.group.esAdministrador;
    }
    
    $rootScope.$on('group-is-loaded', function(event, group) {
        $log.debug("group", group);
        init();
    });
    
    
    init();
    
  }
})();