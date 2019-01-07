(function() {
  'use strict';

  angular.module('chasqui').controller('GroupsController', GroupsController);

  
  function GroupsController($scope, $rootScope, $stateParams, contextCatalogObserver, contextPurchaseService, 
                             agrupationTypeVAL, navigation_state, $log) {

    
    $log.debug("controler ListaGruposController");
    navigation_state.goMyGroupsTab();
    
    $scope.groups = [];

    ///////////////////////////////////////

      
    // Privado
      
    //////////////////////////////////////////
      
    $rootScope.$on('group-information-actualized', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                $rootScope.$broadcast('groups-are-loaded', $scope.group);
            });
        })
    }

    init();

  }

})();
