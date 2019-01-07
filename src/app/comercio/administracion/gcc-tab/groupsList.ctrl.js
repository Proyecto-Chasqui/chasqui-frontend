(function() {
  'use strict';

  angular.module('chasqui').controller('GroupsListController', GroupsListController);

  
  function GroupsListController($log, $scope, $rootScope, $state, contextCatalogObserver,
                    dialogCommons, ToastCommons, gccService, URLS, agrupationTypeVAL,
                    us, usuario_dao, navigation_state, contextPurchaseService, contextAgrupationsService) {


    $scope.urlBase = URLS.be_base;
    $scope.showOptions = [];
    $scope.newGroup = newGroup;
    $scope.showOptionsForGroup = showOptionsForGroup;
    $scope.countOrdersConfirmed = countOrdersConfirmed;
    $scope.getClassForItemGroup = getClassForItemGroup;

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
      
      
    function getClassForItemGroup(i){
        return $scope.showOptions[i]? "ch-item-selected" : "ch-item-no-selected";
    }
      
    // Privado
      
    function countOrdersWithState(group, state){        
        return group.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == state}).length;
    }
      
    //////////////////////////////////////////
      
    $rootScope.$on('group-information-actualized', init);
      
    $rootScope.$on('groups-are-loaded', init);
      
    /////////////////// INIT ////////////////////

    function init(){
        $scope.showOptions = $scope.groups.map(function(g){return false});
    }

    init();

  }

})();
