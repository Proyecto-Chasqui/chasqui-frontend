(function() {
  'use strict';

  angular.module('chasqui').controller('ListaGruposController', ListaGruposController);

  
  function ListaGruposController($log, $scope, $state, contextCatalogObserver,
                    dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
                    us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {

    $log.debug("controler ListaGruposController");
    navigation_state.goMyGroupsTab();

    $scope.urlBase = URLS.be_base;
    $scope.groups = [];
    $scope.showOptions = [];
    $scope.newGroup = newGroup;
    $scope.showOptionsForGroup = showOptionsForGroup;
    $scope.countOrdersConfirmed = countOrdersConfirmed;

    ///////////////////////////////////////

    function newGroup(){

        function doOk(newGroup){
            contextAgrupationsService.reset(contextPurchaseService.getCatalogContext());
            init();
        }

        dialogCommons.newGroup(doOk);
    }
      
    function showOptionsForGroup(groupIndex){
        $scope.showOptions = $scope.showOptions.map(function(o,i){return i == groupIndex && !o});
    }
      
    function countOrdersConfirmed(group){
        return countOrdersWithState(group, "CONFIRMADO");
    }
      
      
      
    // Privado
      
    function countOrdersWithState(group, state){        
        return group.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == state}).length;
    }
      
    //////////////////////////////////////////
      
    $scope.$on('group-information-actualized', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
        $log.debug("--- find grupos--------");
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                $scope.showOptions = $scope.groups.map(function(g){return false});
            });
        })
    }

    init();

  }

})();
