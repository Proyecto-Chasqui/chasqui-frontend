(function() {
  'use strict';

  angular.module('chasqui').controller('GroupAdminController', GroupAdminController);

  function GroupAdminController($log, $scope, $state, contextCatalogObserver, $rootScope,
                          dialogCommons, toastr, gccService, URLS, agrupationTypeVAL,
                          us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {

    $scope.editGroup = editGroup;
    $scope.deleteGroup = deleteGroup;
    
    $scope.isAdmin = false;
    $scope.urlBase = URLS.be_base;
    
      
    //////////////////////////// Private ///////////////////////////////////////

    

    function editGroup(group) {
        dialogCommons.editGroup(group, function(editedGroup){
            contextAgrupationsService.modifyAgrupation(contextPurchaseService.getCatalogContext(), group.idGrupo, agrupationTypeVAL.TYPE_GROUP, function(toModifyGroup){
                toModifyGroup.alias = editedGroup.alias;
                toModifyGroup.descripcion = editedGroup.descripcion;
                $scope.$emit("group-information-actualized");
                return toModifyGroup;
            })
        });
    }


    function deleteGroup(group){
        dialogCommons.confirm(
            us.translate('ELIMINAR_GRUPO'), 
            us.translate("SEGURO_ELIMINAR_GCC") + group.alias + "?" + "\n" +
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
        $log.debug("group", group)

        function doOk(response) {
            location.reload();
        }

        gccService.cerrarGrupo(contextPurchaseService.getCatalogContext(), group.idGrupo).then(doOk);
        
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