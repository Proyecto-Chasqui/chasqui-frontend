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
    
    $rootScope.$on('new-group', function(event) {
        init();
    });
      
      
    /////////////////// INIT ////////////////////

    function init(){
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupationsInt){
                $scope.groups = agrupationsInt.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                $scope.groups = $scope.groups.map(function(g){
                    g.alias = g.alias.length > 40? g.alias.slice(0,40) + "..." : g.alias;
                    g.descripcion = g.descripcion && g.descripcion.length > 60? g.descripcion.slice(0,60) + "..." : g.descripcion;
                    return g;
                });
                $rootScope.$broadcast('groups-are-loaded', $scope.group);
            });
        })
    }

    init();

  }

})();
